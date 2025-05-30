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

const calculateEligibleAmount = (salary: number, age: number): number => {
  if (age < 23) {
    if (salary <= 10000) return 7000;
    if (salary <= 20000) return 12000;
    if (salary <= 30000) return 23000;
    return 34000;
  } else {
    if (salary <= 10000) return 37000;
    if (salary <= 23000) return 53000;
    if (salary <= 30000) return 67000;
    if (salary <= 37000) return 83000;
    if (salary <= 45000) return 108000;
    if (salary <= 55000) return 131000;
    if (salary <= 65000) return 178000;
    if (salary <= 75000) return 216000;
    if (salary <= 85000) return 256000;
    if (salary <= 95000) return 308000;
    if (salary <= 125000) return 376000;
    return 487000;
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

          // Calculate eligible amount
          const calculatedEligibleAmount = calculateEligibleAmount(
            Number.parseFloat(applicationData.monIncome || "0"),
            applicationData.age || 0
          );
          setEligibleAmount(calculatedEligibleAmount);

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
    if (eligibleAmount && selectedTenure) {
      const details = calculateEMI(
        eligibleAmount,
        Number.parseInt(selectedTenure)
      );
      setEmiDetails(details);
    }
  }, [eligibleAmount, selectedTenure]);

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

    const result = await updateLoanApplicationData(id, {
      ...data,
      step: 2,
    });

    if (result.success) {
      // Clear saved form data after successful submission
      clearFormDataFromLocalStorage(id);

      toast({
        title: "Eligibility Submitted!",
        description: "Your loan eligibility has been determined.",
      });
      router.push(`/consultancy-application/membership?id=${id}`);
    } else {
      toast({
        title: "Error",
        description:
          result.error || "Failed to submit eligibility. Please try again.",
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

    const isValid = await form.trigger(fields as any);
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleSubmit(onSubmit)();
      }
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
            {eligibleAmount !== null && (
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-6">
                  <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                  <p className="text-xl">
                    You are eligible for pre approved loan amount:
                  </p>
                  <p className="text-4xl font-bold mt-2">
                    ₹{eligibleAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            )}
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="emiTenure">
                Select EMI Tenure <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="emiTenure"
                control={control}
                rules={{ required: "Please select an EMI tenure" }}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid gap-4"
                  >
                    {[12, 24, 36, 48, 60, 72].map((months) => {
                      const monthlyEMI = eligibleAmount
                        ? calculateEMI(eligibleAmount, months).emi
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
                )}
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
                  type="text"
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
                        onCheckedChange={field.onChange}
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
