"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

export function DownloadCSV({ data }: { data: any }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    try {
      // Convert object to CSV
      const headers = Object.keys(data).join(",");
      const values = Object.values(data)
        .map((value) => {
          if (value instanceof Date) {
            return `"${value.toISOString()}"`;
          } else if (typeof value === "string") {
            return `"${value}"`;
          } else {
            return value;
          }
        })
        .join(",");

      const csvContent = `${headers}\n${values}`;

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `credit-builder-application-${data.id}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isDownloading ? "Downloading..." : "Download CSV"}
    </Button>
  );
}
