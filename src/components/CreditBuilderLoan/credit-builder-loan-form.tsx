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

const CreditBuilderLoanForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const { register, control, handleSubmit, watch, setValue, reset, trigger } =
    useForm<FormData>({
      defaultValues: formData,
    });

  const employmentType = watch("employmentType");

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
      const currentFormData = watch();
      setFormData((prevData) => ({ ...prevData, ...currentFormData }));
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
    const currentFormData = watch();
    setFormData((prevData) => ({ ...prevData, ...currentFormData }));
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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
            <CardContent className="space-y-4">
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
                    <Checkbox
                      id="hasSalarySlip"
                      {...register("hasSalarySlip")}
                    />
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
                  <Label htmlFor="EmpOthers">
                    Specify Other Employment Type
                  </Label>
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
                <Label htmlFor="currentActiveOverdues">
                  Total Active Loans
                </Label>
                <Input
                  id="currentActiveOverdues"
                  type="number"
                  {...register("currentActiveOverdues", { required: true })}
                />
              </div>
              <div className="space-y-4">
                <Label
                  htmlFor="bankStatement"
                  className="text-lg font-semibold"
                >
                  Upload Bank Statement
                </Label>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 bg-orange-50">
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
                    appearance={{
                      button:
                        "bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200",
                      allowedContent: "text-gray-600 text-sm",
                    }}
                  />
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Upload your bank statement in PDF format (Max size: 10MB)
                  </p>
                  {watch("bankStatement") && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md flex items-center justify-between">
                      <span className="text-green-700 font-medium">
                        Bank statement uploaded successfully
                      </span>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
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
            <div className="flex justify-between mt-4">
              {[
                "Basic Info",
                "Loan Details",
                "Personal Details",
                "Employment",
                "Financial",
              ].map((step, index) => (
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {renderStep()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-orange-500 hover:bg-orange-600 text-white ml-auto"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white ml-auto"
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
