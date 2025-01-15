import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useToast } from "@/components/ui/use-toast";
import "@uploadthing/react/styles.css";
import { motion } from "framer-motion";

export const DocumentUploadStep = () => {
  const { register, setValue } = useFormContext();
  const { toast } = useToast();

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <h2 className="text-2xl font-semibold mb-6">Document Upload</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="aadharImgFront">Aadhar Card (Front)</Label>
          <Input
            id="aadharImgFront"
            type="file"
            {...register("aadharImgFront")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            accept=".jpg,.jpeg,.png"
          />
          <span className="text-xs text-muted-foreground">
            Accepted formats: .jpg, .jpeg, .png
          </span>
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="aadharImgBack">Aadhar Card (Back)</Label>
          <Input
            id="aadharImgBack"
            type="file"
            {...register("aadharImgBack")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            accept=".jpg,.jpeg,.png"
          />
          <span className="text-xs text-muted-foreground">
            Accepted formats: .jpg, .jpeg, .png
          </span>
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="panImgFront">PAN Card (Front)</Label>
          <Input
            id="panImgFront"
            type="file"
            {...register("panImgFront")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            accept=".jpg,.jpeg,.png"
          />
          <span className="text-xs text-muted-foreground">
            Accepted formats: .jpg, .jpeg, .png
          </span>
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="selfieImg">Selfie</Label>
          <Input
            id="selfieImg"
            type="file"
            {...register("selfieImg")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            accept=".jpg,.jpeg,.png"
          />
          <span className="text-xs text-muted-foreground">
            Accepted formats: .jpg, .jpeg, .png
          </span>
        </motion.div>
      </div>
      <motion.div className="space-y-2" variants={inputVariants}>
        <Label htmlFor="bankStatmntImg">Upload Your Bank Statement</Label>
        <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-primary rounded-lg bg-primary/5">
          <UploadButton<OurFileRouter>
            endpoint="pdfUploader"
            onClientUploadComplete={(res) => {
              const uploadedFiles = res as {
                name: string;
                url: string;
                size: number;
              }[];
              if (uploadedFiles && uploadedFiles.length > 0) {
                setValue("bankStatmntImg", uploadedFiles[0].url);
                toast({
                  title: "Upload Completed",
                  description: "Bank statement uploaded successfully",
                });
                console.log("Bank statement URL:", uploadedFiles[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Upload Error",
                description: error.message,
                variant: "destructive",
              });
              console.error("Upload error:", error);
            }}
            onUploadBegin={() => {
              toast({
                title: "Upload Started",
                description: "Your bank statement is being uploaded...",
              });
            }}
            appearance={{
              button:
                "ut-ready:bg-primary ut-ready:hover:bg-primary/90 ut-ready:text-white ut-ready:font-semibold ut-ready:py-3 ut-ready:px-4 ut-ready:rounded-md ut-ready:transition-colors ut-ready:duration-200 ut-ready:text-lg",
              allowedContent: "flex flex-col items-center justify-center gap-2",
            }}
          />
          <p className="text-sm text-muted-foreground mt-2">
            ** Only PDF files are accepted
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
