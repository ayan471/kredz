"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditableLoanApplication, LoanApplication } from "@/types";
import { updateLoanApplication } from "@/actions/loanApplicationActions";

export default function EditLoanApplicationForm({
  application,
}: {
  application: LoanApplication;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<EditableLoanApplication>(() => {
    const { id, userId, createdAt, updatedAt, ...editableFields } = application;
    return editableFields;
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateLoanApplication(application.id, formData);
      if (result.success) {
        router.push(`/admin/loans/${application.id}`);
        router.refresh();
      } else {
        console.error("Failed to update loan application:", result.error);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show error message to user)
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
          <Label htmlFor="phoneNo">Phone Number</Label>
          <Input
            id="phoneNo"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amtRequired">Amount Required</Label>
          <Input
            id="amtRequired"
            name="amtRequired"
            value={formData.amtRequired}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prpseOfLoan">Purpose of Loan</Label>
          <Input
            id="prpseOfLoan"
            name="prpseOfLoan"
            value={formData.prpseOfLoan}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aadharNo">Aadhar Number</Label>
          <Input
            id="aadharNo"
            name="aadharNo"
            value={formData.aadharNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="panNo">PAN Number</Label>
          <Input
            id="panNo"
            name="panNo"
            value={formData.panNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="creditScore">Credit Score</Label>
          <Input
            id="creditScore"
            name="creditScore"
            value={formData.creditScore}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empType">Employment Type</Label>
          <Select
            name="empType"
            value={formData.empType}
            onValueChange={(value) => handleSelectChange("empType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Salaried">Salaried</SelectItem>
              <SelectItem value="Self-Employed">Self-Employed</SelectItem>
              <SelectItem value="Business Owner">Business Owner</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.empType === "Others" && (
          <div className="space-y-2">
            <Label htmlFor="EmpOthers">Other Employment Type</Label>
            <Input
              id="EmpOthers"
              name="EmpOthers"
              value={formData.EmpOthers || ""}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="monIncome">Monthly Income</Label>
          <Input
            id="monIncome"
            name="monIncome"
            value={formData.monIncome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currEmis">Current EMIs</Label>
          <Input
            id="currEmis"
            name="currEmis"
            value={formData.currEmis || ""}
            onChange={handleChange}
          />
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
