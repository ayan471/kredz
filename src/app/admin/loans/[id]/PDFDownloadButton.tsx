"use client";

import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="flex-1"
      disabled={isLoading}
    >
      <a onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        {isLoading
          ? "Downloading..."
          : isPDF
            ? "Download PDF"
            : "Download Image"}
      </a>
    </Button>
  );
}
