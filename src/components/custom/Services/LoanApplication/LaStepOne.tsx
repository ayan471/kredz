"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  submitLoanApplicationStep1,
  checkExistingLoanApplication,
  saveRejectedApplication,
  determineMembershipPlan,
} from "@/actions/loanApplicationActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import type { LoanApplication } from "@/types";
import "@uploadthing/react/styles.css";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RejectionMessage } from "./rejection-message";
import { getEligibleLoanAmount } from "@/components/lib/loanCalculations";
import SabpaisaPaymentGateway from "@/components/sabpaisa-payment-gateway";
import { initiateSabpaisaPayment } from "@/components/lib/sabPaisa";

const totalActiveLoansRanges = [
  { label: "0-3", value: "0-3" },
  { label: "4-7", value: "4-7" },
  { label: "8-10", value: "8-10" },
  { label: "10+", value: "10+" },
];

const incomeRanges = [
  { label: "0-10,000", value: "0-10000" },
  { label: "10,001-20,000", value: "10001-20000" },
  { label: "20,001-30,000", value: "20001-30000" },
  { label: "30,001-37,000", value: "30001-37000" },
  { label: "37,001-45,000", value: "37001-45000" },
  { label: "45,001-55,000", value: "45001-55000" },
  { label: "55,001-65,000", value: "55001-65000" },
  { label: "65,001-75,000", value: "65001-75000" },
  { label: "75,001-85,000", value: "75001-85000" },
  { label: "85,001-95,000", value: "85001-95000" },
  { label: "95,001-1,25,000", value: "95001-125000" },
  { label: "More than 1,25,000", value: "125001+" },
];

const creditScoreRanges = [
  { label: "0-300", value: "0-300" },
  { label: "301-600", value: "301-600" },
  { label: "601-750", value: "601-750" },
  { label: "751+", value: "751+" },
];

type FormValues = {
  fullName: string;
  email: string;
  phoneNo: string;
  dateOfBirth: string;
  prpseOfLoan: string;
  aadharImgFront: FileList;
  aadharImgBack: FileList;
  aadharNo: string;
  panImgFront: FileList;
  panNo: string;
  creditScore: string;
  empType: string;
  EmpOthers: string;
  monIncomeRange: string;
  monIncome: string;
  currEmis: string;
  selfieImg: FileList;
  bankStatmntImg: string;
  amtRequired: string;
  totalActiveLoans: string;
  termsConfirmation: boolean;
  eligibleLoanAmount: number;
  age: number;
};

// Membership form values
type MembershipFormValues = {
  fullName: string;
  phoneNo: string;
  emailID: string;
  panNo: string;
  aadharNo: string;
  membershipPlan: string;
};

const steps = [
  "Personal Information",
  "Employment & Income",
  "Loan Details",
  "Document Upload",
  "Financial Obligations",
  "Review & Terms",
];

const calculateAge = (birthDate: string): number => {
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
  return age;
};

