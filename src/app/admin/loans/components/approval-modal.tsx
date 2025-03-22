"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { approveLoanWithDetails } from "@/actions/loanApplicationActions";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type ApprovalFormData = {
  approvedAmount: string;
  processingFees: string;
  gst: string;
  otherCharges: string;
  rateOfInterest: string;
  tenure: string;
  netDisbursement: string;
  disbursementAccount: string;
  disbursementDate: string;
  lender: string;
  emi: string;
};

type ApprovalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
};

const calculateGST = (processingFees: string): string => {
  const fees = parseFloat(processingFees) || 0;
  return (fees * 0.18).toFixed(2);
};

const calculateEMI = (
  principal: number,
  rate: number,
  tenure: number
): number => {
  const monthlyRate = rate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

export function ApprovalModal({
  isOpen,
  onClose,
  applicationId,
}: ApprovalModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ApprovalFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const processingFees = watch("processingFees");
  const approvedAmount = watch("approvedAmount");
  const rateOfInterest = watch("rateOfInterest");
  const tenure = watch("tenure");

  useEffect(() => {
    const gst = calculateGST(processingFees);
    setValue("gst", gst);
  }, [processingFees, setValue]);

  useEffect(() => {
    const amount = parseFloat(approvedAmount) || 0;
    const rate = parseFloat(rateOfInterest) || 0;
    const tenureMonths = parseInt(tenure) || 0;

    if (amount > 0 && rate > 0 && tenureMonths > 0) {
      const emi = calculateEMI(amount, rate, tenureMonths);
      setValue("emi", emi.toString());
    }
  }, [approvedAmount, rateOfInterest, tenure, setValue]);

  useEffect(() => {
    const amount = parseFloat(approvedAmount) || 0;
    const fees = parseFloat(processingFees) || 0;
    const gstAmount = parseFloat(calculateGST(processingFees)) || 0;
    const others = parseFloat(watch("otherCharges")) || 0;

    const netDisbursement = amount - (fees + gstAmount + others);
    setValue("netDisbursement", netDisbursement.toFixed(2));
  }, [approvedAmount, processingFees, watch("otherCharges"), setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ApprovalFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting approval data:", data);
      const result = await approveLoanWithDetails(applicationId, data);
      if (result.success) {
        console.log("Loan approved successfully:", result.loan);
        toast({
          title: "Loan Approved",
          description:
            "The loan application has been successfully approved and updated.",
        });
        onClose();
      } else {
        throw new Error(result.error || "Failed to approve loan");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-orange-50 to-blue-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-950">
            Approve Loan Application
          </DialogTitle>
          <DialogDescription className="text-orange-700">
            Enter the loan approval details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto scrollbar-hide lg:scrollbar-default"
        >
          <Card className="bg-white shadow-md relative">
            <CardContent className="p-6 overflow-y-auto scrollbar-hide lg:scrollbar-default">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="approvedAmount" className="text-blue-950">
                    Approved Amount
                  </Label>
                  <Input
                    id="approvedAmount"
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    {...register("approvedAmount", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingFees" className="text-blue-950">
                    Processing Fees
                  </Label>
                  <Input
                    id="processingFees"
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    {...register("processingFees", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst" className="text-blue-950">
                    GST
                  </Label>
                  <Input
                    id="gst"
                    className="border-orange-300 bg-gray-100"
                    {...register("gst")}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherCharges" className="text-blue-950">
                    Other Charges
                  </Label>
                  <Input
                    id="otherCharges"
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    {...register("otherCharges")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateOfInterest" className="text-blue-950">
                    Rate of Interest
                  </Label>
                  <Input
                    id="rateOfInterest"
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    {...register("rateOfInterest", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenure" className="text-blue-950">
                    Tenure (in months)
                  </Label>
                  <Input
                    id="tenure"
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    {...register("tenure", {
                      required: true,
                      valueAsNumber: true,
                      validate: (value) =>
                        (typeof value === "number" && value > 0) ||
                        "Tenure must be greater than 0",
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="netDisbursement" className="text-blue-950">
                    Net Disbursement
                  </Label>
                  <Input
                    id="netDisbursement"
                    className="border-orange-300 bg-gray-100"
                    {...register("netDisbursement")}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emi" className="text-blue-950">
                    EMI
                  </Label>
                  <Input
                    id="emi"
                    className="border-orange-300 bg-gray-100"
                    {...register("emi")}
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-2 mt-6">
                <Label htmlFor="disbursementAccount" className="text-blue-950">
                  Disbursement Account
                </Label>
                <Textarea
                  id="disbursementAccount"
                  className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                  {...register("disbursementAccount", { required: true })}
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="disbursementDate" className="text-blue-950">
                    Disbursement Date
                  </Label>
                  <Input
                    id="disbursementDate"
                    type="date"
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    {...register("disbursementDate", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lender" className="text-blue-950">
                    Lender
                  </Label>
                  <Input
                    id="lender"
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    {...register("lender", { required: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
