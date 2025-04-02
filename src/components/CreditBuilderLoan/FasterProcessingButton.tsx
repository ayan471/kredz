"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SabpaisaPaymentGateway from "@/components/sabpaisa-payment-gateway";
import { Zap } from "lucide-react";

interface FasterProcessingButtonProps {
  applicationId?: string; // Make applicationId optional
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (!applicationId) {
        throw new Error("Application ID not found");
      }

      // Store the application ID in localStorage for recovery if needed
      localStorage.setItem("lastFasterProcessingApplication", applicationId);

      // Generate a unique transaction ID with timestamp and random components
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 10);
      const uniqueOrderId = `FASTER-${applicationId}-${timestamp}-${randomStr}`;

      // Initiate Sabpaisa payment
      const response = await fetch("/api/initiate-sabpaisa-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 47.2,
          orderId: uniqueOrderId,
          customerName,
          customerPhone,
          customerEmail,
          paymentType: "faster_processing",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate payment");
      }

      const paymentData = await response.json();

      if (paymentData.success && paymentData.paymentDetails) {
        // Set payment details and show the Sabpaisa payment modal
        setPaymentDetails(paymentData.paymentDetails);
        setShowPaymentModal(true);
      } else {
        throw new Error(paymentData.error || "Failed to initiate payment");
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during payment initiation",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentToggle = () => {
    setShowPaymentModal(false);
    // Redirection will be handled by the PaymentStatusListener component
  };

  return (
    <>
      <Button
        onClick={handlePayment}
        className="w-full py-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-base sm:text-lg rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing...
          </>
        ) : (
          <>
            <Zap className="mr-3 h-5 w-5" />
            Pay ₹47.20 for Instant Processing
          </>
        )}
      </Button>

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
    </>
  );
}
