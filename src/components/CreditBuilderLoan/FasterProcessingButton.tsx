"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Zap } from "lucide-react";

// ✅ Removed: SabpaisaPaymentGateway import (modal-based, deleted)

interface FasterProcessingButtonProps {
  applicationId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

export default function FasterProcessingButton({
  applicationId,
  customerName,
  customerPhone,
  customerEmail,
}: FasterProcessingButtonProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ Removed: showPaymentModal and paymentDetails state

  const handlePayment = async () => {
    if (!applicationId) {
      toast({
        title: "Payment Error",
        description: "Application ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Correlation key so we can tie this payment back to the application
      const clientReferenceId =
        `FASTER-${applicationId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.slice(
          0,
          38,
        );

      sessionStorage.setItem("fasterProcessingApplicationId", applicationId);

      // ✅ Call the new SabPaisa API route — credentials stay server-side
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 146, // sabpaisa-sdk expects rupees
          customerName,
          customerEmail,
          customerPhone,
          description: `Faster Processing - Application ${applicationId}`,
          clientReferenceId,
        }),
      });

      const paymentResult = await res.json();

      if (!paymentResult.success || !paymentResult.checkoutUrl) {
        throw new Error(paymentResult.message || "Failed to initiate payment");
      }

      // ✅ Store txn ID for reference on the return page and redirect
      sessionStorage.setItem("pendingTxnId", paymentResult.merchantTxnId);
      window.location.href = paymentResult.checkoutUrl;

      // isProcessing stays true — page is navigating away
    } catch (error) {
      toast({
        title: "Payment Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during payment initiation",
        variant: "destructive",
      });
      setIsProcessing(false); // only reset on failure
    }
  };

  // ✅ Removed: handlePaymentToggle (no modal to toggle)

  return (
    <Button
      onClick={handlePayment}
      className="w-full py-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-base sm:text-lg rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
          Processing...
        </>
      ) : (
        <>
          <Zap className="mr-3 h-5 w-5" />
          Pay ₹146 for Instant Processing
        </>
      )}
    </Button>

    // ✅ Removed: SabpaisaPaymentGateway modal — redirect handles payment now
  );
}
