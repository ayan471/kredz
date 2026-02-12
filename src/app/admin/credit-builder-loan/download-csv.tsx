"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CreditBuilderLoanApplication } from "./columns";
interface DownloadCSVProps {
  data: CreditBuilderLoanApplication[];
}
export function DownloadCSV({ data }: DownloadCSVProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const headers = [
        "ID",
        "User ID",
        "Full Name",
        "Email Address",
        "Mobile Number",
        "Loan Amount Required",
        "Eligible Amount",
        "Status",
        "Created At",
        "Updated At",
        "EMI Tenure",
      ];
      const csvRows = data.map((application) => [
        application.id,
        application.userId,
        application.fullName,
        application.email,
        application.mobileNumber,
        application.loanAmountRequired,
        application.eligibleAmount || "",
        application.status,
        new Date(application.createdAt).toISOString(),
        new Date(application.updatedAt).toISOString(),
        application.emiTenure || "",
      ]);
      const csvContent = [
        headers.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "credit_builder_loan_applications.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error generating CSV:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center"
    >
      {isLoading ? (
        "Generating CSV..."
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </>
      )}
    </Button>
  );
}
