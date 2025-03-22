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
      const planDuration = Number.parseInt(selectedPlan.split(" ")[0]);
      let baseAmount = 0;

      // This should match your pricing logic from CreditBuilderPlans.tsx
      switch (planDuration) {
        case 1:
          baseAmount = 189;
          break;
        case 3:
          baseAmount = 299;
          break;
        case 6:
          baseAmount = 526;
          break;
        case 9:
          baseAmount = 779;
          break;
        case 12:
          baseAmount = 1015;
          break;
        case 15:
          baseAmount = 1265;
          break;
        case 18:
          baseAmount = 1518;
          break;
        case 21:
          baseAmount = 1768;
          break;
        case 24:
          baseAmount = 2018;
          break;
        default:
          baseAmount = 189;
      }

      const gstAmount = baseAmount * 0.18;
      const totalAmount = baseAmount + gstAmount;

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
            <Input
              type="tel"
              id="phoneNo"
              disabled
              {...register("phoneNo", {
                required: "Phone number is required",
              })}
            />
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

        <div className="flex flex-col gap-6 bg-orange-50 p-6 rounded-xl">
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
        </div>

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
