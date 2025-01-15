"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { FinancialInfoStep } from "./FinancialInfoStep";
import { DocumentUploadStep } from "./DocumentUploadStep";
import { ReviewStep } from "./ReviewStep";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  submitLoanApplicationStep1,
  checkExistingLoanApplication,
} from "@/actions/loanApplicationActions";
import { LoanApplication } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const steps = [
  { title: "Personal Info", component: PersonalInfoStep },
  { title: "Financial Info", component: FinancialInfoStep },
  { title: "Document Upload", component: DocumentUploadStep },
  { title: "Review", component: ReviewStep },
];

export const StepwiseLoanApplication = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingApplicationData, setExistingApplicationData] =
    useState<LoanApplication | null>(null);

  useEffect(() => {
    const checkExistingApplication = async () => {
      const result = await checkExistingLoanApplication();
      if (result.success) {
        setHasExistingApplication(result.hasExistingApplication);
        setExistingApplicationData(result.applicationData);
      } else {
        toast({
          title: "Error",
          description:
            "Failed to check existing applications. Please try again.",
          variant: "destructive",
        });
      }
    };

    checkExistingApplication();
  }, [toast]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: any) => {
    if (currentStep < steps.length - 1) {
      nextStep();
    } else {
      if (
        hasExistingApplication &&
        existingApplicationData?.status !== "Eligible"
      ) {
        toast({
          title: "Application Already Exists",
          description:
            "You already have a loan application in progress. You cannot submit a new application at this time.",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      formData.set("panNo", data.panNo.toUpperCase());

      try {
        const result = await submitLoanApplicationStep1(formData);

        if (result.success) {
          toast({
            title: "Application Submitted!",
            description: "Your loan application has been received.",
          });
          router.push(`/consultancy-application/eligible?id=${result.id}`);
        } else {
          throw new Error(result.error || "Failed to submit application");
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (
    hasExistingApplication &&
    existingApplicationData &&
    existingApplicationData.status !== "Eligible"
  ) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
          <CardTitle className="text-2xl font-bold">
            Existing Loan Application
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="mb-4 text-lg">
            You already have a loan application in progress. You cannot submit a
            new application at this time.
          </p>
          <div className="bg-gray-100 p-4 rounded-md shadow-inner">
            <h3 className="font-semibold mb-2 text-xl">Application Details:</h3>
            <p className="mb-2">
              Status:{" "}
              <span className="font-medium">
                {existingApplicationData.status || "In Progress"}
              </span>
            </p>
            <p className="mb-2">
              Amount Required:{" "}
              <span className="font-medium">
                ₹{existingApplicationData.amtRequired}
              </span>
            </p>
            <p className="mb-2">
              Purpose:{" "}
              <span className="font-medium">
                {existingApplicationData.prpseOfLoan}
              </span>
            </p>
            <p>
              Submitted on:{" "}
              <span className="font-medium">
                {new Date(
                  existingApplicationData.createdAt
                ).toLocaleDateString()}
              </span>
            </p>
          </div>
          <Button
            className="mt-6 w-full"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
        <CardTitle className="text-3xl font-bold text-center">
          Loan Application
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {existingApplicationData?.status === "Eligible" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-md"
            role="alert"
          >
            <p className="font-bold text-lg">Good news!</p>
            <p>
              You are eligible to apply for a new loan. Please fill out the form
              below.
            </p>
          </motion.div>
        )}
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {React.createElement(steps[currentStep].component)}
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex justify-between">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="w-28"
                >
                  Previous
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-28 ${currentStep === 0 ? "ml-auto" : ""}`}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : currentStep === steps.length - 1 ? (
                  "Submit"
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
