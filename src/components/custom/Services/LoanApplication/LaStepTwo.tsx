"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  getLoanApplicationData,
  updateLoanApplicationData,
} from "@/actions/loanApplicationActions";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IndianRupee,
  Calendar,
  PiggyBank,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { calculateEMI } from "@/components/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { getEligibleLoanAmount } from "@/components/lib/loanCalculations";

type FormValues = {
  fullName: string;
  phoneNo: string;
  emailID: string;
  panNo: string;
  aadharNo: string;
  emiTenure: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  eMandate: boolean;
};

type EMIDetails = {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  interestRate: number;
};

// Utility functions for form data persistence
const saveFormDataToLocalStorage = (data: Partial<FormValues>, id: string) => {
  try {
    sessionStorage.setItem(
      `loanApplicationStepTwo_${id}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Error saving form data to sessionStorage:", error);
  }
};

const getFormDataFromLocalStorage = (
  id: string
): Partial<FormValues> | null => {
  try {
    const savedData = sessionStorage.getItem(`loanApplicationStepTwo_${id}`);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error retrieving form data from sessionStorage:", error);
    return null;
  }
};

const clearFormDataFromLocalStorage = (id: string) => {
  try {
    sessionStorage.removeItem(`loanApplicationStepTwo_${id}`);
  } catch (error) {
    console.error("Error clearing form data from sessionStorage:", error);
  }
};

// New utility functions for tracking form submission status
const setFormSubmittedStatus = (applicationId: string, userId: string) => {
  if (!userId) {
    console.error("Cannot save form submission status: No user ID provided");
    return;
  }

  try {
    localStorage.setItem(`loanApplicationStepTwoSubmitted_${userId}`, "true");
    localStorage.setItem(`loanApplicationStepTwoId_${userId}`, applicationId);
  } catch (error) {
    console.error(
      "Error saving form submission status to localStorage:",
      error
    );
  }
};

const getFormSubmittedStatus = (userId?: string) => {
  if (!userId) {
    return { submitted: false, applicationId: "" };
  }

  try {
    return {
      submitted:
        localStorage.getItem(`loanApplicationStepTwoSubmitted_${userId}`) ===
        "true",
      applicationId:
        localStorage.getItem(`loanApplicationStepTwoId_${userId}`) || "",
    };
  } catch (error) {
    console.error(
      "Error retrieving form submission status from localStorage:",
      error
    );
    return { submitted: false, applicationId: "" };
  }
};

const clearFormSubmittedStatus = (userId?: string) => {
  if (!userId) return;

  try {
    localStorage.removeItem(`loanApplicationStepTwoSubmitted_${userId}`);
    localStorage.removeItem(`loanApplicationStepTwoId_${userId}`);
  } catch (error) {
    console.error(
      "Error clearing form submission status from localStorage:",
      error
    );
  }
};

const steps = [
  "Loan Application",
  "Eligibility",
  "Membership",
  "Loan Approval",
  "Loan Agreement",
  "Loan Disbursement",
];

const LaStepTwo = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<FormValues>({
    defaultValues: {
      eMandate: false,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const [eligibleAmount, setEligibleAmount] = useState<number | null>(null);
  const [emiDetails, setEmiDetails] = useState<EMIDetails | null>(null);
  const { user } = useUser();
  const selectedTenure = watch("emiTenure");
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Add this useEffect at the beginning of the other useEffect hooks to check for previous submissions
  useEffect(() => {
    // Only proceed if we have a user
    if (!user?.id) return;

    const { submitted, applicationId } = getFormSubmittedStatus(user.id);

    if (submitted && applicationId) {
      setIsRedirecting(true);
      toast({
        title: "Previous Application Found",
        description: "Redirecting you to the next step.",
      });

      // Short delay to allow toast to be seen
      setTimeout(() => {
        router.push(`/consultancy-application/membership?id=${applicationId}`);
      }, 1500);
    }
  }, [router, toast, user]);

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");
      if (id) {
        setApplicationId(id);

        // First check if there's any saved data in localStorage
        const savedData = getFormDataFromLocalStorage(id);

        // Then fetch data from the server
        const result = await getLoanApplicationData(id);

        if (result.success && result.data) {
          const applicationData = result.data;

          // Populate form with server data
          Object.entries(applicationData).forEach(([key, value]) => {
            if (key in form.getValues() && value !== null) {
              setValue(key as keyof FormValues, value as string);
            }
          });

          // Calculate eligible amount using the same logic as la-step-one
          const monthlyIncome = Number.parseFloat(
            applicationData.monIncome || "0"
          );
          const age = applicationData.age || 0;

          if (monthlyIncome > 0 && age > 0) {
            const calculatedEligibleAmount = await getEligibleLoanAmount(
              age,
              monthlyIncome
            );
            setEligibleAmount(calculatedEligibleAmount);
            console.log(
              "Calculated eligible amount in la-step-two:",
              calculatedEligibleAmount
            );
          }

          setRequestedAmount(
            Number.parseFloat(applicationData.amtRequired || "0")
          );

          // If we have saved data in localStorage, override with that data
          if (savedData) {
            Object.entries(savedData).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                setValue(key as keyof FormValues, value as any);
              }
            });

            toast({
              title: "Form Data Restored",
              description:
                "Your previously entered information has been restored.",
            });
          }
        }
      }

      if (user) {
        setValue("emailID", user.emailAddresses[0]?.emailAddress || "");
      }
    };

    fetchData();
  }, [searchParams, setValue, form, user, toast]);

  // Save form data whenever it changes
  useEffect(() => {
    if (applicationId) {
      const subscription = watch((formData) => {
        if (formData && Object.keys(formData).length > 0) {
          saveFormDataToLocalStorage(formData, applicationId);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [watch, applicationId]);

  useEffect(() => {
    if (requestedAmount && selectedTenure) {
      const details = calculateEMI(
        requestedAmount,
        Number.parseInt(selectedTenure)
      );
      setEmiDetails(details);
    }
  }, [requestedAmount, selectedTenure]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeStep = container.children[currentStep - 1] as HTMLElement;
      if (activeStep) {
        const containerWidth = container.offsetWidth;
        const stepWidth = activeStep.offsetWidth;
        const scrollLeft =
          activeStep.offsetLeft - containerWidth / 2 + stepWidth / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentStep]);

  const onSubmit = async (data: FormValues) => {
    const id = searchParams.get("id");
    if (!id) {
      toast({
        title: "Error",
        description: "Application ID not found",
        variant: "destructive",
      });
      return;
    }

    // Enhanced debugging
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Raw form data:", data);
    console.log("EMI Tenure raw value:", data.emiTenure);
    console.log("EMI Tenure type:", typeof data.emiTenure);
    console.log("EMI Tenure length:", data.emiTenure?.length);
    console.log("EMI Tenure truthy check:", !!data.emiTenure);

    // Get current form values directly
    const currentFormValues = form.getValues();
    console.log("Current form values:", currentFormValues);
    console.log("Current EMI Tenure from form:", currentFormValues.emiTenure);

    // Validate EMI tenure before submission
    if (!data.emiTenure || data.emiTenure.trim() === "") {
      console.error("EMI Tenure is missing or empty!");
      toast({
        title: "Validation Error",
        description: "EMI Tenure is required. Please select a tenure.",
        variant: "destructive",
      });
      return;
    }

    // Prepare submission data with explicit field mapping
    const submissionData = {
      fullName: data.fullName || "",
      phoneNo: data.phoneNo || "",
      emailID: data.emailID || "",
      panNo: data.panNo || "",
      aadharNo: data.aadharNo || "",
      emiTenure: String(data.emiTenure).trim(), // Explicit conversion and trim
      accountNumber: data.accountNumber || "",
      bankName: data.bankName || "",
      ifscCode: data.ifscCode || "",
      eMandate: Boolean(data.eMandate),
      step: 2,
    };

    console.log("=== SUBMISSION DATA ===");
    console.log("Prepared submission data:", submissionData);
    console.log("EMI Tenure in submission:", submissionData.emiTenure);
    console.log("EMI Tenure submission type:", typeof submissionData.emiTenure);
    console.log("========================");

    try {
      const result = await updateLoanApplicationData(id, submissionData);

      console.log("=== SERVER RESPONSE ===");
      console.log("Update result:", result);
      console.log("Success:", result.success);
      if (result.error) {
        console.error("Server error:", result.error);
      }
      console.log("=======================");

      if (result.success) {
        // Clear saved form data after successful submission
        clearFormDataFromLocalStorage(id);

        // Set the form submitted status in localStorage with user ID
        if (user?.id) {
          setFormSubmittedStatus(id, user.id);
        }

        toast({
          title: "Eligibility Submitted!",
          description: "Your loan eligibility has been determined.",
        });
        router.push(`/consultancy-application/membership?id=${id}`);
      } else {
        console.error("Submission failed:", result.error);
        toast({
          title: "Error",
          description:
            result.error || "Failed to submit eligibility. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextStep = async () => {
    const fields = {
      1: ["fullName", "phoneNo", "emailID", "panNo", "aadharNo"],
      2: ["emiTenure"],
      3: ["accountNumber", "bankName", "ifscCode", "eMandate"],
    }[currentStep];

    // Special validation for EMI tenure
    if (currentStep === 2) {
      const emiTenureValue = watch("emiTenure");
      console.log("EMI Tenure validation - current value:", emiTenureValue);

      if (!emiTenureValue) {
        toast({
          title: "Validation Error",
          description: "Please select an EMI tenure before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }

    const isValid = await form.trigger(fields as any);
    console.log("Form validation result:", isValid);
    console.log("Current form values:", form.getValues());

    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleSubmit(onSubmit)();
      }
    } else {
      console.log("Form errors:", form.formState.errors);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Personal Information</h3>
            <div className="grid gap-6">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phoneNo">Phone No</Label>
                <Input
                  type="tel"
                  id="phoneNo"
                  {...register("phoneNo", {
                    required: "Phone number is required",
                  })}
                />
                {errors.phoneNo && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phoneNo.message}
                  </p>
                )}
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="emailID">Email ID</Label>
                <Input
                  type="email"
                  id="emailID"
                  {...register("emailID", { required: "Email is required" })}
                />
                {errors.emailID && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.emailID.message}
                  </p>
                )}
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="panNo">PAN No</Label>
                <Input
                  type="text"
                  id="panNo"
                  {...register("panNo", { required: "PAN number is required" })}
                />
                {errors.panNo && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.panNo.message}
                  </p>
                )}
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="aadharNo">Aadhar No</Label>
                <Input
                  type="text"
                  id="aadharNo"
                  {...register("aadharNo", {
                    required: "Aadhar number is required",
                  })}
                />
                {errors.aadharNo && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.aadharNo.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Loan Details</h3>
            {eligibleAmount !== null && requestedAmount !== null && (
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <h2 className="text-3xl font-bold mb-2">
                      Congratulations!
                    </h2>
                    <p className="text-xl">
                      You are eligible for your requested loan amount:
                    </p>
                    <p className="text-4xl font-bold mt-2">
                      ₹{requestedAmount.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                {/* <Card className="border-2 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">
                          Your Requested Amount
                        </p>
                        <p className="text-2xl font-bold text-orange-600">
                          ₹{requestedAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Eligible Amount</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{eligibleAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {requestedAmount > eligibleAmount && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> Your eligible amount is lower
                          than your requested amount. The EMI calculations below
                          are based on your requested amount of ₹
                          {requestedAmount.toLocaleString()}.
                        </p>
                      </div>
                    )}
                    {requestedAmount <= eligibleAmount && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Great!</strong> You are eligible for your full
                          requested amount.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card> */}
              </div>
            )}
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="emiTenure">
                Select EMI Tenure <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="emiTenure"
                control={control}
                rules={{ required: "Please select an EMI tenure" }}
                render={({ field }) => {
                  console.log("RadioGroup field value:", field.value);
                  return (
                    <RadioGroup
                      onValueChange={(value) => {
                        console.log("RadioGroup value changing to:", value);
                        console.log("Value type:", typeof value);
                        field.onChange(value);

                        // Force update the form state
                        setValue("emiTenure", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      value={field.value}
                      className="grid gap-4"
                    >
                      {[12, 24, 36, 48, 60, 72].map((months) => {
                        const monthlyEMI = requestedAmount
                          ? calculateEMI(requestedAmount, months).emi
                          : 0;
                        return (
                          <div
                            key={months}
                            className={`flex items-center justify-between p-4 rounded-lg border ${
                              field.value === months.toString()
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:bg-gray-50"
                            } transition-colors`}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={months.toString()}
                                id={`r${months}`}
                              />
                              <Label htmlFor={`r${months}`}>
                                {months} months
                              </Label>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold">
                                ₹{monthlyEMI.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-600">
                                /month
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  );
                }}
              />
              {errors.emiTenure && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.emiTenure.message}
                </p>
              )}
            </div>
            <AnimatePresence mode="wait">
              {emiDetails && (
                <motion.div
                  key={selectedTenure}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">
                        EMI Breakdown
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="w-5 h-5 text-blue-600" />
                            <span>Monthly EMI</span>
                          </div>
                          <span className="font-semibold">
                            ₹{emiDetails.emi.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <span>Loan Tenure</span>
                          </div>
                          <span className="font-semibold">
                            {selectedTenure} months
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <PiggyBank className="w-5 h-5 text-green-600" />
                            <span>Total Interest</span>
                          </div>
                          <span className="font-semibold">
                            ₹{emiDetails.totalInterest.toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-2 mt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Total Payment</span>
                            <span className="font-bold text-lg">
                              ₹{emiDetails.totalPayment.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Account Information</h3>
            <div className="grid gap-6">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="accountNumber">
                  Account Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="accountNumber"
                  {...register("accountNumber", {
                    required: "Account number is required",
                    pattern: {
                      value: /^\d+$/,
                      message:
                        "Please enter a valid account number (numbers only)",
                    },
                  })}
                />
                {errors.accountNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="bankName">
                  Bank Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="bankName"
                  {...register("bankName", {
                    required: "Bank name is required",
                  })}
                />
                {errors.bankName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="ifscCode">
                  IFSC Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="ifscCode"
                  {...register("ifscCode", {
                    required: "IFSC code is required",
                    pattern: {
                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                      message:
                        "Please enter a valid IFSC code (e.g., SBIN0123456)",
                    },
                  })}
                />
                {errors.ifscCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.ifscCode.message}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <div className="mt-1">
                  <Controller
                    name="eMandate"
                    control={control}
                    rules={{ required: "E-mandate is required" }}
                    render={({ field }) => (
                      <Checkbox
                        id="eMandate"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          const booleanValue = Boolean(checked);
                          field.onChange(booleanValue);
                          console.log(
                            "E-mandate value changed to:",
                            booleanValue
                          );
                        }}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="eMandate"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    E-mandate/Auto Debit will be activated on the same account{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  {errors.eMandate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.eMandate.message}
                    </p>
                  )}
                  <p className="text-sm text-red-500 mt-2">
                    Some charges may be applicable for this procedure
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-center">
          Redirecting to the next step...
        </h2>
        <p className="text-gray-500 mt-2 text-center">Please wait a moment</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6 space-y-8">
      <Card className="border-2 border-orange-500 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">
            Loan Application - Eligibility
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <Progress
              value={(currentStep / 3) * 100}
              className="w-full h-3 rounded-full bg-orange-200"
            />
            <div
              ref={scrollContainerRef}
              className="flex justify-between mt-4 overflow-x-auto pb-4 scrollbar-hide"
            >
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center flex-shrink-0 px-2 min-w-[80px] mt-2"
                >
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mb-1
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

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="border-orange-500 text-orange-500 hover:bg-orange-50"
                >
                  Previous
                </Button>
              )}
              <Button
                type="button"
                onClick={nextStep}
                className="bg-orange-500 hover:bg-orange-600 text-white ml-auto"
              >
                {currentStep < 3 ? (
                  <>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DevTool control={control} />
    </div>
  );
};

export default LaStepTwo;
