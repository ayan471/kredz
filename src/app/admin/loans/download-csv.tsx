"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { LoanApplication } from "./columns";
export function DownloadCSV({ data }: { data: LoanApplication[] }) {
  const downloadCSV = () => {
    const headers = [
      "ID",
      "User ID",
      "Full Name",
      "Email Address",
      "Phone Number",
      "Amount Required",
      "Status",
      "Created At",
    ];
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.id,
          row.userId,
          row.fullName,
          row.email,
          row.phoneNo,
          row.amtRequired,
          row.status,
          row.createdAt.toISOString(),
        ].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "loan_applications.csv");
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
