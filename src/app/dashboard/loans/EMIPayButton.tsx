"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { payEMI } from "@/actions/loanApplicationActions";

interface EMIPayButtonProps {
  loanId: string;
  emiAmount: number;
}

export default function EMIPayButton({ loanId, emiAmount }: EMIPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayEMI = async () => {
    setIsLoading(true);
    try {
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
    <Button onClick={handlePayEMI} disabled={isLoading}>
      {isLoading
        ? "Processing..."
        : `Pay EMI (₹${emiAmount.toLocaleString("en-IN")})`}
    </Button>
  );
}
