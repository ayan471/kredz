"use client";

import { useState, useEffect } from "react";
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
import SabpaisaPaymentGateway from "@/components/sabpaisa-payment-gateway";

type FormData = {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  emiTenure: string;
};

// Function to save form data to session storage
const saveFormDataToSessionStorage = (
  data: Partial<FormData>,
  applicationId: string
) => {
  try {
    sessionStorage.setItem(
      `loanEligibilityResult_${applicationId}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Error saving form data to sessionStorage:", error);
  }
};

// Function to get form data from session storage
const getFormDataFromSessionStorage = (
  applicationId: string
): Partial<FormData> | null => {
  try {
    const savedData = sessionStorage.getItem(
      `loanEligibilityResult_${applicationId}`
    );
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error retrieving form data from sessionStorage:", error);
    return null;
  }
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
  const preventRedirect = searchParams.get("preventRedirect") === "true";
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sabpaisa payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      emiTenure: "",
    },
  });

  // Prevent automatic redirection
  useEffect(() => {
    // Set a flag in localStorage to prevent redirection
    if (preventRedirect && applicationId) {
      localStorage.setItem(`processed_${applicationId}`, "true");
    }

    // Load saved form data if available
    if (applicationId) {
      const savedData = getFormDataFromSessionStorage(applicationId);
      if (savedData) {
        // Populate form with saved data
        Object.entries(savedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setValue(key as keyof FormData, value as string);
          }
        });

        // If we have saved data and all required fields are filled, move to step 2
        if (
          savedData.accountNumber &&
          savedData.bankName &&
          savedData.ifscCode &&
          savedData.emiTenure
        ) {
          setCurrentStep(2);
        }

        toast({
          title: "Form Data Restored",
          description: "Your previously entered information has been restored.",
        });
      }
    }

    setIsInitialized(true);
  }, [preventRedirect, applicationId, setValue, toast]);

  // Save form data whenever it changes
  useEffect(() => {
    if (applicationId) {
      const subscription = watch((formData) => {
        if (formData && Object.keys(formData).length > 0) {
          saveFormDataToSessionStorage(formData, applicationId);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [watch, applicationId]);

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
      if (!applicationId) {
        throw new Error("Application ID not found");
      }

      // Store the application ID in localStorage for recovery if needed
      localStorage.setItem("lastFasterProcessingApplication", applicationId);
      // Mark this application as processed to prevent automatic redirection
      localStorage.setItem(`processed_${applicationId}`, "true");

      // Replace PhonePe with Sabpaisa
      const response = await fetch("/api/initiate-sabpaisa-payment", {
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

  const handleDebugFasterProcessing = async () => {
    if (!applicationId) {
      toast({
        title: "Error",
        description: "Application ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the direct DB update API
      const response = await fetch(
        `/api/direct-db-update?applicationId=${applicationId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Debug Success",
          description: `Update attempted. Current value: ${result.data.fasterProcessingPaid}`,
        });
      } else {
        toast({
          title: "Debug Error",
          description: "Failed to update faster processing status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Debug error:", error);
      toast({
        title: "Debug Error",
        description: "An error occurred during debug",
        variant: "destructive",
      });
    }
  };

  // If not initialized yet, show a loading state
  if (!isInitialized) {
    return (
      <div className="container mx-auto mt-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-xl font-bold text-green-700">
                Congratulations!
              </h3>
              <p className="text-green-700">
                You are eligible for a pre-approved Credit Builder Loan of up to
                ₹{Number.parseInt(eligibleAmount || "0").toLocaleString()}.
              </p>
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                {...register("accountNumber", {
                  required: "Account number is required",
                })}
                type="number"
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Thank You for Applying!
              </h3>
              <p className="text-green-700">
                Your loan application has been successfully submitted. Our
                executive will contact you within 48 hours to complete the
                process.
              </p>
            </div>

            <h3 className="text-xl font-semibold">Your Bank Details</h3>
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

            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>

            <div className="mt-6 pt-6 border-t border-gray-200">
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
          </div>
        );
      default:
        return null;
    }
  };

  if (status !== "In Progress") {
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

          {currentStep === 1 ? (
            <p className="mb-4">
              Please provide your bank details to proceed with your loan
              application.
            </p>
          ) : null}

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
    </div>
  );
}
