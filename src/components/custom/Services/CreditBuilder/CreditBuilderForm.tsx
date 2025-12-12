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
import { useRouter } from "next/navigation";
import {
  saveCreditBuilderData,
  submitCreditBuilderSubscription,
} from "@/actions/formActions";
import SabpaisaPaymentGateway from "@/components/sabpaisa-payment-gateway";
import { initiateSabpaisaPayment } from "@/components/lib/sabPaisa";

type FormValues = {
  fullName: string;
  phoneNo: string;
  aadharNo: string;
  panNo: string;
  creditScore: string;
  plan: string;
};

// Utility functions for form data persistence
const saveFormDataToLocalStorage = (data: Partial<FormValues>) => {
  try {
    sessionStorage.setItem("creditBuilderFormData", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving form data to sessionStorage:", error);
  }
};

const getFormDataFromLocalStorage = (): Partial<FormValues> | null => {
  try {
    const savedData = sessionStorage.getItem("creditBuilderFormData");
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error retrieving form data from sessionStorage:", error);
    return null;
  }
};

const clearFormDataFromLocalStorage = () => {
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
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sabpaisa payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

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

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setValue(
        "fullName",
        `${user.firstName || ""} ${user.lastName || ""}`.trim()
      );

      // If user has a phone number in their profile
      if (user.phoneNumbers && user.phoneNumbers.length > 0) {
        setValue("phoneNo", user.phoneNumbers[0].phoneNumber || "");
      }
    }
  }, [user, setValue]);

  // Load saved form data when component mounts
  useEffect(() => {
    const savedData = getFormDataFromLocalStorage();
    if (savedData) {
      // Populate form with saved data
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

  // Save form data whenever it changes
  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (formData && Object.keys(formData).length > 0) {
        saveFormDataToLocalStorage(formData);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Find the onSubmit function and update it to include plan details
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
      // First save the credit builder form data
      const formData = {
        userId: user.id,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        aadharNo: data.aadharNo,
        panNo: data.panNo,
        creditScore: data.creditScore,
      };

      const saveResult = await saveCreditBuilderData(formData);

      if (!saveResult.success) {
        throw new Error(saveResult.error || "Failed to save application data");
      }

      // Then submit the subscription
      const subscriptionData = {
        userId: user.id,
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        plan: selectedPlan,
      };

      const subscriptionResult =
        await submitCreditBuilderSubscription(subscriptionData);

      if (!subscriptionResult.success) {
        throw new Error(
          subscriptionResult.error || "Failed to submit subscription"
        );
      }

      // Calculate payment amount based on the selected plan
      let baseAmount = 0;
      let gstAmount = 0;
      let totalAmount = 0;

      // Extract plan details - handle both formats (with and without type)
      const planParts = selectedPlan.split(" ");
      const planDuration = Number.parseInt(planParts[0]);
      const planType = planParts.length > 2 ? planParts[2] : null;

      // Exact pricing from the PDF
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
        if (planType === "BASIC" || !planType) {
          baseAmount = 2025;
          gstAmount = 364.5;
          totalAmount = 2389.5;
        } else if (planType === "PRIME") {
          baseAmount = 3275;
          gstAmount = 589.5;
          totalAmount = 3864.5;
        }
      } else if (planDuration === 36) {
        baseAmount = 4545;
        gstAmount = 818.1;
        totalAmount = 5363.1;
      } else {
        // Default fallback
        baseAmount = 189;
        gstAmount = 34.02;
        totalAmount = 223.02;
      }

      // Generate a truly unique order ID with timestamp (including milliseconds) and multiple random strings
      const timestamp = Date.now();
      const randomStr1 = Math.random().toString(36).substring(2, 10);
      const randomStr2 = Math.random().toString(36).substring(2, 6);
      const randomStr3 = Math.random().toString(36).substring(2, 6);
      // Create a unique ID that includes multiple random components and the full timestamp
      const orderId =
        `CB-${user.id.substring(0, 8)}-${timestamp}-${randomStr1}-${randomStr2}-${randomStr3}`.slice(
          0,
          38
        );
      console.log("Generated unique transaction ID:", orderId);

      // Clear any previously stored transaction IDs to avoid conflicts
      localStorage.removeItem("creditBuilderTxnId");
      localStorage.removeItem("lastSabpaisaTxnId");
      // Store the new transaction ID in localStorage
      localStorage.setItem("creditBuilderTxnId", orderId);
      localStorage.setItem("lastSabpaisaTxnId", orderId);

      // Clear saved form data after successful payment initiation
      clearFormDataFromLocalStorage();

      // Initiate Sabpaisa payment
      const paymentResult = await initiateSabpaisaPayment({
        amount: totalAmount,
        orderId,
        customerName: data.fullName,
        customerPhone: data.phoneNo,
        customerEmail: user.primaryEmailAddress?.emailAddress || "",
        planDetails: `${selectedPlan} Plan - ₹${baseAmount.toFixed(2)} + ₹${gstAmount.toFixed(2)} GST`,
        callbackUrl: `${window.location.origin}/api/payment/callback`,
      });

      if (paymentResult.success && paymentResult.paymentDetails) {
        // Set payment details and show the Sabpaisa payment modal
        setPaymentDetails(paymentResult.paymentDetails);
        setShowPaymentModal(true);
      } else {
        throw new Error(paymentResult.error || "Failed to initiate payment");
      }
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentToggle = () => {
    setShowPaymentModal(false);
    // Redirection will be handled by the PaymentStatusListener component
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

            {/* 1. Add a relative wrapper div */}
            <div className="relative">
              {/* 2. Add the prefix text absolutely positioned to the left */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                +91
              </span>

              <Input
                type="tel"
                id="phoneNo"
                // 3. Add padding-left (pl-10) so the user's typing doesn't overlap the +91
                className="pl-10"
                {...register("phoneNo", {
                  required: "Phone number is required",
                })}
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

        {/* <div className="flex flex-col gap-6 bg-orange-50 p-6 rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="creditScore">Credit Score</Label>
            <Input
              type="text"
              id="creditScore"
              {...register("creditScore", {
                required: "Credit score is required",
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: "Please enter a valid credit score (e.g., 750)",
                },
              })}
            />
            {errors.creditScore && (
              <p className="text-sm text-red-500">
                {errors.creditScore.message}
              </p>
            )}
          </div>
        </div> */}

        <Button
          type="submit"
          className="mt-8 bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processing...
            </>
          ) : (
            "Submit and Proceed to Payment"
          )}
        </Button>
      </form>

      {/* Sabpaisa Payment Gateway Modal */}
      {showPaymentModal && paymentDetails && (
        <SabpaisaPaymentGateway
          clientCode={paymentDetails.clientCode}
          transUserName={paymentDetails.transUserName}
          transUserPassword={paymentDetails.transUserPassword}
          authkey={paymentDetails.authkey}
          authiv={paymentDetails.authiv}
          payerName={paymentDetails.payerName}
          payerEmail={paymentDetails.payerEmail}
          payerMobile={paymentDetails.payerMobile}
          clientTxnId={paymentDetails.clientTxnId}
          amount={paymentDetails.amount}
          payerAddress={paymentDetails.payerAddress}
          callbackUrl={paymentDetails.callbackUrl}
          isOpen={showPaymentModal}
          onToggle={handlePaymentToggle}
        />
      )}

      <DevTool control={control} />
    </div>
  );
};

export default CreditBuilderForm;
