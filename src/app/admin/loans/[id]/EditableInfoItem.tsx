"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import {
  updateLoanApplication,
  updateLoanApplicationData,
} from "@/actions/loanApplicationActions";
import { EditableLoanApplication, LoanApplicationData } from "@/types";

interface EditableInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  field: string;
  loanId: string;
  modelType: "LoanApplication" | "LoanApplicationData";
}

export function EditableInfoItem({
  icon,
  label,
  value,
  field,
  loanId,
  modelType,
}: EditableInfoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = async () => {
    try {
      if (modelType === "LoanApplication") {
        await updateLoanApplication(loanId, {
          [field]: editedValue,
        } as Partial<EditableLoanApplication>);
      } else {
        await updateLoanApplicationData(loanId, {
          [field]: editedValue,
        } as Partial<LoanApplicationData>);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update field:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {icon}
      <div className="flex-grow">
        <p className="text-sm text-gray-500">{label}</p>
        {isEditing ? (
          <Input
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onBlur={handleSave}
            className="mt-1"
          />
        ) : (
          <p className="font-medium">{value || "N/A"}</p>
        )}
      </div>
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="text-gray-400 hover:text-gray-600"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}
