"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { submitCreditBuilderApplication } from "@/actions/formActions";

type FormValues = {
  fullName: string;
  phoneNo: string;
  aadharImg: FileList;
  aadharNo: string;
  panImg: FileList;
  panNo: string;
  creditScore: string;
  currEmis: string;
};

interface CbStepOneProps {
  onComplete: () => void;
}

const CbStepOne: React.FC<CbStepOneProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, setValue } = form;
  const { user } = useUser();

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit an application.",
        variant: "destructive",
      });
      return;
    }

    // Convert FileList to File objects
    const aadharImgFile = data.aadharImg[0];
    const panImgFile = data.panImg[0];

    // Create FormData object
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("phoneNo", data.phoneNo);
    formData.append("aadharImg", aadharImgFile);
    formData.append("aadharNo", data.aadharNo);
    formData.append("panImg", panImgFile);
    formData.append("panNo", data.panNo);
    formData.append("creditScore", data.creditScore);
    formData.append("currEmis", data.currEmis);

    const result = await submitCreditBuilderApplication(formData);
    if (result.success) {
      toast({
        title: "Application Submitted!",
        description: "We've received your credit builder application.",
      });
      onComplete(); // Call the onComplete function to move to the next step
    } else {
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
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
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="aadharImg">Aadhar Card Upload</Label>
            <Input
              id="aadharImg"
              type="file"
              {...register("aadharImg")}
              className="w-full"
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="aadharNo">Aadhar Number</Label>
            <Input type="text" id="aadharNo" {...register("aadharNo")} />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="panImg">PAN Card Upload</Label>
            <Input id="panImg" type="file" {...register("panImg")} />
          </div>

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
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="mt-8 text-md">
          Submit
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default CbStepOne;
