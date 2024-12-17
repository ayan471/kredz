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
import { LoanApplication } from "../columns";
import {
  makeUserEligible,
  updateEMIPaymentLink,
} from "@/actions/loanApplicationActions";

type EMIFormData = {
  emiPaymentLink: string;
};

type EMIModalProps = {
  isOpen: boolean;
  onClose: () => void;
  application: LoanApplication;
};

export function EMIModal({ isOpen, onClose, application }: EMIModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EMIFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [remainingTenure, setRemainingTenure] = useState(0);

  useEffect(() => {
    console.log("EMIModal - Application data:", application);
    if (
      application.status === "Approved" &&
      application.approvedAmount &&
      application.updatedAt &&
      application.tenure !== null &&
      application.tenure !== undefined
    ) {
      const currentDate = new Date();
      const loanStartDate = new Date(application.updatedAt);
      const monthsPassed =
        (currentDate.getFullYear() - loanStartDate.getFullYear()) * 12 +
        (currentDate.getMonth() - loanStartDate.getMonth()) +
        (currentDate.getDate() >= loanStartDate.getDate() ? 0 : -1);
      const remaining = Math.max(0, application.tenure - monthsPassed);
      setRemainingTenure(remaining);
      console.log("Debug EMI Modal:", {
        currentDate,
        loanStartDate,
        tenure: application.tenure,
        monthsPassed,
        remainingTenure: remaining,
      });
    } else {
      console.log("EMIModal - Conditions not met:", {
        status: application.status,
        approvedAmount: application.approvedAmount,
        updatedAt: application.updatedAt,
        tenure: application.tenure,
      });
    }
  }, [application]);

  const onSubmit = async (data: EMIFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateEMIPaymentLink(
        application.id,
        data.emiPaymentLink
      );
      if (result.success) {
        toast({
          title: "EMI Payment Link Updated",
          description: "The EMI payment link has been successfully updated.",
        });
        onClose();
      } else {
        throw new Error(result.error || "Failed to update EMI payment link");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update EMI payment link",
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

  const handleMakeEligible = async () => {
    try {
      await makeUserEligible(application.id);
      toast({
        title: "User Made Eligible",
        description:
          "The user has been made eligible for a new loan application.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to make user eligible",
        variant: "destructive",
      });
    }
  };

  if (application.status !== "Approved" || !application.approvedAmount) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage EMI for Loan Application</DialogTitle>
          <DialogDescription>
            Update the EMI payment link for this approved loan.
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
              value={application.approvedAmount.toString()}
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalTenure" className="text-right">
              Total Tenure
            </Label>
            <Input
              id="totalTenure"
              className="col-span-3"
              value={
                application.tenure !== null && application.tenure !== undefined
                  ? `${application.tenure} months`
                  : "N/A"
              }
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remainingTenure" className="text-right">
              Remaining Tenure
            </Label>
            <Input
              id="remainingTenure"
              className="col-span-3"
              value={
                remainingTenure !== null && remainingTenure !== undefined
                  ? `${remainingTenure} months`
                  : "N/A"
              }
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="emiPaymentLink" className="text-right">
              EMI Payment Link
            </Label>
            <Input
              id="emiPaymentLink"
              className="col-span-3"
              {...register("emiPaymentLink", {
                required: "EMI payment link is required",
              })}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update EMI Payment Link"}
          </Button>
        </form>
        <div className="mt-4">
          <Button
            onClick={handleMakeEligible}
            variant="outline"
            className="w-full"
          >
            Make User Eligible Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
