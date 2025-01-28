"use client";

import { Button } from "@/components/ui/button";
import type { CreditBuilderLoanApplication } from "./columns";

interface DownloadCSVProps {
  data: CreditBuilderLoanApplication;
}

export function DownloadCSV({ data }: DownloadCSVProps) {
  const handleDownload = () => {
    const headers = [
      "ID",
      "User ID",
      "Full Name",
      "Mobile Number",
      "Loan Amount Required",
      "Eligible Amount",
      "Status",
      "Created At",
      "Updated At",
      "EMI Tenure",
    ];

    const rowData = [
      data.id,
      data.userId,
      data.fullName,
      data.mobileNumber,
      data.loanAmountRequired,
      data.eligibleAmount || "",
      data.status,
      new Date(data.createdAt).toISOString(),
      new Date(data.updatedAt).toISOString(),
      data.emiTenure || "",
    ];

    const csvContent = [headers.join(","), rowData.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "credit_builder_loan_application.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      className="bg-green-500 hover:bg-green-600 text-white"
    >
      Download CSV
    </Button>
  );
}
