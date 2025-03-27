"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  saveCreditBuilderLoanApplication,
  checkEligibility,
  getCreditBuilderLoanApplication,
} from "@/actions/creditBuilderLoanActions";
import { useUser } from "@clerk/nextjs";
import { Checkbox } from "@/components/ui/checkbox";
import { sendWhatsAppNotification } from "../lib/sendWhatsAppNotification";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { DevTool } from "@hookform/devtools";

type FormData = {
  fullName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  loanAmountRequired: string;
  purpose: string;
  aadharNumber: string;
  panNumber: string;
  creditScore: string;
  employmentType: string;
  EmpOthers: string;
  monthlyIncome: string;
  currentActiveEmis: string;
  currentActiveOverdues: string;
  aadharFront: File | null;
  aadharBack: File | null;
  panCard: File | null;
  bankStatement: string | null;
  address: string;
  hasSalarySlip?: boolean;
  salaryReceiveMethod?: "Cash" | "Bank";
  hasIncomeTaxReturn?: boolean;
  businessRegistration?:
    | "GST"
    | "Udhyam Registration"
    | "Trade Licenses"
    | "Act of establishment";
  age: string;
};

// Function to save form data to session storage
const saveFormDataToSessionStorage = (data: Partial<FormData>) => {
  try {
    sessionStorage.setItem("creditBuilderLoanFormData", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving form data to sessionStorage:", error);
  }
};

// Function to get form data from session storage
const getFormDataFromSessionStorage = (): Partial<FormData> | null => {
  try {
    const savedData = sessionStorage.getItem("creditBuilderLoanFormData");
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error retrieving form data from sessionStorage:", error);
    return null;
  }
};

const CreditBuilderLoanForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: formData,
    mode: "onBlur", // Validate on blur for better user experience
  });

  const employmentType = watch("employmentType");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register the purpose field with validation
    register("purpose", { required: "Purpose of loan is required" });
  }, [register]);

  // Load saved form data from session storage on initial load
  useEffect(() => {
    const savedData = getFormDataFromSessionStorage();
    if (savedData) {
      setFormData(savedData);
      Object.entries(savedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as any, value);
        }
      });
    }
  }, [setValue]);

  useEffect(() => {
    const fetchRejectedApplication = async () => {
      if (user?.id) {
        try {
          const result = await getCreditBuilderLoanApplication(user.id);
          if (result.success && result.data) {
            const fetchedData: Partial<FormData> = {
              fullName: result.data.fullName || "",
              email: result.data.email || "",
              mobileNumber: result.data.phoneNo || "",
              dateOfBirth: result.data.dateOfBirth
                ? new Date(result.data.dateOfBirth).toISOString().split("T")[0]
                : "",
              loanAmountRequired: result.data.amtRequired?.toString() || "",
              purpose: result.data.prpseOfLoan || "",
              aadharNumber: result.data.aadharNo || "",
              panNumber: result.data.panNo || "",
              creditScore: result.data.creditScore?.toString() || "",
              employmentType: result.data.empType || "",
              monthlyIncome: result.data.monIncome?.toString() || "",
              currentActiveEmis: result.data.currEmis?.toString() || "",
              currentActiveOverdues:
                result.data.totalActiveLoans?.toString() || "",
              address: result.data.address || "",
            };
            if (result.data.dateOfBirth) {
              const calculatedAge = calculateAge(
                new Date(result.data.dateOfBirth).toISOString().split("T")[0]
              );
              fetchedData.age = calculatedAge;
            }
            setFormData(fetchedData);
            reset(fetchedData);
            console.log(
              "Application data fetched and form pre-filled",
              fetchedData
            );
          } else {
            console.log("No rejected application found or error occurred");
          }
        } catch (error) {
          console.error("Error fetching rejected application:", error);
          toast({
            title: "Error",
            description:
              "Failed to fetch your previous application data. Please fill out the form manually.",
            variant: "destructive",
          });
        }
      }
    };

    fetchRejectedApplication();
  }, [user, reset, toast, register]);

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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age.toString();
  };

  const clearFormDataFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("creditBuilderLoanFormData");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          if (
            [
              "loanAmountRequired",
              "monthlyIncome",
              "creditScore",
              "currentActiveEmis",
              "currentActiveOverdues",
              "age",
            ].includes(key)
          ) {
            formData.append(
              key,
              Number.parseFloat(value.toString()).toString()
            );
          } else if (["hasSalarySlip", "hasIncomeTaxReturn"].includes(key)) {
            formData.append(key, value ? "true" : "false");
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const result = await saveCreditBuilderLoanApplication(formData);

      // After successful submission
      if (result.success && result.data) {
        // Clear saved form data after successful submission
        clearFormDataFromLocalStorage();

        const eligibilityResult = await checkEligibility(result.data.id);

        toast({
          title: "Application Submitted",
          description: "Your loan application has been submitted successfully.",
        });

        // Send WhatsApp notification
        try {
          if (user?.phoneNumbers && user.phoneNumbers[0]) {
            await sendWhatsAppNotification(
              user.phoneNumbers[0].phoneNumber,
              data.fullName
            );
            console.log("WhatsApp notification sent successfully");
          } else {
            console.warn(
              "User phone number not available for WhatsApp notification"
            );
          }
        } catch (error) {
          console.error("Error sending WhatsApp notification:", error);
        }

        if (eligibilityResult.success) {
          const queryParams = new URLSearchParams({
            eligibleAmount: eligibilityResult.eligibleAmount
              ? eligibilityResult.eligibleAmount.toString()
              : "",
            status: eligibilityResult.message
              ? "Partially Approved"
              : "In Progress",
            message: eligibilityResult.message || "",
            applicationId: result.data.id,
            customerName: data.fullName,
            customerPhone: data.mobileNumber,
            customerEmail: data.email,
            preventRedirect: "true", // Add this parameter
          }).toString();

          router.push(
            `/credit-builder-loan/loan-eligibility-result?${queryParams}`
          );
        } else {
          const queryParams = new URLSearchParams({
            status: "Rejected",
            message:
              eligibilityResult.error || "Unable to determine eligibility",
            applicationId: result.data.id,
            customerName: data.fullName,
            customerPhone: data.mobileNumber,
            customerEmail: data.email,
            preventRedirect: "true", // Add this parameter
          }).toString();

          router.push(
            `/credit-builder-loan/loan-eligibility-result?${queryParams}`
          );
        }
      } else {
        toast({
          title: "Application Error",
          description:
            result.error ||
            "An error occurred while processing your application",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextStep = async () => {
    const fields = {
      1: ["fullName", "email", "mobileNumber", "dateOfBirth", "age"],
      2: ["loanAmountRequired", "purpose"],
      3: ["aadharNumber", "panNumber", "address"],
      4: ["employmentType", "monthlyIncome"],
      5: ["creditScore", "currentActiveEmis", "currentActiveOverdues"],
    }[currentStep];

    const isValid = await trigger(fields as any);

    if (isValid) {
      // Create a complete snapshot of all current form values
      const allCurrentValues = getValues();

      // Update the form data state with all current values
      setFormData(allCurrentValues);

      // Save all form values to session storage
      try {
        sessionStorage.setItem(
          "creditBuilderLoanFormData",
          JSON.stringify(allCurrentValues)
        );
      } catch (error) {
        console.error("Error saving form data to sessionStorage:", error);
      }

      // Move to the next step
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    // Create a complete snapshot of all current form values
    const allCurrentValues = getValues();

    // Update the form data state with all current values
    setFormData(allCurrentValues);

    // Save all form values to session storage
    try {
      sessionStorage.setItem(
        "creditBuilderLoanFormData",
        JSON.stringify(allCurrentValues)
      );
    } catch (error) {
      console.error("Error saving form data to sessionStorage:", error);
    }

    // Move to the previous step
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Also, add this useEffect to reset the form with the saved data when the step changes
  // Add this after your other useEffects
  useEffect(() => {
    // When step changes, reset the form with the current formData
    if (Object.keys(formData).length > 0) {
      reset(formData);
    }
  }, [currentStep, reset, formData]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message: "Full name must be at least 3 characters",
                    },
                  })}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobileNumber"
                  {...register("mobileNumber", {
                    required: "Mobile number is required",
                  })}
                />
                {errors.mobileNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth", {
                    required: "Date of birth is required",
                    onChange: (e) =>
                      setValue("age", calculateAge(e.target.value)),
                  })}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">
                  Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  {...register("age", {
                    required: "Age is required",
                    min: {
                      value: 18,
                      message: "You must be at least 18 years old",
                    },
                    max: {
                      value: 65,
                      message: "Age must be less than 65 years",
                    },
                  })}
                  readOnly
                />
                {errors.age && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmountRequired">
                  Loan Amount Required <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="loanAmountRequired"
                  type="number"
                  {...register("loanAmountRequired", {
                    required: "Loan amount is required",
                    min: {
                      value: 5000,
                      message: "Minimum loan amount is ₹5,000",
                    },
                    max: {
                      value: 500000,
                      message: "Maximum loan amount is ₹5,00,000",
                    },
                  })}
                />
                {errors.loanAmountRequired && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.loanAmountRequired.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">
                  Purpose of Loan <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="purpose"
                  control={control}
                  rules={{
                    required: "Purpose of loan is required",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Manually trigger validation after change
                          trigger("purpose");
                        }}
                        value={field.value || ""}
                      >
                        <SelectTrigger
                          id="purpose"
                          className={fieldState.error ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Personal Use">
                            Personal Use
                          </SelectItem>
                          <SelectItem value="Business Expansion">
                            Business Expansion
                          </SelectItem>
                          <SelectItem value="Medical Issue">
                            Medical Issue
                          </SelectItem>
                          <SelectItem value="House Renovation">
                            House Renovation
                          </SelectItem>
                          <SelectItem value="Debt Consolidation">
                            Debt Consolidation
                          </SelectItem>
                          <SelectItem value="Travel Expense">
                            Travel Expense
                          </SelectItem>
                          <SelectItem value="Self Marriage">
                            Self Marriage
                          </SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.purpose && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.purpose.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadharNumber">
                  Aadhaar Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="aadharNumber"
                  {...register("aadharNumber", {
                    required: "Aadhaar number is required",
                    pattern: {
                      value: /^\d{12}$/,
                      message: "Please enter a valid 12-digit Aadhaar number",
                    },
                  })}
                  type="text"
                  maxLength={12}
                />
                {errors.aadharNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.aadharNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadharFront">
                  Upload Aadhaar Front <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="aadharFront"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setValue("aadharFront", file);
                  }}
                  accept="image/jpeg,image/png,image/jpg"
                />
                {errors.aadharFront && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.aadharFront.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Accepted formats: JPG, JPEG, PNG
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadharBack">
                  Upload Aadhaar Back <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="aadharBack"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setValue("aadharBack", file);
                  }}
                  accept="image/jpeg,image/png,image/jpg"
                />
                {errors.aadharBack && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.aadharBack.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Accepted formats: JPG, JPEG, PNG
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="panNumber">
                  PAN Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="panNumber"
                  {...register("panNumber", {
                    required: "PAN number is required",
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message:
                        "Please enter a valid PAN number (e.g., ABCDE1234F)",
                    },
                  })}
                  maxLength={10}
                />
                {errors.panNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.panNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="panCard">
                  Upload PAN Card <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="panCard"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setValue("panCard", file);
                  }}
                  accept="image/jpeg,image/png,image/jpg"
                />
                {errors.panCard && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.panCard.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Accepted formats: JPG, JPEG, PNG
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  {...register("address", {
                    required: "Address is required",
                    minLength: {
                      value: 10,
                      message: "Please enter a complete address",
                    },
                  })}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employmentType">
                  Employment Type <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="employmentType"
                  control={control}
                  rules={{ required: "Employment type is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Salaried">Salaried</SelectItem>
                        <SelectItem value="Self Employed">
                          Self Employed
                        </SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.employmentType && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.employmentType.message}
                  </p>
                )}
              </div>
              {employmentType === "Salaried" && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasSalarySlip"
                      {...register("hasSalarySlip")}
                    />
                    <Label htmlFor="hasSalarySlip">
                      Do you have salary slip?
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryReceiveMethod">
                      You receive Salary In{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="salaryReceiveMethod"
                      control={control}
                      rules={{
                        required:
                          employmentType === "Salaried"
                            ? "Please select how you receive your salary"
                            : false,
                      }}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Cash" id="cash" />
                            <Label htmlFor="cash">Cash</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Bank" id="bank" />
                            <Label htmlFor="bank">Bank</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {errors.salaryReceiveMethod && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.salaryReceiveMethod.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              {employmentType === "Self Employed" && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasIncomeTaxReturn"
                      {...register("hasIncomeTaxReturn")}
                    />
                    <Label htmlFor="hasIncomeTaxReturn">
                      Do you have Income Tax Return?
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessRegistration">
                      Business registration you have{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="businessRegistration"
                      control={control}
                      rules={{
                        required:
                          employmentType === "Self Employed"
                            ? "Business registration is required"
                            : false,
                      }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select business registration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GST">GST</SelectItem>
                            <SelectItem value="Udhyam Registration">
                              Udhyam Registration
                            </SelectItem>
                            <SelectItem value="Trade Licenses">
                              Trade Licenses
                            </SelectItem>
                            <SelectItem value="Act of establishment">
                              Act of establishment
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.businessRegistration && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.businessRegistration.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              {employmentType === "Others" && (
                <div className="space-y-2">
                  <Label htmlFor="EmpOthers">
                    Specify Other Employment Type{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="EmpOthers"
                    {...register("EmpOthers", {
                      required:
                        employmentType === "Others"
                          ? "Please specify your employment type"
                          : false,
                    })}
                  />
                  {errors.EmpOthers && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.EmpOthers.message}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">
                  Monthly Income <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  {...register("monthlyIncome", {
                    required: "Monthly income is required",
                    min: {
                      value: 5000,
                      message: "Monthly income must be at least ₹5,000",
                    },
                  })}
                />
                {errors.monthlyIncome && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.monthlyIncome.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creditScore">
                  Credit Score <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="creditScore"
                  type="number"
                  {...register("creditScore", {
                    required: "Credit score is required",
                    min: {
                      value: 300,
                      message: "Credit score must be at least 300",
                    },
                    max: {
                      value: 900,
                      message: "Credit score cannot exceed 900",
                    },
                  })}
                />
                {errors.creditScore && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.creditScore.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentActiveEmis">
                  Current EMIs <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="currentActiveEmis"
                  type="number"
                  {...register("currentActiveEmis", {
                    required: "Current EMIs information is required",
                    min: {
                      value: 0,
                      message: "Value cannot be negative",
                    },
                  })}
                />
                {errors.currentActiveEmis && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.currentActiveEmis.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentActiveOverdues">
                  Total Active Loans <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="currentActiveOverdues"
                  type="number"
                  {...register("currentActiveOverdues", {
                    required: "Total active loans information is required",
                    min: {
                      value: 0,
                      message: "Value cannot be negative",
                    },
                  })}
                />
                {errors.currentActiveOverdues && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.currentActiveOverdues.message}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <Label
                  htmlFor="bankStatement"
                  className="text-lg font-semibold"
                >
                  Upload Bank Statement <span className="text-red-500">*</span>
                </Label>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 bg-orange-50">
                  <UploadButton<OurFileRouter>
                    endpoint="pdfUploader"
                    onClientUploadComplete={(res) => {
                      console.log("Files: ", res);
                      if (res && res.length > 0) {
                        setValue("bankStatement", res[0].url);
                        trigger("bankStatement");
                      }
                      toast({
                        title: "Upload Completed",
                        description:
                          "Your bank statement has been uploaded successfully.",
                      });
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        title: "Upload Error",
                        description: `ERROR! ${error.message}`,
                        variant: "destructive",
                      });
                    }}
                    appearance={{
                      button:
                        "bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200",
                      allowedContent: "text-gray-600 text-sm",
                    }}
                  />
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Upload your bank statement in PDF format (Max size: 10MB)
                  </p>
                  <p className="text-red-500 text-sm text-center">
                    Please wait for <span className="font-bold">30seconds</span>{" "}
                    to upload the bank statement
                  </p>
                  {watch("bankStatement") && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md flex items-center justify-between">
                      <span className="text-green-700 font-medium">
                        Bank statement uploaded successfully
                      </span>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {errors.bankStatement && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.bankStatement.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-6 space-y-8">
      <Card className="border-2 border-orange-500 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">
            Credit Builder Loan Application
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <Progress
              value={(currentStep / 5) * 100}
              className="w-full h-3 rounded-full bg-orange-200"
            />
            <div
              ref={scrollContainerRef}
              className="flex justify-between mt-4 overflow-x-auto pb-4 scrollbar-hide"
            >
              {[
                "Basic Info",
                "Loan Details",
                "Personal Details",
                "Employment",
                "Financial",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center flex-shrink-0 px-2 min-w-[80px] mt-2"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-1
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
                    className={`text-[10px] sm:text-xs mt-1 sm:mt-2 text-center whitespace-nowrap
                    ${index === currentStep - 1 ? "font-semibold text-blue-950" : "text-gray-500"}`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {renderStep()}

            <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-orange-500 hover:bg-orange-600 text-white w-auto sm:w-auto sm:ml-auto"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white w-auto sm:w-auto sm:ml-auto"
                >
                  Submit Application
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <DevTool control={control} />
    </div>
  );
};

export default CreditBuilderLoanForm;
