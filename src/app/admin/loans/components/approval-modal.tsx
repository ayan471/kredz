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

type ApprovalFormData = {
  approvedAmount: string;
  loanAmount: string;
  processingFees: string;
  gst: string;
  otherCharges: string;
  rateOfInterest: string;
  tenure: string;
  netDisbursement: string;
  disbursementAccount: string;
  disbursementDate: string;
  lender: string;
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

  useEffect(() => {
    const gst = calculateGST(processingFees);
    setValue("gst", gst);
  }, [processingFees, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ApprovalFormData) => {
    setIsSubmitting(true);
    try {
      const result = await approveLoanWithDetails(applicationId, data);
      if (result.success) {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve Loan Application</DialogTitle>
          <DialogDescription>
            Enter the loan approval details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="approvedAmount" className="text-right">
              Approved Amount
            </Label>
            <Input
              id="approvedAmount"
              className="col-span-3"
              {...register("approvedAmount", {
                required: "Approved amount is required",
              })}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="processingFees" className="text-right">
              Processing Fees
            </Label>
            <Input
              id="processingFees"
              className="col-span-3"
              {...register("processingFees", {
                required: "Processing fees is required",
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gst" className="text-right">
              GST (18%)
            </Label>
            <Input
              id="gst"
              className="col-span-3"
              {...register("gst")}
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="otherCharges" className="text-right">
              Other Charges
            </Label>
            <Input
              id="otherCharges"
              className="col-span-3"
              {...register("otherCharges", {
                required: "Other charges is required",
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rateOfInterest" className="text-right">
              Rate of Interest
            </Label>
            <Input
              id="rateOfInterest"
              className="col-span-3"
              {...register("rateOfInterest", {
                required: "Rate of interest is required",
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tenure" className="text-right">
              Tenure
            </Label>
            <Input
              id="tenure"
              className="col-span-3"
              {...register("tenure", { required: "Tenure is required" })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="netDisbursement" className="text-right">
              Net Disbursement
            </Label>
            <Input
              id="netDisbursement"
              className="col-span-3"
              {...register("netDisbursement", {
                required: "Net disbursement is required",
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="disbursementAccount" className="text-right">
              Disbursement Account
            </Label>
            <Input
              id="disbursementAccount"
              className="col-span-3"
              {...register("disbursementAccount", {
                required: "Disbursement account is required",
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="disbursementDate" className="text-right">
              Disbursement Date
            </Label>
            <Input
              id="disbursementDate"
              type="date"
              className="col-span-3"
              {...register("disbursementDate", {
                required: "Disbursement date is required",
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lender" className="text-right">
              Lender
            </Label>
            <Input
              id="lender"
              className="col-span-3"
              {...register("lender", { required: "Lender is required" })}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