// Utility functions for form data persistence
const saveFormDataToLocalStorage = (data: Partial<FormValues>) => {
  try {
    // Filter out file inputs before saving
    const dataToSave = { ...data };
    Object.keys(dataToSave).forEach((key) => {
      if (dataToSave[key as keyof FormValues] instanceof FileList) {
        delete dataToSave[key as keyof FormValues];
      }
    });

    sessionStorage.setItem("loanApplicationData", JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Error saving form data to sessionStorage:", error);
  }
};

const getFormDataFromLocalStorage = (): Partial<FormValues> | null => {
  try {
    const savedData = sessionStorage.getItem("loanApplicationData");
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error retrieving form data from sessionStorage:", error);
    return null;
  }
};

const clearFormDataFromLocalStorage = () => {
  try {
    sessionStorage.removeItem("loanApplicationData");
  } catch (error) {
    console.error("Error clearing form data from sessionStorage:", error);
  }
};

// File size validation function (1MB = 1024 * 1024 bytes)
const validateFileSize = (
  files: FileList | null,
  maxSizeInMB = 1
): string | true => {
  if (!files || files.length === 0) return true;

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  const file = files[0];

  if (file.size > maxSizeInBytes) {
    return `File size must be less than ${maxSizeInMB}MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
  }

  return true;
};

const calculateAmounts = (basePrice: number) => {
  const gstAmount = basePrice * 0.18;
  const totalAmount = basePrice + gstAmount;
  return {
    basePrice: basePrice.toFixed(2),
    gstAmount: gstAmount.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
  };
};

interface StepProps {
  control: any;
  register: any;
  errors: FieldErrors<FormValues>;
  setValue: any;
  user?: any;
  age?: number | null;
  isAgeInvalid: boolean;
  getValues?: () => FormValues;
  watch: any;
}

// Membership Card Component
const MembershipCard: React.FC<{
  applicationData: LoanApplication;
  onClose: () => void;
}> = ({ applicationData, onClose }) => {
  const [membershipPlan, setMembershipPlan] = useState<string>("");
  const [planDetails, setPlanDetails] = useState<{
    name: string;
    discountedPrice: number;
    realPrice: number;
    features: string[];
  }>({ name: "", discountedPrice: 0, realPrice: 0, features: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const { toast } = useToast();
  const { user } = useUser();

  const membershipForm = useForm<MembershipFormValues>({
    defaultValues: {
      fullName: applicationData.fullName || "",
      phoneNo: applicationData.phoneNo || "",
      emailID: user?.emailAddresses[0]?.emailAddress || "",
      panNo: applicationData.panNo || "",
      aadharNo: applicationData.aadharNo || "",
      membershipPlan: "",
    },
  });

  useEffect(() => {
    const fetchMembershipPlan = async () => {
      if (applicationData.monIncome) {
        const plan = await determineMembershipPlan(
          Number(applicationData.monIncome)
        );
        setMembershipPlan(plan);
        membershipForm.setValue("membershipPlan", plan);

        // Set plan details
        setPlanDetails({
          name: plan,
          discountedPrice:
            plan === "Bronze"
              ? 179
              : plan === "Silver"
                ? 289
                : plan === "Gold"
                  ? 389
                  : plan === "Platinum"
                    ? 479
                    : 0,
          realPrice:
            plan === "Bronze"
              ? 300
              : plan === "Silver"
                ? 600
                : plan === "Gold"
                  ? 900
                  : plan === "Platinum"
                    ? 1200
                    : 0,
          features: [
            "Instant processing",
            "Exclusive interest rates",
            "24/7 customer support",
            "Priority loan approval",
          ],
        });
      }
    };

    fetchMembershipPlan();
  }, [applicationData, membershipForm]);

  const onMembershipSubmit = async (data: MembershipFormValues) => {
    setIsSubmitting(true);

    try {
      console.log("Submitting membership data:", {
        applicationId: applicationData.id,
        membershipData: data,
      });

      toast({
        title: "Membership Submitted!",
        description: "Initiating payment...",
      });

      // Proceed directly to payment without updating application data
      const paymentResult = await initiateSabpaisaPayment({
        amount: Number.parseFloat(
          calculateAmounts(planDetails.discountedPrice).totalAmount
        ),
        orderId: `${applicationData.id}-${Date.now()}`, // Generate unique order ID
        customerName: data.fullName,
        customerPhone: data.phoneNo,
        customerEmail: data.emailID,
        customerAddress: "Not Provided",
      });

      if (paymentResult.success && paymentResult.paymentDetails) {
        setPaymentDetails(paymentResult.paymentDetails);
        setShowPaymentModal(true);
      } else {
        console.error("Payment initiation failed:", paymentResult.error);
        toast({
          title: "Payment Error",
          description:
            paymentResult.error ||
            "Failed to initiate payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in membership submission:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentToggle = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-6 space-y-8">
      <Card className="border-2 border-orange-500 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">
            Complete Your Membership
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Application Status
              </AlertTitle>
              <AlertDescription className="text-green-700">
                Your loan application is ready! Complete your membership to
                proceed with loan processing.
              </AlertDescription>
            </Alert>
          </div>

          <form
            onSubmit={membershipForm.handleSubmit(onMembershipSubmit)}
            className="space-y-8"
          >
            <Card className="border-orange-500 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white">
                <CardTitle className="text-2xl font-bold">
                  {planDetails.name} Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                  <div className="text-3xl font-bold mb-4 md:mb-0">
                    ₹{calculateAmounts(planDetails.discountedPrice).basePrice}
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 w-full md:w-auto">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 mr-4">
                        Base Price:
                      </span>
                      <span className="font-medium">
                        ₹
                        {
                          calculateAmounts(planDetails.discountedPrice)
                            .basePrice
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 mr-4">
                        GST (18%):
                      </span>
                      <span className="font-medium">
                        ₹
                        {
                          calculateAmounts(planDetails.discountedPrice)
                            .gstAmount
                        }
                      </span>
                    </div>
                    <div className="border-t border-orange-200 my-2"></div>
                    <div className="flex justify-between items-center mt-2 p-2 bg-orange-100 rounded-md">
                      <span className="font-bold text-blue-900">Total:</span>
                      <span className="font-bold text-lg text-orange-600">
                        ₹
                        {
                          calculateAmounts(planDetails.discountedPrice)
                            .totalAmount
                        }
                      </span>
                    </div>
                    <div className="text-sm text-right mt-1 line-through text-gray-500">
                      Original: ₹{planDetails.realPrice}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-orange-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-500 shadow-md">
              <CardContent className="p-6 space-y-6">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    type="text"
                    id="fullName"
                    {...membershipForm.register("fullName", {
                      required: "Full name is required",
                    })}
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="phoneNo">Phone No</Label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      +91
                    </span>

                    <Input
                      type="tel"
                      id="phoneNo"
                      className="pl-10"
                      {...membershipForm.register("phoneNo", {
                        required: "Phone number is required",
                      })}
                    />
                  </div>
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="emailID">Email ID</Label>
                  <Input
                    type="email"
                    id="emailID"
                    {...membershipForm.register("emailID", {
                      required: "Email is required",
                    })}
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="panNo">PAN No</Label>
                  <Input
                    type="text"
                    id="panNo"
                    {...membershipForm.register("panNo", {
                      required: "PAN number is required",
                    })}
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="aadharNo">Aadhar No</Label>
                  <Input
                    type="text"
                    id="aadharNo"
                    {...membershipForm.register("aadharNo", {
                      required: "Aadhar number is required",
                    })}
                  />
                </div>
                <Input
                  type="hidden"
                  {...membershipForm.register("membershipPlan")}
                />
              </CardContent>
            </Card>
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full md:flex-1 bg-transparent"
              >
                Back to Application
              </Button>
              <Button
                type="submit"
                className="w-full md:flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Proceed to Payment"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
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
};

const Step1Personal: React.FC<StepProps> = ({
  control,
  register,
  errors,
  setValue,
  user,
  age,
  isAgeInvalid,
  watch,
}) => (
  <div className="space-y-6">
    <div className="grid w-full items-center gap-3">
      <Label htmlFor="fullName" className="text-base font-semibold">
        Full Name
      </Label>
      <Input
        id="fullName"
        type="text"
        {...register("fullName", { required: "Full name is required" })}
        className="w-full p-3"
      />
      {errors.fullName && (
        <p className="text-red-500 text-sm">{errors.fullName.message}</p>
      )}
    </div>
    <div className="grid w-full items-center gap-3">
      <Label htmlFor="email" className="text-base font-semibold">
        Email
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
        className="w-full p-3"
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}
    </div>
    <div className="grid w-full items-center gap-3">
      <Label htmlFor="phoneNo" className="text-base font-semibold">
        Phone Number
      </Label>
      <Input
        id="phoneNo"
        type="tel"
        {...register("phoneNo", {
          required: "Phone number is required",
        })}
        className="w-full p-3"
      />
      {errors.phoneNo && (
        <p className="text-red-500 text-sm">{errors.phoneNo.message}</p>
      )}
    </div>
    <div className="grid w-full items-center gap-3">
      <Label htmlFor="dateOfBirth" className="text-base font-semibold">
        Date of Birth
      </Label>
      <Input
        id="dateOfBirth"
        type="date"
        {...register("dateOfBirth", {
          required: "Date of Birth is required",
        })}
        className={`w-full p-3 ${isAgeInvalid ? "border-red-500" : ""}`}
      />
      {errors.dateOfBirth && (
        <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
      )}
    </div>
    {age !== null && (
      <div
        className={`text-sm ${isAgeInvalid ? "text-red-600" : "text-muted-foreground"}`}
      >
        Age: {age} years
      </div>
    )}
    {isAgeInvalid && (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Age Requirement Not Met</AlertTitle>
        <AlertDescription>
          You must be at least 18 years old to apply for a loan. Please correct
          your date of birth.
        </AlertDescription>
      </Alert>
    )}
  </div>
);

const Step2EmploymentIncome: React.FC<StepProps> = ({
  control,
  register,
  errors,
  isAgeInvalid,
  watch,
  setValue,
}) => {
  const monIncome = watch("monIncome");
  const age = watch("age");

  useEffect(() => {
    if (monIncome && age) {
      getEligibleLoanAmount(age, Number(monIncome)).then((amount) => {
        setValue("eligibleLoanAmount", amount);
      });
    }
  }, [monIncome, age, setValue]);

  return (
    <div className="space-y-6">
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="empType" className="text-base font-semibold">
          Employment Type
        </Label>
        <Controller
          name="empType"
          control={control}
          rules={{ required: "Employment type is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full p-3">
                <SelectValue placeholder="Select Employment Type" />
              </SelectTrigger>
              <SelectContent>
                {["Salaried", "Self-Employed", "Business Owner", "Other"].map(
                  (type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.empType && (
          <p className="text-red-500 text-sm">{errors.empType.message}</p>
        )}
      </div>

      <div className="grid w-full items-center gap-3">
        <Label htmlFor="monIncomeRange" className="text-base font-semibold">
          Monthly Income Range
        </Label>
        <Controller
          name="monIncomeRange"
          control={control}
          rules={{ required: "Monthly income range is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full p-3">
                <SelectValue placeholder="Select Income Range" />
              </SelectTrigger>
              <SelectContent>
                {incomeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.monIncomeRange && (
          <p className="text-red-500 text-sm">
            {errors.monIncomeRange.message}
          </p>
        )}
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="monIncome" className="text-base font-semibold">
          Monthly Income
        </Label>
        <Input
          id="monIncome"
          type="number"
          {...register("monIncome", {
            required: "Monthly income is required",
            min: {
              value: 1000,
              message: "Monthly income must be at least 1000",
            },
          })}
          className="w-full p-3"
        />
        {errors.monIncome && (
          <p className="text-red-500 text-sm">{errors.monIncome.message}</p>
        )}
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="creditScore" className="text-base font-semibold">
          Credit Score
        </Label>
        <Controller
          name="creditScore"
          control={control}
          rules={{ required: "Credit Score is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full p-3">
                <SelectValue placeholder="Select Credit Score Range" />
              </SelectTrigger>
              <SelectContent>
                {creditScoreRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.creditScore && (
          <p className="text-red-500 text-sm">{errors.creditScore.message}</p>
        )}
      </div>
    </div>
  );
};

const Step3LoanDetails: React.FC<StepProps> = ({
  control,
  register,
  errors,
  isAgeInvalid,
  watch,
}) => {
  const eligibleLoanAmount = watch("eligibleLoanAmount");

  return (
    <div className="space-y-6">
      {eligibleLoanAmount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-green-800">
            Based on your age and income, you are eligible for a loan up to ₹
            {eligibleLoanAmount.toLocaleString()}
          </p>
        </div>
      )}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="amtRequired" className="text-base font-semibold">
          Amount Required
        </Label>
        <Input
          id="amtRequired"
          type="number"
          {...register("amtRequired", {
            required: "Amount is required",
            min: {
              value: 1000,
              message: "Amount must be at least 1000",
            },
            max: {
              value: eligibleLoanAmount,
              message: `Amount cannot exceed ₹${eligibleLoanAmount.toLocaleString()}`,
            },
          })}
          className="w-full p-3"
        />
        {errors.amtRequired && (
          <p className="text-red-500 text-sm">{errors.amtRequired.message}</p>
        )}
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="prpseOfLoan" className="text-base font-semibold">
          Purpose of Loan <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="prpseOfLoan"
          control={control}
          rules={{
            required: "Purpose of loan is required",
          }}
          render={({ field }) => (
            <>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  console.log("Purpose changed to:", value);
                }}
                value={field.value}
              >
                <SelectTrigger
                  id="prpseOfLoan"
                  className={`w-full p-3 ${errors.prpseOfLoan ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal Use">Personal Use</SelectItem>
                  <SelectItem value="Business Expansion">
                    Business Expansion
                  </SelectItem>
                  <SelectItem value="Medical Issue">Medical Issue</SelectItem>
                  <SelectItem value="House Renovation">
                    House Renovation
                  </SelectItem>
                  <SelectItem value="Debt Consolidation">
                    Debt Consolidation
                  </SelectItem>
                  <SelectItem value="Travel Expense">Travel Expense</SelectItem>
                  <SelectItem value="Self Marriage">Self Marriage</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              {errors.prpseOfLoan && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.prpseOfLoan.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

const Step4Documents: React.FC<StepProps> = ({
  control,
  register,
  errors,
  isAgeInvalid,
  setValue,
  watch,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="aadharNo" className="text-base font-semibold">
          Aadhar Number
        </Label>
        <Input
          id="aadharNo"
          type="number"
          {...register("aadharNo", {
            required: "Aadhar number is required",
            pattern: {
              value: /^\d{12}$/,
              message: "Aadhar number must be exactly 12 digits",
            },
            validate: (value: string) => {
              // Remove any spaces or special characters
              const cleanValue = value.replace(/\D/g, "");
              if (cleanValue.length !== 12) {
                return "Aadhar number must be exactly 12 digits";
              }
              // Basic checksum validation could be added here if needed
              return true;
            },
          })}
          className="w-full p-3"
          placeholder="Enter 12-digit Aadhar number"
          maxLength={12}
        />
        {errors.aadharNo && (
          <p className="text-red-500 text-sm">{errors.aadharNo.message}</p>
        )}
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="aadharImgFront" className="text-base font-semibold">
          Upload Aadhar Card (Front)
        </Label>
        <Input
          id="aadharImgFront"
          type="file"
          {...register("aadharImgFront", {
            required: "Aadhar card front image is required",
            validate: {
              fileSize: (files: FileList) => validateFileSize(files, 1),
              fileType: (files: FileList) => {
                if (!files || files.length === 0) return true;
                const file = files[0];
                const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                if (!allowedTypes.includes(file.type)) {
                  return "Only JPG, JPEG, and PNG files are allowed";
                }
                return true;
              },
            },
          })}
          className="w-full p-3"
          accept=".jpg,.jpeg,.png"
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 1MB. Supported formats: JPG, JPEG, PNG
        </p>
        {errors.aadharImgFront && (
          <p className="text-red-500 text-sm">
            {errors.aadharImgFront.message}
          </p>
        )}
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="aadharImgBack" className="text-base font-semibold">
          Upload Aadhar Card (Back)
        </Label>
        <Input
          id="aadharImgBack"
          type="file"
          {...register("aadharImgBack", {
            required: "Aadhar card back image is required",
            validate: {
              fileSize: (files: FileList) => validateFileSize(files, 1),
              fileType: (files: FileList) => {
                if (!files || files.length === 0) return true;
                const file = files[0];
                const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                if (!allowedTypes.includes(file.type)) {
                  return "Only JPG, JPEG, and PNG files are allowed";
                }
                return true;
              },
            },
          })}
          className="w-full p-3"
          accept=".jpg,.jpeg,.png"
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 1MB. Supported formats: JPG, JPEG, PNG
        </p>
        {errors.aadharImgBack && (
          <p className="text-red-500 text-sm">{errors.aadharImgBack.message}</p>
        )}
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="panNo" className="text-base font-semibold">
          PAN Number
        </Label>
        <Input
          id="panNo"
          {...register("panNo", {
            required: "PAN number is required",
            pattern: {
              value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
              message: "Please enter a valid PAN number (e.g., ABCDE1234F)",
            },
          })}
          maxLength={10}
        />
        {errors.panNo && (
          <p className="text-sm text-red-500 mt-1">{errors.panNo.message}</p>
        )}
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="panImgFront" className="text-base font-semibold">
          Upload PAN Card (Front)
        </Label>
        <Input
          id="panImgFront"
          type="file"
          {...register("panImgFront", {
            required: "PAN card image is required",
            validate: {
              fileSize: (files: FileList) => validateFileSize(files, 1),
              fileType: (files: FileList) => {
                if (!files || files.length === 0) return true;
                const file = files[0];
                const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                if (!allowedTypes.includes(file.type)) {
                  return "Only JPG, JPEG, and PNG files are allowed";
                }
                return true;
              },
            },
          })}
          className="w-full p-3"
          accept=".jpg,.jpeg,.png"
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 1MB. Supported formats: JPG, JPEG, PNG
        </p>
        {errors.panImgFront && (
          <p className="text-red-500 text-sm">{errors.panImgFront.message}</p>
        )}
      </div>

      <div className="grid w-full items-center gap-3">
        <Label htmlFor="selfieImg" className="text-base font-semibold">
          Upload your selfie
        </Label>
        <Input
          id="selfieImg"
          type="file"
          {...register("selfieImg", {
            required: "Selfie image is required",
            validate: {
              fileSize: (files: FileList) => validateFileSize(files, 1),
              fileType: (files: FileList) => {
                if (!files || files.length === 0) return true;
                const file = files[0];
                const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                if (!allowedTypes.includes(file.type)) {
                  return "Only JPG, JPEG, and PNG files are allowed";
                }
                return true;
              },
            },
          })}
          className="w-full p-3"
          accept=".jpg,.jpeg,.png"
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 1MB. Supported formats: JPG, JPEG, PNG
        </p>
        {errors.selfieImg && (
          <p className="text-red-500 text-sm">{errors.selfieImg.message}</p>
        )}
      </div>
    </div>
  );
};

const Step5Financial: React.FC<StepProps> = ({
  control,
  register,
  errors,
  isAgeInvalid,
}) => (
  <div className="space-y-6">
    <div className="grid w-full items-center gap-3">
      <Label htmlFor="currEmis" className="text-base font-semibold">
        Current EMIs
      </Label>
      <Controller
        name="currEmis"
        control={control}
        rules={{ required: "Current EMIs is required" }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full p-3">
              <SelectValue placeholder="Select number of EMIs" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, "More than 4"].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.currEmis && (
        <p className="text-red-500 text-sm">{errors.currEmis.message}</p>
      )}
    </div>
    <div className="grid w-full items-center gap-3">
      <Label htmlFor="totalActiveLoans" className="text-base font-semibold">
        Total Active Ongoing Loans
      </Label>
      <Controller
        name="totalActiveLoans"
        control={control}
        rules={{ required: "Total Active Loans is required" }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full p-3">
              <SelectValue placeholder="Select Total Active Loans" />
            </SelectTrigger>
            <SelectContent>
              {totalActiveLoansRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.totalActiveLoans && (
        <p className="text-red-500 text-sm">
          {errors.totalActiveLoans.message}
        </p>
      )}
      <div className="flex items-center space-x-2">
        <Controller
          name="termsConfirmation"
          control={control}
          rules={{ required: "You must agree to the terms" }}
          render={({ field }) => (
            <Checkbox
              id="termsConfirmation"
              checked={field.value || false}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label
          htmlFor="termsConfirmation"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I confirm that all the provided details are correct, and if found to
          be incorrect, my loan offer may be canceled.
        </label>
      </div>
      {errors.termsConfirmation && (
        <p className="text-red-500 text-sm">
          {errors.termsConfirmation.message}
        </p>
      )}
    </div>
  </div>
);

const Step6Review: React.FC<StepProps> = ({
  getValues,
  register,
  errors,
  watch,
}) => {
  // Make sure we always call watch even if we don't use it
  const watchedValues = watch ? watch() : {};

  // Safely get values
  const formValues: FormValues = getValues ? getValues() : ({} as FormValues);

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 sm:p-6 rounded-lg shadow-inner">
        <h3 className="font-bold text-xl mb-4 text-blue-950">
          Review Your Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-2 bg-white bg-opacity-50 rounded">
            <p className="break-words">
              <span className="font-semibold text-blue-950 block sm:inline">
                Full Name:
              </span>{" "}
              <span className="text-blue-800">{formValues.fullName}</span>
            </p>
          </div>
          <div className="p-2 bg-white bg-opacity-50 rounded">
            <p className="break-words">
              <span className="font-semibold text-blue-950 block sm:inline">
                Email:
              </span>{" "}
              <span className="text-blue-800">{formValues.email}</span>
            </p>
          </div>
          <div className="p-2 bg-white bg-opacity-50 rounded">
            <p className="break-words">
              <span className="font-semibold text-blue-950 block sm:inline">
                Phone Number:
              </span>{" "}
              <span className="text-blue-800">{formValues.phoneNo}</span>
            </p>
          </div>
          <div className="p-2 bg-white bg-opacity-50 rounded">
            <p className="break-words">
              <span className="font-semibold text-blue-950 block sm:inline">
                Amount Required:
              </span>{" "}
              <span className="text-blue-800">₹{formValues.amtRequired}</span>
            </p>
          </div>
          <div className="p-2 bg-white bg-opacity-50 rounded">
            <p className="break-words">
              <span className="font-semibold text-blue-950 block sm:inline">
                Purpose of Loan:
              </span>{" "}
              <span className="text-blue-800">{formValues.prpseOfLoan}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LaStepOneProps {
  user?: any;
}

const LaStepOne: React.FC<LaStepOneProps> = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingLoan, setHasExistingLoan] = useState(false);
  const [panVerificationError, setPanVerificationError] = useState<string>("");
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingApplicationData, setExistingApplicationData] =
    useState<LoanApplication | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [isAgeInvalid, setIsAgeInvalid] = useState(false);
  const [isRejectedForCreditScore, setIsRejectedForCreditScore] =
    useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [showMembershipCard, setShowMembershipCard] = useState(false);
  const [showExistingApplicationUI, setShowExistingApplicationUI] =
    useState(false);
  const [showRejectionUI, setShowRejectionUI] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      prpseOfLoan: "Personal Use", // Add this default value
    },
  });

  const { dateOfBirth, creditScore, currEmis, totalActiveLoans, monIncome } =
    watch();

  const verifyPanCard = async (panNo: string) => {
    try {
      const response = await fetch("/api/check-existing-loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ panNo }),
      });

      const result = await response.json();

      if (result.hasExistingApplication) {
        setHasExistingLoan(true);
        setPanVerificationError(
          "A loan application already exists with this PAN card number. You cannot apply for another loan until your current application is completed or rejected."
        );
        return false;
      }

      setHasExistingLoan(false);
      setPanVerificationError("");
      return true;
    } catch (error) {
      console.error("Error verifying PAN card:", error);
      setPanVerificationError("Error verifying PAN card. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    const checkExistingApplication = async () => {
      const result = await checkExistingLoanApplication();
      if (result.success) {
        setHasExistingApplication(result.hasExistingApplication);
        setExistingApplicationData(result.applicationData);

        console.log("Application status:", result.applicationData?.status);

        // Show membership card only for "In Progress" applications
        // "Eligible" users should see the normal form to continue their application
        if (
          result.hasExistingApplication &&
          result.applicationData &&
          result.applicationData.status === "In Progress"
        ) {
          setShowMembershipCard(true);
          setShowExistingApplicationUI(false);
        } else if (
          result.hasExistingApplication &&
          result.applicationData &&
          result.applicationData.status === "Approved"
        ) {
          // For approved applications, redirect to dashboard or show appropriate message
          setShowExistingApplicationUI(true);
          setShowMembershipCard(false);
        } else {
          // For "Eligible" status or no existing application, show the normal form
          setShowMembershipCard(false);
          setShowExistingApplicationUI(false);
        }
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

    if (user) {
      setValue("email", user.emailAddresses[0]?.emailAddress || "");
      setValue("phoneNo", user.phoneNumbers[0]?.phoneNumber || "");
    }
  }, [toast, user, setValue]);

  useEffect(() => {
    if (dateOfBirth) {
      const calculatedAge = calculateAge(dateOfBirth);
      setAge(calculatedAge);
      setValue("age", calculatedAge);

      // Set age invalid flag instead of rejecting the entire form
      setIsAgeInvalid(calculatedAge < 18);

      if (calculatedAge < 18) {
        setRejectionReason("Applicant must be at least 18 years old");
      } else {
        setRejectionReason(null);
      }
    }
  }, [dateOfBirth, setValue]);

  useEffect(() => {
    if (age !== null && monIncome) {
      getEligibleLoanAmount(age, Number(monIncome)).then((amount) => {
        setValue("eligibleLoanAmount", amount);
      });
    }
  }, [age, monIncome, setValue]);

  // Load saved form data when component mounts
  useEffect(() => {
    const savedData = getFormDataFromLocalStorage();
    if (savedData) {
      // Populate form with saved data
      Object.entries(savedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as any, value);
        }
      });

      // If date of birth was saved, recalculate age
      if (savedData.dateOfBirth) {
        const calculatedAge = calculateAge(savedData.dateOfBirth);
        setAge(calculatedAge);
        setValue("age", calculatedAge);
        setIsAgeInvalid(calculatedAge < 18);
      }

      toast({
        title: "Form Data Restored",
        description: "Your previously entered information has been restored.",
      });
    }
  }, [setValue, toast]);

  // Save form data whenever it changes
  useEffect(() => {
    const subscription = watch((formData) => {
      if (formData && Object.keys(formData).length > 0) {
        // Don't save file inputs to localStorage
        const dataToSave = { ...formData };
        ["aadharImgFront", "aadharImgBack", "panImgFront", "selfieImg"].forEach(
          (key) => {
            if (dataToSave[key as keyof FormValues] instanceof FileList) {
              delete dataToSave[key as keyof FormValues];
            }
          }
        );
        saveFormDataToLocalStorage(dataToSave);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const checkEligibility = (data: FormValues) => {
    const creditScoreValue = Number.parseInt(data.creditScore.split("-")[0]);
    const activeEmis =
      data.currEmis === "More than 4" ? 5 : Number.parseInt(data.currEmis);
    const activeLoans = Number.parseInt(data.totalActiveLoans.split("-")[0]);

    if (creditScoreValue < 600) {
      setRejectionReason("Low credit score");
      return false;
    }
    if (activeLoans >= 1) {
      setRejectionReason("Active overdues");
      return false;
    }
    if (activeEmis > 10) {
      setRejectionReason("Too many active EMIs");
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    const fields = {
      1: ["fullName", "email", "phoneNo", "dateOfBirth"],
      2: ["empType", "monIncomeRange", "monIncome", "creditScore"],
      3: ["amtRequired", "prpseOfLoan"],
      4: [
        "aadharImgFront",
        "aadharImgBack",
        "aadharNo",
        "panNo",
        "panImgFront",
        "selfieImg",
      ],
      5: ["currEmis", "totalActiveLoans", "termsConfirmation"],
    }[currentStep];

    const isValid = await trigger(fields as any);

    if (isValid) {
      // Check if age is invalid and prevent moving to next step
      if (currentStep === 1 && isAgeInvalid) {
        toast({
          title: "Age Requirement Not Met",
          description:
            "Please correct your date of birth. You must be at least 18 years old to apply for a loan.",
          variant: "destructive",
        });
        return;
      }

      if (currentStep === 4) {
        const panNo = watch("panNo");
        if (panNo) {
          const isPanValid = await verifyPanCard(panNo);
          if (!isPanValid) {
            return; // Don't proceed if PAN verification fails
          }
        }
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormValues) => {
    // Check if age is invalid before submitting
    if (isAgeInvalid) {
      toast({
        title: "Age Requirement Not Met",
        description: "You must be at least 18 years old to apply for a loan.",
        variant: "destructive",
      });
      return;
    }

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

    const isPanValid = await verifyPanCard(data.panNo);
    if (!isPanValid) {
      return;
    }

    // Show confirmation dialog
    if (
      !window.confirm("Are you sure you want to submit your loan application?")
    ) {
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (typeof value === "string") {
        formData.append(key, value);
      } else if (key === "termsConfirmation") {
        formData.append(key, value ? "true" : "false");
      } else if (key === "eligibleLoanAmount") {
        formData.append(key, value.toString());
      } else if (key === "age") {
        formData.append(key, value.toString());
      }
    });

    formData.set("panNo", data.panNo.toUpperCase());
    formData.append("monIncome", data.monIncome);
    formData.append("age", age !== null ? age.toString() : "");
    formData.append("totalActiveLoans", data.totalActiveLoans);

    if (!checkEligibility(data)) {
      setIsRejectedForCreditScore(true);
      setShowRejectionUI(true);
      formData.append("rejectionReason", rejectionReason || "");
      try {
        const result = await saveRejectedApplication(formData);
        if (!result.success) {
          throw new Error(
            result.error || "Failed to save rejected application"
          );
        }
      } catch (error) {
        console.error("Error saving rejected application:", error);
        toast({
          title: "Error",
          description: "Failed to save your application. Please try again.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitLoanApplicationStep1(formData);

      if (result.success) {
        // Clear saved form data after successful submission
        clearFormDataFromLocalStorage();

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
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Render different UIs based on flags instead of early returns
  const renderContent = () => {
    // Show membership card for "In Progress" applications
    if (showMembershipCard && existingApplicationData) {
      return (
        <MembershipCard
          applicationData={existingApplicationData}
          onClose={() => setShowMembershipCard(false)}
        />
      );
    }

    // Show existing application details for "Approved" applications
    if (showExistingApplicationUI && existingApplicationData) {
      return (
        <div className="mx-auto w-full max-w-[520px]">
          <h2 className="text-2xl font-bold mb-4">Existing Loan Application</h2>
          <p className="mb-4">
            You already have a loan application that has been processed.
          </p>
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Application Details:</h3>
            <p>Status: {existingApplicationData.status || "In Progress"}</p>
            <p>Amount Required: ₹{existingApplicationData.amtRequired}</p>
            <p>Purpose: {existingApplicationData.prpseOfLoan}</p>
            <p>
              Submitted on:{" "}
              {new Date(existingApplicationData.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      );
    }

    if (showRejectionUI) {
      return <RejectionMessage reason={rejectionReason || ""} />;
    }

    return (
      <div className="mx-auto w-full max-w-4xl p-6 space-y-8">
        <Card className="border-2 border-orange-500 shadow-lg overflow-y-8">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white p-6">
            <CardTitle className="text-3xl font-bold text-center">
              Loan Application
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Progress indicator */}
            <div className="mb-8">
              <Progress
                value={(currentStep / steps.length) * 100}
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
                  ${currentStep > index + 1 ? "bg-orange-500 text-white" : "bg-orange-100 text-blue-950"}
                  ${currentStep === index + 1 ? "ring-2 sm:ring-4 ring-orange-500 ring-offset-2" : ""}`}
                    >
                      {currentStep > index + 1 ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1 sm:mt-2 text-center whitespace-nowrap
                  ${currentStep === index + 1 ? "font-semibold text-blue-950" : "text-gray-500"}`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <Step1Personal
                  control={control}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  user={user}
                  age={age}
                  isAgeInvalid={isAgeInvalid}
                  watch={watch}
                />
              )}

              {currentStep === 2 && (
                <Step2EmploymentIncome
                  control={control}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  isAgeInvalid={isAgeInvalid}
                  watch={watch}
                />
              )}

              {currentStep === 3 && (
                <Step3LoanDetails
                  control={control}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  isAgeInvalid={isAgeInvalid}
                  watch={watch}
                />
              )}

              {currentStep === 4 && (
                <Step4Documents
                  control={control}
                  register={register}
                  errors={errors}
                  isAgeInvalid={isAgeInvalid}
                  setValue={setValue}
                  watch={watch}
                />
              )}

              {currentStep === 5 && (
                <Step5Financial
                  control={control}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  isAgeInvalid={isAgeInvalid}
                  watch={watch}
                />
              )}

              {currentStep === 6 && (
                <Step6Review
                  getValues={getValues}
                  control={control}
                  setValue={setValue}
                  register={register}
                  errors={errors}
                  isAgeInvalid={isAgeInvalid}
                  watch={watch}
                />
              )}

              <div className="flex justify-between mt-8  sm:flex-row sm:gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    className="border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
                  >
                    Previous
                  </Button>
                )}
                {currentStep < 6 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep === 1 && isAgeInvalid}
                    className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || isAgeInvalid || hasExistingLoan}
                    className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>

              {panVerificationError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{panVerificationError}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
        <DevTool control={control} />
      </div>
    );
  };

  // Set default purpose value when component mounts
  useEffect(() => {
    setValue("prpseOfLoan", "Personal Use");
    console.log("Setting default purpose to Personal Use");
  }, [setValue]);

  return renderContent();
};

export default LaStepOne;
