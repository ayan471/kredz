"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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

type FormValues = {
  fullName: string;
  phoneNo: string;
  amtRequired: string;
  prpseOfLoan: string;
  aadharImgFront: FileList;
  aadharImgBack: FileList;
  aadharNo: string;
  panImgFront: FileList;
  panImgBack: FileList;
  panNo: string;
  creditScore: string;
  empType: string;
  EmpOthers: string;
  monIncomeRange: string;
  monIncome: string;
  currEmis: string;
  selfieImg: FileList;
  bankStatmntImg: FileList;
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
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, setValue, watch } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingApplicationData, setExistingApplicationData] =
    useState<LoanApplication | null>(null);

  const monIncomeRange = watch("monIncomeRange");
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
        router.push(`/loan-application/eligible?id=${result.id}`);
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
        <p className="font-bold">
          Step 1:<span className="text-red-600">*</span>
        </p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              {...register("fullName")}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phoneNo">Phone No</Label>
            <Input type="tel" id="phoneNo" {...register("phoneNo")} required />
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="amtRequired">Loan Amount Required(in ₹)</Label>
            <Input
              type="text"
              id="amtRequired"
              {...register("amtRequired")}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="prpseOfLoan">Purpose of Loan</Label>
            <Input
              type="text"
              id="prpseOfLoan"
              {...register("prpseOfLoan")}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="aadharImgFront">Aadhar Card Front Upload</Label>
            <Input
              id="aadharImgFront"
              type="file"
              {...register("aadharImgFront")}
              className="w-full"
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="aadharImgBack">Aadhar Card Back Upload</Label>
            <Input
              id="aadharImgBack"
              type="file"
              {...register("aadharImgBack")}
              className="w-full"
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="aadharNo">Aadhar Number</Label>
            <Input
              type="text"
              id="aadharNo"
              {...register("aadharNo")}
              required
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="panImgFront">PAN Card Front Upload</Label>
            <Input id="panImgFront" type="file" {...register("panImgFront")} />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="panImgBack">PAN Card Back Upload</Label>
            <Input id="panImgBack" type="file" {...register("panImgBack")} />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="panNo">PAN Number</Label>
            <Input type="text" id="panNo" {...register("panNo")} required />
          </div>
        </div>

        <p className="font-bold">
          Step 2: <span className="text-red-600">*</span>
        </p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="creditScore">Credit Score</Label>
            <Input
              type="text"
              id="creditScore"
              {...register("creditScore")}
              required
            />
          </div>

          <div className="grid w-full items-center gap-4">
            <Label htmlFor="empType">Employment Type</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Salaried"
                  id="r1"
                  {...register("empType")}
                />
                <Label htmlFor="r1">Salaried</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Self Employed"
                  id="r2"
                  {...register("empType")}
                />
                <Label htmlFor="r2">Self Employed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Others"
                  id="r3"
                  {...register("empType")}
                />
                <Label htmlFor="r3">Others(mention below)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="EmpOthers">Employment Type(if Others)</Label>
            <Input type="text" id="EmpOthers" {...register("EmpOthers")} />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="monIncomeRange">Monthly Income Range</Label>
            <Select
              onValueChange={(value) => setValue("monIncomeRange", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                {incomeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="monIncome">Monthly Income(in ₹)</Label>
            <Input
              type="text"
              id="monIncome"
              {...register("monIncome")}
              required
            />
          </div>
        </div>

        <p className="font-bold">
          Step 3: <span className="text-red-600">*</span>
        </p>
        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="currEmis">Current EMIs</Label>
            <Select onValueChange={(value) => setValue("currEmis", value)}>
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
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="selfieImg">Upload a selfie</Label>
            <Input id="selfieImg" type="file" {...register("selfieImg")} />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="bankStatmntImg">Upload bank statement</Label>
            <Input
              id="bankStatmntImg"
              type="file"
              {...register("bankStatmntImg")}
            />
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
