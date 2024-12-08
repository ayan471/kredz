"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type LoanApplication = {
  id: string;
  userId: string;
  fullName: string;
  phoneNo: string;
  amtRequired: string;
  prpseOfLoan: string;
  aadharNo: string;
  panNo: string;
  creditScore: string;
  empType: string;
  monIncome: string;
  currEmis: string | null;
  status: string | null; // Change this line to allow null
  createdAt: Date;
  eligibility?: {
    emailID: string;
    emiTenure: string;
  } | null;
};

export function DownloadCSV({ data }: { data: LoanApplication }) {
  const downloadCSV = () => {
    const headers = [
      "ID",
      "User ID",
      "Full Name",
      "Phone Number",
      "Amount Required",
      "Purpose of Loan",
      "Aadhar Number",
      "PAN Number",
      "Credit Score",
      "Employment Type",
      "Monthly Income",
      "Current EMIs",
      "Status",
      "Application Date",
      "Email ID",
      "EMI Tenure",
    ];

    const csvContent = [
      headers.join(","),
      [
        data.id,
        data.userId,
        data.fullName,
        data.phoneNo,
        data.amtRequired,
        data.prpseOfLoan,
        data.aadharNo,
        data.panNo,
        data.creditScore,
        data.empType,
        data.monIncome,
        data.currEmis || "N/A",
        data.status || "N/A", // Updated line to handle null status
        data.createdAt.toISOString(),
        data.eligibility?.emailID || "N/A",
        data.eligibility?.emiTenure || "N/A",
      ].join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `loan_application_${data.id}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Button onClick={downloadCSV}>
      <Download className="mr-2 h-4 w-4" />
      Download CSV
    </Button>
  );
}
