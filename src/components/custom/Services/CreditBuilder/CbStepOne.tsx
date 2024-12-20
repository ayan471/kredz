"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { saveCreditBuilderData } from "@/actions/formActions";

type FormValues = {
  fullName: string;
  phoneNo: string;
  aadharNo: string;
  panNo: string;
  creditScore: string;
  currEmis: string;
};

const CbStepOne: React.FC = () => {
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

    try {
      const result = await saveCreditBuilderData(data);
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
        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              {...register("fullName", { required: true })}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phoneNo">Phone No</Label>
            <Input
              type="tel"
              id="phoneNo"
              {...register("phoneNo", { required: true })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="aadharNo">Aadhar Number</Label>
            <Input
              type="text"
              id="aadharNo"
              {...register("aadharNo", { required: true })}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="panNo">PAN Number</Label>
            <Input
              type="text"
              id="panNo"
              {...register("panNo", { required: true })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="creditScore">Credit Score</Label>
            <Input
              type="text"
              id="creditScore"
              {...register("creditScore", { required: true })}
            />
          </div>
        </div>

        <Button type="submit" className="mt-8 text-md" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit and Continue"}
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default CbStepOne;
