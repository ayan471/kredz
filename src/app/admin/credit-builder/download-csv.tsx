"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CreditBuilderSubscription } from "@prisma/client";

export function DownloadCSV({ data }: { data: CreditBuilderSubscription[] }) {
  const handleDownload = () => {
    const headers = ["Full Name", "Phone Number", "Plan", "Subscription Date"];
    const csvContent = [
      headers.join(","),
      ...data.map((item) =>
        [
          item.fullName,
          item.phoneNo,
          item.plan,
          new Date(item.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "credit_builder_subscriptions.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Button onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" /> Download CSV
    </Button>
  );
}
