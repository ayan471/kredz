"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import {
  saveCreditBuilderData,
  submitCreditBuilderSubscription,
} from "@/actions/formActions";

type FormValues = {
  fullName: string;
  phoneNo: string;
  aadharNo: string;
  panNo: string;
  creditScore: string;
  plan: string;
};

const saveFormDataToSessionStorage = (data: Partial<FormValues>) => {
  try {
    sessionStorage.setItem("creditBuilderFormData", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving form data to sessionStorage:", error);
  }
};

const getFormDataFromSessionStorage = (): Partial<FormValues> | null => {
  try {
    const savedData = sessionStorage.getItem("creditBuilderFormData");
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error retrieving form data from sessionStorage:", error);
    return null;
  }
};

const clearFormDataFromSessionStorage = () => {
  try {
    sessionStorage.removeItem("creditBuilderFormData");
  } catch (error) {
    console.error("Error clearing form data from sessionStorage:", error);
  }
};

interface CreditBuilderFormProps {
  selectedPlan: string | null;
}

const CreditBuilderForm: React.FC<CreditBuilderFormProps> = ({
  selectedPlan,
}) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      phoneNo: "",
      aadharNo: "",
      panNo: "",
      creditScore: "",
      plan: selectedPlan || "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  // Pre-fill from Clerk profile
  useEffect(() => {
    if (user) {
      setValue(
        "fullName",
        `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      );
      if (user.phoneNumbers && user.phoneNumbers.length > 0) {
        setValue("phoneNo", user.phoneNumbers[0].phoneNumber || "");
      }
    }
  }, [user, setValue]);

  // Restore saved form data on mount
  useEffect(() => {
    const savedData = getFormDataFromSessionStorage();
    if (savedData) {
      Object.entries(savedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as keyof FormValues, value);
        }
      });
      toast({
        title: "Form Data Restored",
        description: "Your previously entered information has been restored.",
      });
    }
  }, [setValue, toast]);

  // Auto-save form data on change
  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (formData && Object.keys(formData).length > 0) {
        saveFormDataToSessionStorage(formData);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit an application.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPlan) {
      toast({
        title: "Plan Selection Required",
        description: "Please select a subscription plan.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save application data — action gets userId from currentUser() internally
      const saveResult = await saveCreditBuilderData({
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        aadharNo: data.aadharNo,
        panNo: data.panNo,
        creditScore: data.creditScore,
      });

      if (!saveResult.success) {
        throw new Error(saveResult.error || "Failed to save application data");
      }

      // 2. Create subscription — action gets userId from auth() internally
      const subscriptionResult = await submitCreditBuilderSubscription({
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        plan: selectedPlan,
      });

      if (!subscriptionResult.success) {
        throw new Error(
          subscriptionResult.error || "Failed to submit subscription",
        );
      }

      // 3. Calculate amount from selected plan
      let baseAmount = 0;
      let gstAmount = 0;
      let totalAmount = 0;

      const planParts = selectedPlan.split(" ");
      const planDuration = Number.parseInt(planParts[0]);
      const planType = planParts.length > 2 ? planParts[2] : null;

      if (planDuration === 1) {
        baseAmount = 189;
        gstAmount = 34.02;
        totalAmount = 223.02;
      } else if (planDuration === 3) {
        baseAmount = 299;
        gstAmount = 53.82;
        totalAmount = 352.82;
      } else if (planDuration === 6) {
        baseAmount = 526;
        gstAmount = 94.68;
        totalAmount = 620.68;
      } else if (planDuration === 9) {
        baseAmount = 779;
        gstAmount = 140.22;
        totalAmount = 919.22;
      } else if (planDuration === 12) {
        baseAmount = 1015;
        gstAmount = 182.7;
        totalAmount = 1197.7;
      } else if (planDuration === 18) {
        baseAmount = 1520;
        gstAmount = 273.6;
        totalAmount = 1793.6;
      } else if (planDuration === 24) {
        if (planType === "PRIME") {
          baseAmount = 3275;
          gstAmount = 589.5;
          totalAmount = 3864.5;
        } else {
          baseAmount = 2025;
          gstAmount = 364.5;
          totalAmount = 2389.5;
        }
      } else if (planDuration === 36) {
        baseAmount = 4545;
        gstAmount = 818.1;
        totalAmount = 5363.1;
      } else {
        baseAmount = 189;
        gstAmount = 34.02;
        totalAmount = 223.02;
      }

      // 4. Build a client-side reference ID to correlate with the SabPaisa txn
      const clientReferenceId =
        `CB-${user.id.substring(0, 8)}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`.slice(
          0,
          38,
        );

      sessionStorage.setItem("creditBuilderClientRef", clientReferenceId);
      clearFormDataFromSessionStorage();

      // 5. Create the SabPaisa payment session server-side
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount, // sabpaisa-sdk expects rupees
          customerName: data.fullName,
          customerEmail: user.primaryEmailAddress?.emailAddress || "",
          customerPhone: data.phoneNo,
          description: `${selectedPlan} Plan - ₹${baseAmount.toFixed(2)} + ₹${gstAmount.toFixed(2)} GST`,
          clientReferenceId,
        }),
      });

      const paymentResult = await res.json();

      if (!paymentResult.success || !paymentResult.checkoutUrl) {
        throw new Error(paymentResult.message || "Failed to initiate payment");
      }

      // 6. Store SabPaisa's txn ID and redirect to checkout
      sessionStorage.setItem("pendingTxnId", paymentResult.merchantTxnId);
      window.location.href = paymentResult.checkoutUrl;

      // isSubmitting stays true — page is navigating away
    } catch (error) {
      console.error("Error submitting credit builder application:", error);
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error processing your application. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 bg-orange-50 p-6 rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              {...register("fullName", {
                required: "Full name is required",
              })}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phoneNo">Phone Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                +91
              </span>
              <Input
                type="text"
                inputMode="numeric"
                id="phoneNo"
                className="pl-10"
                {...register("phoneNo", {
                  required: "Phone number is required",
                  minLength: {
                    value: 10,
                    message: "Phone number must be exactly 10 digits",
                  },
                  maxLength: {
                    value: 10,
                    message: "Phone number must be exactly 10 digits",
                  },
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit number",
                  },
                })}
                onChange={(e) => {
                  const cleaned = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  e.target.value = cleaned;
                  setValue("phoneNo", cleaned, { shouldValidate: true });
                }}
              />
            </div>
            {errors.phoneNo && (
              <p className="text-sm text-red-500">{errors.phoneNo.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-orange-50 p-6 rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="aadharNo">Aadhar Number</Label>
            <Input
              type="number"
              id="aadharNo"
              {...register("aadharNo", {
                required: "Aadhar number is required",
                pattern: {
                  value: /^[0-9]{12}$/,
                  message: "Please enter a valid 12-digit Aadhar number",
                },
              })}
            />
            {errors.aadharNo && (
              <p className="text-sm text-red-500">{errors.aadharNo.message}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="panNo">PAN Number</Label>
            <Input
              type="text"
              id="panNo"
              {...register("panNo", {
                required: "PAN number is required",
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: "Please enter a valid PAN number (e.g., ABCDE1234F)",
                },
              })}
            />
            {errors.panNo && (
              <p className="text-sm text-red-500">{errors.panNo.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="mt-8 bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
              Processing...
            </>
          ) : (
            "Submit and Proceed to Payment"
          )}
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default CreditBuilderForm;
