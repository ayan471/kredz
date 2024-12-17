"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { payEMI } from "@/actions/loanApplicationActions";

interface EMIPayButtonProps {
  loanId: string;
  emiAmount: number;
  emiPaymentLink: string | null;
}

export default function EMIPayButton({
  loanId,
  emiAmount,
  emiPaymentLink,
}: EMIPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayEMI = async () => {
    if (!emiPaymentLink) {
      toast({
        title: "Payment Link Unavailable",
        description:
          "The EMI payment link is not available. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Open the payment link in a new window
      window.open(emiPaymentLink, "_blank");

      // Process the EMI payment
      const result = await payEMI(loanId, emiAmount);
      if (result.success) {
        toast({
          title: "EMI Payment Successful",
          description: `Your EMI payment of ₹${emiAmount.toLocaleString("en-IN")} has been processed.`,
          variant: "default",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "EMI Payment Failed",
        description:
          "There was an error processing your EMI payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePayEMI} disabled={isLoading || !emiPaymentLink}>
      {isLoading
        ? "Processing..."
        : emiPaymentLink
          ? `Pay EMI (₹${emiAmount.toLocaleString("en-IN")})`
          : "Payment Link Unavailable"}
    </Button>
  );
}
