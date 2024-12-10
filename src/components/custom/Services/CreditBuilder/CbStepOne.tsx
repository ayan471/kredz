"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { saveCreditBuilderData } from "@/actions/formActions";

type FormValues = {
  fullName: string;
  phoneNo: string;
  aadharImgFront: FileList;
  aadharImgBack: FileList;
  aadharNo: string;
  panImgFront: FileList;
  panImgBack: FileList;
  panNo: string;
  creditScore: string;
  currEmis: string;
};

interface CbStepOneProps {
  onComplete: () => void;
}

const CbStepOne: React.FC<CbStepOneProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, setValue } = form;
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit an application.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Create FormData object
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("phoneNo", data.phoneNo);
    formData.append("aadharImgFront", data.aadharImgFront[0]);
    formData.append("aadharImgBack", data.aadharImgBack[0]);
    formData.append("aadharNo", data.aadharNo);
    formData.append("panImgFront", data.panImgFront[0]);
    formData.append("panImgBack", data.panImgBack[0]);
    formData.append("panNo", data.panNo);
    formData.append("creditScore", data.creditScore);
    formData.append("currEmis", data.currEmis);

    try {
      const result = await saveCreditBuilderData(formData);
      if (result.success) {
        toast({
          title: "Data Saved!",
          description: "Your credit builder application data has been saved.",
        });
        router.push("/credit-builder/subscription");
      } else {
        throw new Error(result.error || "Failed to save data");
      }
    } catch (error) {
      console.error("Error submitting credit builder data:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error saving your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <p className="font-bold">
          Step 1:<span className="text-red-600">*</span>
        </p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input type="text" id="fullName" {...register("fullName")} />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phoneNo">Phone No</Label>
            <Input type="tel" id="phoneNo" {...register("phoneNo")} />
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          {/* <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="aadharImgFront">Aadhar Card Front Upload</Label>
            <Input
              id="aadharImgFront"
              type="file"
              {...register("aadharImgFront")}
              className="w-full"
            />
          </div> */}

          {/* <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="aadharImgBack">Aadhar Card Back Upload</Label>
            <Input
              id="aadharImgBack"
              type="file"
              {...register("aadharImgBack")}
              className="w-full"
            />
          </div> */}

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="aadharNo">Aadhar Number</Label>
            <Input type="text" id="aadharNo" {...register("aadharNo")} />
          </div>

          {/* <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="panImgFront">PAN Card Front Upload</Label>
            <Input id="panImgFront" type="file" {...register("panImgFront")} />
          </div> */}

          {/* <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="panImgBack">PAN Card Back Upload</Label>
            <Input id="panImgBack" type="file" {...register("panImgBack")} />
          </div> */}

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="panNo">PAN Number</Label>
            <Input type="text" id="panNo" {...register("panNo")} />
          </div>
        </div>

        <p className="font-bold">
          Step 2: <span className="text-red-600">*</span>
        </p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="creditScore">Credit Score</Label>
            <Input type="text" id="creditScore" {...register("creditScore")} />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="currEmis">Current EMIs</Label>
            <Select onValueChange={(value) => setValue("currEmis", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select number of EMIs" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, "More than 4"].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="mt-8 text-md" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default CbStepOne;
