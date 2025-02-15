"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { updateCreditBuilderLoanApplication } from "@/actions/creditBuilderLoanActions";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";

type FormData = {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  emiTenure: string;
};

export default function LoanEligibilityResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eligibleAmount = searchParams.get("eligibleAmount");
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const applicationId = searchParams.get("applicationId");
  const customerName = searchParams.get("customerName") || "";
  const customerPhone = searchParams.get("customerPhone") || "";
  const customerEmail = searchParams.get("customerEmail") || "";
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      emiTenure: "",
    },
  });

  const watchAllFields = watch();

  const onSubmit = async (data: FormData) => {
    if (!applicationId) {
      toast({
        title: "Error",
        description: "Application ID not found",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateCreditBuilderLoanApplication(
      applicationId,
      formData
    );

    if (result.success) {
      toast({
        title: "Success",
        description: "Bank details updated successfully",
      });
      setCurrentStep(2);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update bank details",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/initiate-phonepe-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 118,
          orderId: `FASTER-${applicationId}`,
          customerName,
          customerPhone,
          customerEmail,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(data.paymentUrl);
      } else {
        throw new Error(data.error || "Failed to initiate payment");
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                {...register("accountNumber", {
                  required: "Account number is required",
                })}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                {...register("bankName", { required: "Bank name is required" })}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm">
                  {errors.bankName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                {...register("ifscCode", { required: "IFSC code is required" })}
              />
              {errors.ifscCode && (
                <p className="text-red-500 text-sm">
                  {errors.ifscCode.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="emiTenure">EMI Tenure (in months)</Label>
              <Input
                id="emiTenure"
                type="number"
                {...register("emiTenure", {
                  required: "EMI tenure is required",
                  min: { value: 3, message: "Minimum tenure is 3 months" },
                  max: { value: 36, message: "Maximum tenure is 36 months" },
                })}
              />
              {errors.emiTenure && (
                <p className="text-red-500 text-sm">
                  {errors.emiTenure.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Submit Bank Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Review Your Information</h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p>
                <strong>Account Number:</strong> {watchAllFields.accountNumber}
              </p>
              <p>
                <strong>Bank Name:</strong> {watchAllFields.bankName}
              </p>
              <p>
                <strong>IFSC Code:</strong> {watchAllFields.ifscCode}
              </p>
              <p>
                <strong>EMI Tenure:</strong> {watchAllFields.emiTenure} months
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              For faster processing, you can pay a fee of ₹118.
            </p>
            <Button
              onClick={handlePayment}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : "Pay ₹118 for Faster Processing"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (status !== "Approved") {
    return (
      <div className="container mx-auto mt-10">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Loan Eligibility Result</CardTitle>
          </CardHeader>
          <CardContent>
            {status === "Partially Approved" && (
              <>
                <h2 className="text-xl font-bold text-yellow-600 mb-4">
                  Partially Approved
                </h2>
                <p className="mb-4">{message}</p>
              </>
            )}
            {status === "Rejected" && (
              <>
                <h2 className="text-xl font-bold text-red-600 mb-4">
                  Application Status
                </h2>
                <p className="mb-4">
                  {message ||
                    "Unfortunately, your loan application was not approved at this time."}
                </p>
              </>
            )}
            <Link href="/">
              <Button className="w-full mt-4">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white">
          <CardTitle className="text-2xl">Loan Eligibility Result</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <Progress
              value={(currentStep / 2) * 100}
              className="w-full h-3 rounded-full bg-orange-200"
            />
            <div className="flex justify-between mt-4">
              {["Bank Details", "Review & Payment"].map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium
                    ${index < currentStep ? "bg-orange-500 text-white" : "bg-orange-100 text-blue-950"}
                    ${index === currentStep - 1 ? "ring-4 ring-orange-500 ring-offset-2" : ""}`}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 ${index === currentStep - 1 ? "font-semibold text-blue-950" : "text-gray-500"}`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Congratulations!
          </h2>
          <p className="mb-4">
            You are eligible for a pre-approved Credit Builder Loan of up to ₹
            {Number.parseInt(eligibleAmount || "0").toLocaleString()}.
          </p>

          {renderStep()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
