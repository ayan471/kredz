"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  updateCreditBuilderLoanApplication,
  fetchCreditBuilderLoanApplication,
} from "@/actions/creditBuilderLoanActions";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight, ChevronLeft, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import SabpaisaPaymentGateway from "@/components/sabpaisa-payment-gateway";
import { useUser } from "@clerk/nextjs";

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

// Function to save bank details submission status to localStorage
const setBankDetailsSubmittedStatus = (
  applicationId: string,
  userId: string
) => {
  if (!userId || !applicationId) {
    console.error(
      "Cannot save bank details submission status: Missing user ID or application ID"
    );
    return;
  }

  try {
    localStorage.setItem(
      `bankDetailsSubmitted_${userId}_${applicationId}`,
      "true"
    );
    localStorage.setItem(
      `bankDetailsSubmissionTime_${userId}_${applicationId}`,
      new Date().toISOString()
    );
  } catch (error) {
    console.error(
      "Error saving bank details submission status to localStorage:",
      error
    );
  }
};

// Function to get bank details submission status from localStorage
const getBankDetailsSubmittedStatus = (
  userId: string,
  applicationId: string
) => {
  if (!userId || !applicationId) {
    return { submitted: false, submissionTime: null };
  }

  try {
    const submitted =
      localStorage.getItem(
        `bankDetailsSubmitted_${userId}_${applicationId}`
      ) === "true";
    const submissionTime = localStorage.getItem(
      `bankDetailsSubmissionTime_${userId}_${applicationId}`
    );
    return { submitted, submissionTime };
  } catch (error) {
    console.error(
      "Error retrieving bank details submission status from localStorage:",
      error
    );
    return { submitted: false, submissionTime: null };
  }
};

