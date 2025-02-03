"use client";

import type React from "react";
import { useState, useEffect } from "react";
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

const CreditBuilderLoanForm: React.FC = () => {
  const { register, control, handleSubmit, watch, setValue, reset } =
    useForm<FormData>();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const employmentType = watch("employmentType");

  useEffect(() => {
    const fetchRejectedApplication = async () => {
      if (user?.id) {
        try {
          const result = await getCreditBuilderLoanApplication(user.id);
          if (result.success && result.data) {
            const formData: Partial<FormData> = {
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
              formData.age = calculatedAge;
            }
            reset(formData);
            console.log(
              "Application data fetched and form pre-filled",
              formData
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
  }, [user, reset, toast]);

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

      if (result.success && result.data) {
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
          // Don't throw here, as we want to continue with the application process even if WhatsApp notification fails
        }

        if (eligibilityResult.success) {
          const queryParams = new URLSearchParams({
            eligibleAmount: eligibilityResult.eligibleAmount
              ? eligibilityResult.eligibleAmount.toString()
              : "",
            status: eligibilityResult.message
              ? "Partially Approved"
              : "Approved",
            message: eligibilityResult.message || "",
            applicationId: result.data.id,
            customerName: data.fullName,
            customerPhone: data.mobileNumber,
            customerEmail: data.email,
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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Credit Builder Loan Application
        </h2>
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Basic Information</h3>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                {...register("mobileNumber", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth", {
                  required: true,
                  onChange: (e) =>
                    setValue("age", calculateAge(e.target.value)),
                })}
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                {...register("age", { required: true })}
                readOnly
              />
            </div>
          </div>

          {/* Loan Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Loan Details</h3>
            <div>
              <Label htmlFor="loanAmountRequired">Loan Amount Required</Label>
              <Input
                id="loanAmountRequired"
                type="number"
                {...register("loanAmountRequired", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="purpose">Purpose of Loan</Label>
              <Controller
                name="purpose"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Use">Personal Use</SelectItem>
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
                )}
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Personal Details</h3>
            <div>
              <Label htmlFor="aadharNumber">Aadhaar Number</Label>
              <Input
                id="aadharNumber"
                {...register("aadharNumber", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="aadharFront">Upload Aadhaar Front</Label>
              <Input
                id="aadharFront"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setValue("aadharFront", file);
                }}
              />
            </div>
            <div>
              <Label htmlFor="aadharBack">Upload Aadhaar Back</Label>
              <Input
                id="aadharBack"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setValue("aadharBack", file);
                }}
              />
            </div>
            <div>
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                {...register("panNumber", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="panCard">Upload PAN Card</Label>
              <Input
                id="panCard"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setValue("panCard", file);
                }}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address", { required: true })}
              />
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Employment Details</h3>
            <div>
              <Label htmlFor="employmentType">Employment Type</Label>
              <Controller
                name="employmentType"
                control={control}
                rules={{ required: true }}
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
            </div>
            {employmentType === "Salaried" && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasSalarySlip" {...register("hasSalarySlip")} />
                  <Label htmlFor="hasSalarySlip">
                    Do you have salary slip?
                  </Label>
                </div>
                <div>
                  <Label htmlFor="salaryReceiveMethod">
                    You receive Salary In
                  </Label>
                  <Controller
                    name="salaryReceiveMethod"
                    control={control}
                    rules={{ required: employmentType === "Salaried" }}
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
                <div>
                  <Label htmlFor="businessRegistration">
                    Business registration you have
                  </Label>
                  <Controller
                    name="businessRegistration"
                    control={control}
                    rules={{ required: employmentType === "Self Employed" }}
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
                </div>
              </>
            )}
            {employmentType === "Others" && (
              <div>
                <Label htmlFor="EmpOthers">Specify Other Employment Type</Label>
                <Input id="EmpOthers" {...register("EmpOthers")} />
              </div>
            )}
            <div>
              <Label htmlFor="monthlyIncome">Monthly Income</Label>
              <Input
                id="monthlyIncome"
                type="number"
                {...register("monthlyIncome", { required: true })}
              />
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Financial Details</h3>
            <div>
              <Label htmlFor="creditScore">Credit Score</Label>
              <Input
                id="creditScore"
                type="number"
                {...register("creditScore", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="currentActiveEmis">Current EMIs</Label>
              <Input
                id="currentActiveEmis"
                type="number"
                {...register("currentActiveEmis", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="currentActiveOverdues">Total Active Loans</Label>
              <Input
                id="currentActiveOverdues"
                type="number"
                {...register("currentActiveOverdues", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="bankStatement">Upload Bank Statement</Label>
              <UploadButton<OurFileRouter>
                endpoint="pdfUploader"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  if (res && res.length > 0) {
                    setValue("bankStatement", res[0].url);
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
              />
              {watch("bankStatement") && (
                <p className="mt-2 text-sm text-gray-500">
                  Bank statement uploaded successfully
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreditBuilderLoanForm;
