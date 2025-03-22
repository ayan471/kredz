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
import { CreditCard, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-orange-50 to-blue-50 max-h-[90vh] overflow-y-auto scrollbar-hide lg:scrollbar-default">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-950 flex items-center">
            <CreditCard className="w-6 h-6 text-orange-500 mr-2" />
            Manage EMI for Loan Application
          </DialogTitle>
          <DialogDescription className="text-orange-700">
            Update the EMI payment link and view loan details for this approved
            application.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-2 space-y-2">
                  <Label
                    htmlFor="approvedAmount"
                    className="text-blue-950 font-semibold"
                  >
                    Approved Amount
                  </Label>
                  <Input
                    id="approvedAmount"
                    className="border-orange-300 bg-orange-50"
                    value={application.approvedAmount.toString()}
                    readOnly
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label
                    htmlFor="totalTenure"
                    className="text-blue-950 font-semibold"
                  >
                    Total Tenure
                  </Label>
                  <Input
                    id="totalTenure"
                    className="border-orange-300 bg-orange-50"
                    value={
                      application.tenure !== null &&
                      application.tenure !== undefined
                        ? `${application.tenure} months`
                        : "N/A"
                    }
                    readOnly
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label
                    htmlFor="remainingTenure"
                    className="text-blue-950 font-semibold"
                  >
                    Remaining Tenure
                  </Label>
                  <Input
                    id="remainingTenure"
                    className="border-orange-300 bg-orange-50"
                    value={
                      remainingTenure !== null && remainingTenure !== undefined
                        ? `${remainingTenure} months`
                        : "N/A"
                    }
                    readOnly
                  />
                </div>
                <div className="col-span-4 space-y-2">
                  <Label
                    htmlFor="emiPaymentLink"
                    className="text-blue-950 font-semibold"
                  >
                    EMI Payment Link
                  </Label>
                  <Input
                    id="emiPaymentLink"
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    {...register("emiPaymentLink", {
                      required: "EMI payment link is required",
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleMakeEligible}
              type="button"
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Make User Eligible Again
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? "Updating..." : "Update EMI Payment Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
