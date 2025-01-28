"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PDFDownloadButtonProps {
  url: string;
  filename: string;
  isPDF: boolean;
}

export function PDFDownloadButton({
  url,
  filename,
  isPDF,
}: PDFDownloadButtonProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="flex-1"
    >
      <Download className="mr-2 h-4 w-4" />
      {isPDF ? "Download PDF" : "Download Image"}
    </Button>
  );
}
