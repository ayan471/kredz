"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import {
  submitLoanApplicationStep1,
  checkExistingLoanApplication,
} from "@/actions/loanApplicationActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { LoanApplication } from "@/types";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import "@uploadthing/react/styles.css";

type FormValues = {
  fullName: string;
  phoneNo: string;
  amtRequired: string;
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
  bankStatmntImg: string; // Changed to string to store URL
};

const incomeRanges = [
  { label: "0-10,000", value: "0-10000", eligibleAmount: 37000 },
  { label: "10,001-23,000", value: "10001-23000", eligibleAmount: 53000 },
  { label: "23,001-30,000", value: "23001-30000", eligibleAmount: 67000 },
  { label: "30,001-37,000", value: "30001-37000", eligibleAmount: 83000 },
  { label: "37,001-45,000", value: "37001-45000", eligibleAmount: 108000 },
  { label: "45,001-55,000", value: "45001-55000", eligibleAmount: 131000 },
  { label: "55,001-65,000", value: "55001-65000", eligibleAmount: 178000 },
  { label: "65,001-75,000", value: "65001-75000", eligibleAmount: 216000 },
  { label: "75,001-85,000", value: "75001-85000", eligibleAmount: 256000 },
  { label: "85,001-95,000", value: "85001-95000", eligibleAmount: 308000 },
  { label: "95,001-1,25,000", value: "95001-125000", eligibleAmount: 376000 },
  { label: "More than 1,25,000", value: "125001+", eligibleAmount: 487000 },
];

const LaStepOne = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { register, control, handleSubmit, setValue, watch } =
    useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingApplicationData, setExistingApplicationData] =
    useState<LoanApplication | null>(null);

  const monIncomeRange = watch("monIncomeRange");
  const empType = watch("empType");
  const membershipPlan = "basic"; // Example membership plan

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

  const onSubmit = async (data: FormValues) => {
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

    // Ensure monIncome is included
    formData.append("monIncome", data.monIncome);

    const selectedRange = incomeRanges.find(
      (range) => range.value === data.monIncomeRange
    );
    if (selectedRange) {
      formData.append(
        "eligibleAmount",
        selectedRange.eligibleAmount.toString()
      );
    }

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
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    hasExistingApplication &&
    existingApplicationData &&
    existingApplicationData.status !== "Eligible"
  ) {
    return (
      <div className="mx-auto w-full max-w-[520px]">
        <h2 className="text-2xl font-bold mb-4">Existing Loan Application</h2>
        <p className="mb-4">
          You already have a loan application in progress. You cannot submit a
          new application at this time.
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

  return (
    <div className="mx-auto w-full max-w-[520px]">
      {existingApplicationData?.status === "Eligible" && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">Good news!</p>
          <p>
            You are eligible to apply for a new loan. Please fill out the form
            below.
          </p>
        </div>
      )}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            {...register("fullName")}
            className="w-full"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="phoneNo">Phone Number</Label>
          <Input
            id="phoneNo"
            type="tel"
            {...register("phoneNo")}
            className="w-full"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="amtRequired">Amount Required</Label>
          <Input
            id="amtRequired"
            type="number"
            {...register("amtRequired")}
            className="w-full"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="prpseOfLoan">Purpose of Loan</Label>
          <Input
            id="prpseOfLoan"
            type="text"
            {...register("prpseOfLoan")}
            className="w-full"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="aadharImgFront">Upload Aadhar Card (Front)</Label>
          <Input
            id="aadharImgFront"
            type="file"
            {...register("aadharImgFront")}
            className="w-full"
            accept=".jpg,.jpeg,.png"
          />
          <span className="text-xs text-muted-foreground mt-1">
            Accepted formats: .jpg, .jpeg, .png
          </span>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="aadharImgBack">Upload Aadhar Card (Back)</Label>
          <Input
            id="aadharImgBack"
            type="file"
            {...register("aadharImgBack")}
            className="w-full"
            accept=".jpg,.jpeg,.png"
          />
          <span className="text-xs text-muted-foreground mt-1">
            Accepted formats: .jpg, .jpeg, .png
          </span>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="aadharNo">Aadhar Number</Label>
          <Input
            id="aadharNo"
            type="text"
            {...register("aadharNo")}
            className="w-full"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="panImgFront">Upload PAN Card (Front)</Label>
          <Input
            id="panImgFront"
            type="file"
            {...register("panImgFront")}
            className="w-full"
            accept=".jpg,.jpeg,.png"
          />
          <span className="text-xs text-muted-foreground mt-1">
            Accepted formats: .jpg, .jpeg, .png
          </span>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="panNo">PAN Number</Label>
          <Input
            id="panNo"
            type="text"
            {...register("panNo")}
            className="w-full"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="creditScore">Credit Score</Label>
          <Input
            id="creditScore"
            type="number"
            {...register("creditScore")}
            className="w-full"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="empType">Employment Type</Label>
          <Controller
            name="empType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
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
        </div>
        {empType === "Other" && (
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="EmpOthers">Specify Other</Label>
            <Input
              id="EmpOthers"
              type="text"
              {...register("EmpOthers")}
              className="w-full"
            />
          </div>
        )}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="monIncomeRange">Monthly Income Range</Label>
          <Controller
            name="monIncomeRange"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
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
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="monIncome">Monthly Income</Label>
          <Input
            id="monIncome"
            type="number"
            {...register("monIncome")}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="currEmis">Current EMIs</Label>
            <Controller
              name="currEmis"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
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
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="selfieImg">Upload your selfie</Label>
            <Input
              id="selfieImg"
              type="file"
              {...register("selfieImg")}
              className="w-full"
              accept=".jpg,.jpeg,.png"
            />
            <span className="text-xs text-muted-foreground mt-1">
              Accepted formats: .jpg, .jpeg, .png
            </span>
          </div>
          <Label htmlFor="selfieImg">Upload Your Bank Statement</Label>
          <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-primary rounded-lg bg-primary/5">
            <UploadButton<OurFileRouter>
              endpoint="pdfUploader"
              onClientUploadComplete={(res) => {
                const uploadedFiles = res as {
                  name: string;
                  url: string;
                  size: number;
                }[];
                if (uploadedFiles && uploadedFiles.length > 0) {
                  setValue("bankStatmntImg", uploadedFiles[0].url);
                  toast({
                    title: "Upload Completed",
                    description: "Bank statement uploaded successfully",
                  });
                  console.log("Bank statement URL:", uploadedFiles[0].url);
                }
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: "Upload Error",
                  description: error.message,
                  variant: "destructive",
                });
                console.error("Upload error:", error);
              }}
              onUploadBegin={() => {
                toast({
                  title: "Upload Started",
                  description: "Your bank statement is being uploaded...",
                });
              }}
              appearance={{
                button:
                  "ut-ready:bg-primary ut-ready:hover:bg-primary/90 ut-ready:text-white ut-ready:font-semibold ut-ready:py-3 ut-ready:px-4 ut-ready:rounded-md ut-ready:transition-colors ut-ready:duration-200 ut-ready:text-lg",
                allowedContent:
                  "flex flex-col items-center justify-center gap-2",
              }}
            />
            <p className="text-sm text-muted-foreground mt-2">
              ** Only PDF files are accepted
            </p>
          </div>
        </div>

        <Button type="submit" className="mt-8 text-md" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Check Eligibility"}
        </Button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default LaStepOne;