// Function to clear form submission status from localStorage
const clearBankDetailsSubmittedStatus = (
  userId: string,
  applicationId: string
) => {
  if (!userId || !applicationId) return;

  try {
    localStorage.removeItem(`bankDetailsSubmitted_${userId}_${applicationId}`);
    localStorage.removeItem(
      `bankDetailsSubmissionTime_${userId}_${applicationId}`
    );
    localStorage.removeItem(`processed_${applicationId}`);
  } catch (error) {
    console.error(
      "Error clearing bank details submission status from localStorage:",
      error
    );
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
  const monthlyIncome = searchParams.get("monthlyIncome") || "0";
  const { user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fasterProcessingPaid, setFasterProcessingPaid] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isEligibleForNewLoan, setIsEligibleForNewLoan] = useState(false);

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

  // Fetch application details and check for faster processing payment status
  useEffect(() => {
    let fetchApplicationDetailsCalled = false;

    const fetchApplicationDetails = async () => {
      if (!user?.id || fetchApplicationDetailsCalled) {
        setIsLoading(false);
        return;
      }

      fetchApplicationDetailsCalled = true;

      try {
        // Fetch the application details from the server
        const result = await fetchCreditBuilderLoanApplication(user.id);

        if (result.success && result.data) {
          // If the application doesn't have an eligibleAmount but we have one in localStorage, use it
          if (!result.data.eligibleAmount && applicationId) {
            const storedEligibleAmount = localStorage.getItem(
              `eligibleAmount_${applicationId}`
            );
            if (storedEligibleAmount) {
              result.data.eligibleAmount = Number(storedEligibleAmount);
            }
          }

          setApplicationDetails(result.data);

          // Check if user is eligible for a new loan
          if (result.data.status === "Eligible") {
            setIsEligibleForNewLoan(true);
            // Clear previous submission status if user is now eligible
            if (applicationId) {
              clearBankDetailsSubmittedStatus(user.id, applicationId);
            }

            // Show a toast notification
            toast({
              title: "You're Eligible!",
              description:
                "You're now eligible for a new loan. Redirecting to application form...",
            });

            // Add a small delay before redirecting to allow the toast to be seen
            setTimeout(() => {
              // Redirect directly to the loan application page
              router.push("/credit-builder-loan");
            }, 1500);

            return; // Exit early to prevent further processing
          } else {
            // Check if faster processing fee is paid
            if (result.data.fasterProcessingPaid) {
              setFasterProcessingPaid(true);
            }

            // If application ID is provided, check for bank details submission
            if (applicationId) {
              const { submitted } = getBankDetailsSubmittedStatus(
                user.id,
                applicationId
              );

              if (submitted) {
                setCurrentStep(2);
              }

              // If bank details are already filled, move to step 2
              if (
                result.data.accountNumber &&
                result.data.bankName &&
                result.data.ifscCode
              ) {
                setCurrentStep(2);

                // Pre-fill the form with the existing data
                setValue("accountNumber", result.data.accountNumber);
                setValue("bankName", result.data.bankName);
                setValue("ifscCode", result.data.ifscCode);
                setValue("emiTenure", result.data.emiTenure?.toString() || "");

                // Save the bank details submission status
                if (user?.id) {
                  setBankDetailsSubmittedStatus(applicationId, user.id);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching application details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch application details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId, user, setValue, toast, router]);

  // Prevent automatic redirection
  useEffect(() => {
    // Set a flag in localStorage to prevent redirection
    if (preventRedirect && applicationId) {
      localStorage.setItem(`processed_${applicationId}`, "true");

      // Update the eligible amount in the database
      const updateEligibleAmountInDB = async () => {
        try {
          const response = await fetch("/api/update-eligible-amount", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              applicationId,
              eligibleAmount: Number(eligibleAmount),
            }),
          });

          if (!response.ok) {
            console.error("Failed to update eligible amount in database");
          }
        } catch (error) {
          console.error("Error updating eligible amount:", error);
        }
      };

      updateEligibleAmountInDB();
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
  }, [preventRedirect, applicationId, setValue, toast, eligibleAmount]);

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

  // Add this useEffect after the other useEffects
  useEffect(() => {
    // Store eligible amount in localStorage when available from URL
    if (eligibleAmount && applicationId) {
      try {
        localStorage.setItem(`eligibleAmount_${applicationId}`, eligibleAmount);
      } catch (error) {
        console.error("Error storing eligible amount in localStorage:", error);
      }
    }
  }, [eligibleAmount, applicationId]);

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

      // Save the bank details submission status
      if (user?.id) {
        setBankDetailsSubmittedStatus(applicationId, user.id);
      }

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
          amount: 146,
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
    // After payment, refresh the application details to update the faster processing status
    if (user?.id) {
      fetchCreditBuilderLoanApplication(user.id).then((result) => {
        if (result.success && result.data) {
          setApplicationDetails(result.data);
          if (result.data.fasterProcessingPaid) {
            setFasterProcessingPaid(true);
            toast({
              title: "Payment Successful",
              description: "Your application will now be processed faster",
            });
          }
        }
      });
    }
  };

  const handleApplyForNewLoan = () => {
    // Clear any existing application data from localStorage
    if (user?.id && applicationId) {
      clearBankDetailsSubmittedStatus(user.id, applicationId);
    }

    // Redirect to the loan application form
    router.push("/credit-builder-loan");
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="container mx-auto mt-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
                ₹
                {Number.parseInt(
                  applicationDetails?.eligibleAmount || eligibleAmount || "0"
                ).toLocaleString()}
                .
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

            {!fasterProcessingPaid && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  For Instant processing, you can pay a fee of ₹146.
                </p>
                <Button
                  onClick={handlePayment}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing..."
                    : "Pay ₹146 for Instant Processing"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {fasterProcessingPaid && (
              <div className="mt-6 pt-6 border-t border-gray-200 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-700 font-medium">
                    Faster Processing Fee Paid
                  </p>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Your application is now being processed with priority. Our
                  team will contact you soon.
                </p>
              </div>
            )}
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
            {status === "In Progress" && (
              <>
                <h2 className="text-xl font-bold text-yellow-600 mb-4">
                  In Progress
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

  // If we have application details and bank details are submitted, show the application status
  if (
    applicationDetails &&
    applicationDetails.accountNumber &&
    applicationDetails.bankName &&
    applicationDetails.ifscCode
  ) {
    return (
      <div className="container mx-auto mt-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white">
            <CardTitle className="text-2xl">Loan Application Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-700">
                  Application Submitted
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-medium">In Progress</span>
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-green-700 mb-4">
                Your loan application has been successfully submitted and is
                being processed.
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-4">Your Bank Details</h3>
            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <p className="mb-2">
                <strong>Account Number:</strong>{" "}
                {applicationDetails.accountNumber}
              </p>
              <p className="mb-2">
                <strong>Bank Name:</strong> {applicationDetails.bankName}
              </p>
              <p className="mb-2">
                <strong>IFSC Code:</strong> {applicationDetails.ifscCode}
              </p>
              <p>
                <strong>EMI Tenure:</strong> {applicationDetails.emiTenure}{" "}
                months
              </p>
            </div>

            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-6">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>

            {!applicationDetails.fasterProcessingPaid &&
              !fasterProcessingPaid && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    For Instant processing, you can pay a fee of ₹146.
                  </p>
                  <Button
                    onClick={handlePayment}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : "Pay ₹146 for Instant Processing"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

            {(applicationDetails.fasterProcessingPaid ||
              fasterProcessingPaid) && (
              <div className="mt-6 pt-6 border-t border-gray-200 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-700 font-medium">
                    Faster Processing Fee Paid
                  </p>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Your application is now being processed with priority. Our
                  team will contact you soon.
                </p>
              </div>
            )}
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
