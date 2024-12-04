import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ImageWithDownloadProps {
  src: string;
  alt: string;
  title: string;
}

export function ImageWithDownload({ src, alt, title }: ImageWithDownloadProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${title.replace(" ", "_")}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={300}
          height={200}
          className="rounded-lg object-cover"
        />
        <Button
          onClick={handleDownload}
          className="absolute bottom-2 right-2"
          size="sm"
          variant="secondary"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
