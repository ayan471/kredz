"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreditBuilderLoanApplication } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { updateCreditBuilderLoanApplicationData } from "@/actions/creditBuilderLoanActions";

type EditableFields = {
  fullName: string;
  mobileNumber: string;
  email: string;
  loanAmountRequired: number;
  purpose: string;
  employmentType: string;
  monthlyIncome: number;
  currentActiveEmis: number;
  accountNumber: string | null;
  bankName: string | null;
  ifscCode: string | null;
  status: string;
};

export function CreditBuilderLoanEditForm({
  application,
}: {
  application: CreditBuilderLoanApplication;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<EditableFields>({
    fullName: application.fullName,
    mobileNumber: application.mobileNumber,
    email: application.email ?? "",
    loanAmountRequired: application.loanAmountRequired,
    purpose: application.purpose,
    employmentType: application.employmentType,
    monthlyIncome: application.monthlyIncome,
    currentActiveEmis: application.currentActiveEmis,
    accountNumber: application.accountNumber ?? "",
    bankName: application.bankName ?? "",
    ifscCode: application.ifscCode ?? "",
    status: application.status,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedApplication = await updateCreditBuilderLoanApplicationData(
        application.id,
        formData
      );
      toast({
        title: "Application Updated",
        description: "The loan application has been successfully updated.",
      });
      router.push(`/admin/credit-builder-loan/${application.id}`);
    } catch (error) {
      console.error("Failed to update application:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the loan application.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loanAmountRequired">Loan Amount Required</Label>
          <Input
            id="loanAmountRequired"
            name="loanAmountRequired"
            type="number"
            value={formData.loanAmountRequired}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose of Loan</Label>
          <Textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type</Label>
          <Select
            name="employmentType"
            value={formData.employmentType}
            onValueChange={(value) =>
              handleSelectChange("employmentType", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Self-employed">Self-employed</SelectItem>
              <SelectItem value="Unemployed">Unemployed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income</Label>
          <Input
            id="monthlyIncome"
            name="monthlyIncome"
            type="number"
            value={formData.monthlyIncome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentActiveEmis">Current Active EMIs</Label>
          <Input
            id="currentActiveEmis"
            name="currentActiveEmis"
            type="number"
            value={formData.currentActiveEmis}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber ?? ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            name="bankName"
            value={formData.bankName ?? ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ifscCode">IFSC Code</Label>
          <Input
            id="ifscCode"
            name="ifscCode"
            value={formData.ifscCode ?? ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
