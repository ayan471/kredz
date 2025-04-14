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
  fetchCreditBuilderLoanApplication,
} from "@/actions/creditBuilderLoanActions";
import { useUser } from "@clerk/nextjs";
import { Checkbox } from "@/components/ui/checkbox";
import { sendWhatsAppNotification } from "../lib/sendWhatsAppNotification";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Clock,
  AlertCircle,
  Zap,
} from "lucide-react";
import { DevTool } from "@hookform/devtools";
import FasterProcessingButton from "./FasterProcessingButton";

// Update the ApplicationStatus type to include status field
type ApplicationStatus = {
  id: string;
  status?: string;
  fullName?: string;
  email?: string;
  phoneNo?: string;
  dateOfBirth?: Date;
  amtRequired?: string | number;
  prpseOfLoan?: string;
  aadharNo?: string;
  panNo?: string;
  creditScore?: string;
  empType?: string;
  EmpOthers?: string;
  monIncomeRange?: string;
  monIncome?: string | number;
  currEmis?: string;
  totalActiveLoans?: string;
  rejectionReason?: string;
  address?: string;
  hasSalarySlip?: boolean;
  salaryReceiveMethod?: string;
  hasIncomeTaxReturn?: boolean;
  businessRegistration?: string;
  createdAt?: string;
  fasterProcessingPaid?: boolean;
};

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
    | "Act of establishment"
    | "None of above";
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

// Add this function right after the getFormDataFromSessionStorage function
const sanitizeFormData = (data: Partial<FormData>) => {
  // Create a copy of the data
  const sanitizedData = { ...data };

  // Check if aadharNumber matches loanAmountRequired and clear it if it does
  if (
    sanitizedData.aadharNumber &&
    sanitizedData.loanAmountRequired &&
    sanitizedData.aadharNumber === sanitizedData.loanAmountRequired
  ) {
    console.log(
      "Sanitizing: Detected aadharNumber matches loanAmountRequired, clearing aadharNumber"
    );
    sanitizedData.aadharNumber = "";
  }

  return sanitizedData;
};

// Add these utility functions after the sanitizeFormData function
const setFormSubmittedStatus = (applicationId: string, userId: string) => {
  if (!userId) {
    console.error("Cannot save form submission status: No user ID provided");
    return;
  }

  try {
    localStorage.setItem(`creditBuilderLoanSubmitted_${userId}`, "true");
    localStorage.setItem(`creditBuilderLoanId_${userId}`, applicationId);
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
        localStorage.getItem(`creditBuilderLoanSubmitted_${userId}`) === "true",
      applicationId:
        localStorage.getItem(`creditBuilderLoanId_${userId}`) || "",
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
    localStorage.removeItem(`creditBuilderLoanSubmitted_${userId}`);
    localStorage.removeItem(`creditBuilderLoanId_${userId}`);
  } catch (error) {
    console.error(
      "Error clearing form submission status from localStorage:",
      error
    );
  }
};

const CreditBuilderLoanForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  // Replace the existing application state and related code
  const [existingApplication, setExistingApplication] =
    useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  // Add this state variable after the other state declarations
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      ...formData,
      purpose: "Personal Use",
    },
    mode: "onBlur", // Validate on blur for better user experience
  });

  useEffect(() => {
    // Force set the purpose field to "Personal Use" when the component mounts
    setValue("purpose", "Personal Use");
    console.log("Setting default purpose to Personal Use");
  }, [setValue]);

  const employmentType = watch("employmentType");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // In the useEffect for checking existing application, update the data mapping:
  // Update the useEffect for checking existing application
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const result = await fetchCreditBuilderLoanApplication(user.id);
          if (result.success && result.data) {
            // Create a properly structured application object from the returned data
            setExistingApplication({
              id: result.data.id,
              fullName: result.data.fullName || "",
              email: result.data.email || "",
              phoneNo: result.data.mobileNumber || "",
              dateOfBirth: result.data.dateOfBirth,
              amtRequired: result.data.loanAmountRequired || "",
              prpseOfLoan: result.data.purpose || "",
              aadharNo: result.data.aadharNumber || "",
              panNo: result.data.panNumber || "",
              creditScore: result.data.creditScore?.toString() || "",
              empType: result.data.employmentType || "",

              monIncome: result.data.monthlyIncome || "",

              rejectionReason: result.data.rejectionReason || "",
              address: result.data.address || "",
              hasSalarySlip: result.data.hasSalarySlip || false,
              salaryReceiveMethod: result.data.salaryReceiveMethod || "",
              hasIncomeTaxReturn: result.data.hasIncomeTaxReturn || false,
              businessRegistration: result.data.businessRegistration || "",
              createdAt: result.data.createdAt
                ? new Date(result.data.createdAt).toISOString()
                : new Date().toISOString(),
              status: result.data.status || "",
              fasterProcessingPaid: result.data.fasterProcessingPaid || false,
            });
          }
        } catch (error) {
          console.error("Error checking existing application:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkExistingApplication();
  }, [user]);

  // Load saved form data from session storage on initial load
  useEffect(() => {
    const savedData = getFormDataFromSessionStorage();
    if (savedData) {
      // Sanitize the data before using it
      const sanitizedData = sanitizeFormData(savedData);

      setFormData(sanitizedData);
      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as any, value);
        }
      });
    }
  }, [setValue]);

  // Update the fetchRejectedApplication function to remove the isEligible check
  // Update the fetchRejectedApplication function
  useEffect(() => {
    const fetchRejectedApplication = async () => {
      if (user?.id && existingApplication) {
        try {
          const result = await getCreditBuilderLoanApplication(user.id);
          if (result.success && result.data) {
            // First, log the raw data to see what we're working with
            console.log("Raw API response data:", result.data);

            // Create a clean object with explicit field mapping
            const fetchedData: Partial<FormData> = {};

            // Map basic fields
            fetchedData.fullName = result.data.fullName || "";
            fetchedData.email = result.data.email || "";
            fetchedData.mobileNumber = result.data.phoneNo || "";

            // Handle date of birth
            if (result.data.dateOfBirth) {
              fetchedData.dateOfBirth = new Date(result.data.dateOfBirth)
                .toISOString()
                .split("T")[0];
              // Calculate age
              const calculatedAge = calculateAge(fetchedData.dateOfBirth);
              fetchedData.age = calculatedAge;
            }

            // Map loan details
            fetchedData.loanAmountRequired =
              result.data.amtRequired?.toString() || "";
            fetchedData.purpose = result.data.prpseOfLoan || "";

            // Map personal details
            fetchedData.aadharNumber = result.data.aadharNo || "";
            fetchedData.panNumber = result.data.panNo || "";
            fetchedData.address = result.data.address || "";

            // Map employment and financial details
            fetchedData.employmentType = result.data.empType || "";
            fetchedData.monthlyIncome = result.data.monIncome?.toString() || "";
            fetchedData.creditScore = result.data.creditScore?.toString() || "";
            fetchedData.currentActiveEmis =
              result.data.currEmis?.toString() || "";
            fetchedData.currentActiveOverdues =
              result.data.totalActiveLoans?.toString() || "";

            // Log the mapped data to verify
            console.log("Mapped form data:", fetchedData);

            // Update state and form
            setFormData(fetchedData);

            // Reset the form with the fetched data
            reset(fetchedData);

            // Force clear the aadharNumber field if it contains the loan amount
            if (
              fetchedData.aadharNumber === fetchedData.loanAmountRequired &&
              fetchedData.loanAmountRequired !== ""
            ) {
              console.log(
                "Detected aadharNumber field contains loan amount, clearing it"
              );
              setValue("aadharNumber", "");
            }

            console.log("Application data fetched and form pre-filled");
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
  }, [user, reset, toast, register, setValue, existingApplication, setError]);

  useEffect(() => {
    // If user exists and the application status is "Eligible", make sure we clear prior submission status
    if (user?.id && existingApplication?.status === "Eligible") {
      console.log(
        "User is eligible for a new loan - clearing previous submission data"
      );

      // Clear form submitted status
      clearFormSubmittedStatus(user.id);

      // We don't immediately clear the existingApplication from state to allow the user
      // to see they're eligible and choose to apply via the button click
    }
  }, [user, existingApplication]);

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

        // Set the form submitted status in localStorage with user ID
        if (user?.id) {
          setFormSubmittedStatus(result.data.id, user.id);
        }

        const eligibilityResult = await checkEligibility(result.data.id);

        // Add this logging to verify the data being passed
        console.log(
          "Checking eligibility with application ID:",
          result.data.id
        );
        console.log(
          "Monthly income for eligibility calculation:",
          data.monthlyIncome
        );

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
            status: eligibilityResult.message ? "In Progress" : "In Progress",
            message: eligibilityResult.message || "",
            applicationId: result.data.id,
            customerName: data.fullName,
            customerPhone: data.mobileNumber,
            customerEmail: data.email,
            monthlyIncome: data.monthlyIncome.toString(),
            preventRedirect: "true", // Add this parameter
          }).toString();

          router.push(
            `/credit-builder-loan/loan-eligibility-result?${queryParams}`
          );

          // Set form submitted status
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

        if (!user) return null;

        // Set form submitted status
        setFormSubmittedStatus(result.data.id, user.id);
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

  // Modify the nextStep function to sanitize data before saving to session storage
  // Modify the nextStep function to sanitize data before saving to session storage
  const nextStep = async () => {
    // If we're on step 2, specifically check the purpose field first
    if (currentStep === 2) {
      const purposeValue = getValues("purpose");
      console.log("Current purpose value:", purposeValue);

      // Check if purpose is empty or undefined
      if (!purposeValue || purposeValue.trim() === "") {
        // Force set the purpose field to "Personal Use"
        await setValue("purpose", "Personal Use", { shouldValidate: true });
        console.log("Purpose was empty, set to Personal Use");

        // Show a toast to inform the user
        toast({
          title: "Default Purpose Set",
          description: "Purpose of loan has been set to 'Personal Use'",
        });
      }
    }

    // Continue with validation for other fields in the current step
    const fields = {
      1: ["fullName", "email", "mobileNumber", "dateOfBirth", "age"],
      2: ["loanAmountRequired", "purpose"],
      3: [
        "aadharNumber",
        "panNumber",
        "address",
        "aadharFront",
        "aadharBack",
        "panCard",
      ],
      4: [
        "employmentType",
        "monthlyIncome",
        ...(employmentType === "Salaried"
          ? ["hasSalarySlip", "salaryReceiveMethod"]
          : []),
        ...(employmentType === "Self Employed"
          ? ["hasIncomeTaxReturn", "businessRegistration"]
          : []),
        ...(employmentType === "Others" ? ["EmpOthers"] : []),
      ],
      5: ["creditScore", "currentActiveEmis", "currentActiveOverdues"],
    }[currentStep];

    // Special handling for file inputs in step 3
    if (currentStep === 3) {
      const aadharFront = getValues("aadharFront");
      const aadharBack = getValues("aadharBack");
      const panCard = getValues("panCard");

      let hasErrors = false;

      if (!aadharFront) {
        setError("aadharFront", {
          type: "required",
          message: "Aadhaar front image is required",
        });
        hasErrors = true;
      }

      if (!aadharBack) {
        setError("aadharBack", {
          type: "required",
          message: "Aadhaar back image is required",
        });
        hasErrors = true;
      }

      if (!panCard) {
        setError("panCard", {
          type: "required",
          message: "PAN card image is required",
        });
        hasErrors = true;
      }

      if (hasErrors) {
        toast({
          title: "Missing Documents",
          description: "Please upload all required document images",
          variant: "destructive",
        });
        return;
      }
      console.log("All documents uploaded successfully:", {
        aadharFront: aadharFront?.name,
        aadharBack: aadharBack?.name,
        panCard: panCard?.name,
      });
    }

    // Add this after the file validation checks and before the salaryReceiveMethod check in the nextStep function
    if (currentStep === 4) {
      // Check employment type specific validations
      if (employmentType === "Salaried") {
        // Check salaryReceiveMethod (already implemented)
        const salaryReceiveMethod = getValues("salaryReceiveMethod");
        if (!salaryReceiveMethod) {
          setError("salaryReceiveMethod", {
            type: "required",
            message: "Please select how you receive your salary",
          });
          toast({
            title: "Validation Error",
            description: "Please select how you receive your salary",
            variant: "destructive",
          });
          return;
        }
      } else if (employmentType === "Self Employed") {
        // Check businessRegistration
        const businessRegistration = getValues("businessRegistration");
        if (!businessRegistration) {
          setError("businessRegistration", {
            type: "required",
            message: "Please select your business registration type",
          });
          toast({
            title: "Validation Error",
            description: "Please select your business registration type",
            variant: "destructive",
          });
          return;
        }
      } else if (employmentType === "Others") {
        // Check if EmpOthers is filled
        const empOthers = getValues("EmpOthers");
        if (!empOthers) {
          setError("EmpOthers", {
            type: "required",
            message: "Please specify your employment type",
          });
          toast({
            title: "Validation Error",
            description: "Please specify your employment type",
            variant: "destructive",
          });
          return;
        }
      }
    }

    if (currentStep === 4 && employmentType === "Salaried") {
      const salaryReceiveMethod = getValues("salaryReceiveMethod");
      if (!salaryReceiveMethod) {
        setError("salaryReceiveMethod", {
          type: "required",
          message: "Please select how you receive your salary",
        });
        toast({
          title: "Validation Error",
          description: "Please select how you receive your salary",
          variant: "destructive",
        });
        return;
      }
    }

    // Force validate the purpose field if we're on step 2
    if (currentStep === 2) {
      await trigger("purpose");
    }

    const isValid = await trigger(fields as any);

    if (isValid) {
      // Create a complete snapshot of all current form values
      const allCurrentValues = getValues();
      console.log("All form values before next step:", allCurrentValues);

      // Sanitize the data before saving
      const sanitizedValues = sanitizeFormData(allCurrentValues);

      // If we're moving to step 3 (Aadhaar details), ensure the Aadhaar field is clean
      if (currentStep === 2) {
        console.log("Moving to Aadhaar step, ensuring Aadhaar field is clean");
        setValue("aadharNumber", "");
        sanitizedValues.aadharNumber = "";
      }

      // Update the form data state with sanitized values
      setFormData(sanitizedValues);

      // Save sanitized values to session storage
      try {
        sessionStorage.setItem(
          "creditBuilderLoanFormData",
          JSON.stringify(sanitizedValues)
        );
      } catch (error) {
        console.error("Error saving form data to sessionStorage:", error);
      }

      // Move to the next step
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      console.log("Validation failed for fields:", fields);
      console.log("Current errors:", errors);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
    if (currentStep === 5) {
      const bankStatement = getValues("bankStatement");
      console.log("Bank statement value:", bankStatement);

      if (!bankStatement) {
        setError("bankStatement", {
          type: "required",
          message: "Bank statement is required",
        });
        toast({
          title: "Missing Document",
          description: "Please upload your bank statement before proceeding",
          variant: "destructive",
        });
        return;
      }
    }
  };

  // Modify the prevStep function to also sanitize data
  const prevStep = () => {
    // Create a complete snapshot of all current form values
    const allCurrentValues = getValues();

    // Sanitize the data before saving
    const sanitizedValues = sanitizeFormData(allCurrentValues);

    // Update the form data state with sanitized values
    setFormData(sanitizedValues);

    // Save sanitized values to session storage
    try {
      sessionStorage.setItem(
        "creditBuilderLoanFormData",
        JSON.stringify(sanitizedValues)
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
      // Sanitize the data before resetting the form
      const sanitizedData = sanitizeFormData(formData);

      // If we're on step 3 (Aadhaar details), ensure the Aadhaar field is clean
      if (currentStep === 3) {
        console.log("On Aadhaar step, ensuring Aadhaar field is clean");
        sanitizedData.aadharNumber = "";
      }

      reset(sanitizedData);
    }
  }, [currentStep, reset, formData]);

  // Add this useEffect after your other useEffects
  useEffect(() => {
    return () => {
      // Clean up function to prevent data leakage between sessions
      if (typeof window !== "undefined") {
        // Don't clear session storage on unmount, only when form is successfully submitted
      }
    };
  }, []);

  useEffect(() => {
    // Register the bankStatement field with required validation
    register("bankStatement", {
      required: "Bank statement is required",
    });
  }, [register]);

  // Add this useEffect at the beginning of the other useEffect hooks to check for previous submissions
  useEffect(() => {
    // Only proceed if we have a user
    if (!user?.id) return;

    const { submitted, applicationId } = getFormSubmittedStatus(user.id);

    if (submitted && applicationId) {
      setIsRedirecting(true);
      toast({
        title: "Previous Application Found",
        description: "Redirecting you to the loan eligibility result page.",
      });

      // Short delay to allow toast to be seen
      setTimeout(async () => {
        try {
          // Fetch the application data to get the eligible amount
          const result = await getCreditBuilderLoanApplication(applicationId);
          let eligibleAmount = "0";

          if (result.success && result.data) {
            // Use a type-safe approach to check for properties
            const data = result.data as any; // Cast to any to bypass TypeScript checking
            const amount =
              data.eligibleAmount !== undefined
                ? data.eligibleAmount
                : data.amtRequired !== undefined
                  ? data.amtRequired
                  : 0;
            eligibleAmount = String(amount);
            console.log("Found eligible amount:", eligibleAmount);
          }

          // Create a clean URL with the correct parameters matching the loan-eligibility-result page
          const redirectUrl = `/credit-builder-loan/loan-eligibility-result?applicationId=${applicationId}&preventRedirect=true&status=In Progress&eligibleAmount=${eligibleAmount}`;
          console.log("Redirecting to:", redirectUrl);
          router.push(redirectUrl);
        } catch (error) {
          console.error(
            "Error fetching application data for redirection:",
            error
          );
          // Fallback to basic redirection if fetching fails
          const redirectUrl = `/credit-builder-loan/loan-eligibility-result?applicationId=${applicationId}&preventRedirect=true&status=In Progress`;
          console.log("Fallback redirecting to:", redirectUrl);
          router.push(redirectUrl);
        }
      }, 1500);
    }
  }, [router, toast, user]);

  // Replace the renderLockedApplicationStatus function with this simpler version
  // Update the renderLockedApplicationStatus function
  const renderLockedApplicationStatus = () => {
    if (!existingApplication) return null;

    const formatDate = (dateString?: string | Date) => {
      if (!dateString) return "N/A";
      try {
        return new Date(dateString).toLocaleDateString();
      } catch (e) {
        return String(dateString);
      }
    };

    // Get the current status from the application
    const status =
      existingApplication.status ||
      (existingApplication.rejectionReason ? "Rejected" : "Pending");

    // Check if the application is in progress and faster processing fee is not paid
    const showFasterProcessing =
      status === "In Progress" &&
      existingApplication.fasterProcessingPaid === false;

    return (
      <Card className="border-2 border-orange-500 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">
            Credit Builder Loan Application Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Application Details</h3>
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium ${status === "Rejected" ? "text-red-600" : status === "Eligible" ? "text-green-600" : "text-blue-600"}`}
                >
                  {status}
                </span>
                {status === "Rejected" ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : status === "Eligible" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Applicant Name</p>
                <p className="font-medium">
                  {existingApplication.fullName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="font-medium">
                  ₹
                  {Number(
                    existingApplication.amtRequired || 0
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purpose of Loan</p>
                <p className="font-medium">
                  {existingApplication.prpseOfLoan || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Date</p>
                <p className="font-medium">
                  {formatDate(existingApplication.createdAt)}
                </p>
              </div>
              {existingApplication.rejectionReason && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Rejection Reason</p>
                  <p className="font-medium text-red-600">
                    {existingApplication.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            {/* Faster Processing Card - Only show if application is in progress and fee not paid */}
            {showFasterProcessing && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 mt-4 shadow-md">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Speed Up Your Application
                </h4>
                <p className="text-sm text-yellow-700 mb-4">
                  Pay a small fee to get your loan application processed faster.
                  Get priority review and quicker approval.
                </p>
                <div className="mt-4">
                  <FasterProcessingButton
                    applicationId={existingApplication.id}
                    customerName={existingApplication.fullName || ""}
                    customerPhone={existingApplication.phoneNo || ""}
                    customerEmail={existingApplication.email || ""}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {status === "Eligible" ? (
                <p className="text-green-600 font-medium">
                  You are now eligible to apply for a new loan. Please proceed
                  to the dashboard to start a new application.
                </p>
              ) : (
                <p className="text-gray-600">
                  You already have an active loan application. You cannot submit
                  a new application until the current one is processed or you
                  are made eligible again.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
                {status === "Eligible" && (
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => {
                      // Clear any existing application data from localStorage
                      if (user?.id) {
                        clearFormSubmittedStatus(user.id);

                        // Also clear session storage form data
                        clearFormDataFromLocalStorage();

                        // Clear bank details submission status if applicationId exists
                        if (existingApplication.id) {
                          localStorage.removeItem(
                            `bankDetailsSubmitted_${user.id}_${existingApplication.id}`
                          );
                          localStorage.removeItem(
                            `bankDetailsSubmissionTime_${user.id}_${existingApplication.id}`
                          );
                          localStorage.removeItem(
                            `processed_${existingApplication.id}`
                          );
                        }
                      }

                      // Clear existing application data from state to show the form
                      setExistingApplication(null);
                    }}
                  >
                    Apply for New Loan
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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
                  render={({ field }) => (
                    <>
                      <Select
                        defaultValue="Personal Use"
                        onValueChange={(value) => {
                          field.onChange(value);
                          console.log("Purpose changed to:", value);
                        }}
                        value={field.value || "Personal Use"}
                      >
                        <SelectTrigger
                          id="purpose"
                          className={errors.purpose ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select purpose">
                            {field.value || "Personal Use"}
                          </SelectValue>
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
                    setValueAs: (value) => {
                      // Ensure we're only storing numeric values
                      return value ? value.replace(/\D/g, "") : value;
                    },
                    validate: {
                      notLoanAmount: (value) => {
                        const loanAmount = getValues("loanAmountRequired");
                        return (
                          value !== loanAmount ||
                          "Aadhaar number cannot be the same as loan amount"
                        );
                      },
                    },
                    onChange: (e) => {
                      // Only allow numeric input
                      const value = e.target.value;
                      if (value && !/^\d*$/.test(value)) {
                        e.target.value = value.replace(/[^\d]/g, "");
                      }

                      // Check if the value matches the loan amount and clear if it does
                      const loanAmount = getValues("loanAmountRequired");
                      if (value === loanAmount && loanAmount !== "") {
                        console.log(
                          "Detected aadharNumber input matches loan amount, clearing"
                        );
                        e.target.value = "";
                        setValue("aadharNumber", "");
                      }
                    },
                  })}
                  type="text"
                  maxLength={12}
                  onFocus={(e) => {
                    // When the field gets focus, check if it contains the loan amount
                    const value = e.target.value;
                    const loanAmount = getValues("loanAmountRequired");
                    if (value === loanAmount && loanAmount !== "") {
                      console.log(
                        "Focus: Detected aadharNumber contains loan amount, clearing"
                      );
                      e.target.value = "";
                      setValue("aadharNumber", "");
                    }
                  }}
                />
                {errors.aadharNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.aadharNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadharFront">
                  Upload Aadhaar Front{" "}
                  <span className="text-muted-foreground">
                    (maximum image size: 1mb)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="aadharFront"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setValue("aadharFront", file);
                    // Clear validation error when file is selected
                    if (file) {
                      clearErrors("aadharFront");
                    }
                    console.log("Aadhaar front file selected:", file?.name);
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
                  Upload Aadhaar Back{" "}
                  <span className="text-muted-foreground">
                    (maximum image size: 1mb)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="aadharBack"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setValue("aadharBack", file);
                    // Clear validation error when file is selected
                    if (file) {
                      clearErrors("aadharBack");
                    }
                    console.log("Aadhaar back file selected:", file?.name);
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
                  Upload PAN Card{" "}
                  <span className="text-muted-foreground">
                    (maximum image size: 1mb)
                  </span>
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="panCard"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setValue("panCard", file);
                    // Clear validation error when file is selected
                    if (file) {
                      clearErrors("panCard");
                    }
                    console.log("PAN card file selected:", file?.name);
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
                  <div className="flex items-start space-x-2">
                    <div className="mt-1">
                      <Controller
                        name="hasSalarySlip"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="hasSalarySlip"
                            checked={field.value === true}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                            }}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hasSalarySlip" className="font-medium">
                        Do you have salary slip?{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      {errors.hasSalarySlip && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.hasSalarySlip.message}
                        </p>
                      )}
                    </div>
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
                        <>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-2"
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
                          {errors.salaryReceiveMethod && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.salaryReceiveMethod.message}
                            </p>
                          )}
                        </>
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
                  <div className="flex items-start space-x-2">
                    <div className="mt-1">
                      <Controller
                        name="hasIncomeTaxReturn"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="hasIncomeTaxReturn"
                            checked={field.value === true}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                            }}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="hasIncomeTaxReturn"
                        className="font-medium"
                      >
                        Do you have Income Tax Return?{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      {errors.hasIncomeTaxReturn && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.hasIncomeTaxReturn.message}
                        </p>
                      )}
                    </div>
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
                            <SelectItem value="None of above">
                              None of above
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
              {/* <div className="space-y-4">
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
                        setValue("bankStatement", res[0].url, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                        toast({
                          title: "Upload Completed",
                          description:
                            "Your bank statement has been uploaded successfully.",
                        });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setError("bankStatement", {
                        type: "required",
                        message: "Failed to upload bank statement",
                      });
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
                  {!watch("bankStatement") && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
                      <p className="text-red-600 font-medium">
                        Bank statement is required. Please upload your bank
                        statement.
                      </p>
                    </div>
                  )}
                  {errors.bankStatement && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
                      <p className="text-red-600 font-medium">
                        {errors.bankStatement.message}
                      </p>
                    </div>
                  )}
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Upload your bank statement in PDF format (Max size: 4MB)
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
              </div> */}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  // Show loading state while checking for existing application
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Add this redirecting UI state before the return statement
  // Add this right after the loading check
  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-center">
          Redirecting to your loan eligibility result...
        </h2>
        <p className="text-gray-500 mt-2 text-center">Please wait a moment</p>
      </div>
    );
  }

  // Update the return statement to check for status correctly
  // Update the return statement to check for eligibility status
  // Update the return statement to check for eligibility status
  return (
    <div className="mx-auto w-full max-w-4xl p-6 space-y-8">
      {/* Show loading state */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Show locked application status if user has an existing application */}
      {!isLoading &&
        existingApplication &&
        existingApplication.status !== "Eligible" &&
        renderLockedApplicationStatus()}

      {/* Show the form only if user doesn't have any application */}
      {!isLoading &&
        (!existingApplication || existingApplication.status === "Eligible") && (
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

              {existingApplication &&
                existingApplication.status === "Eligible" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="font-medium text-green-800">
                        You are now eligible to apply for a new loan. Please
                        fill out the form below.
                      </p>
                    </div>
                  </div>
                )}

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
        )}

      <DevTool control={control} />
    </div>
  );
};

export default CreditBuilderLoanForm;
