"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { submitLoanEligibility } from "@/actions/loanApplicationActions";

type FormValues = {
  fullName: string;
  phoneNo: string;
  emailID: string;
  panNo: string;
  aadharNo: string;
  emiTenure: string;
};

const LaStepTwo = () => {
  const { toast } = useToast();
  const form = useForm<FormValues>();
  const { register, control, handleSubmit } = form;

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await submitLoanEligibility(formData);

    if (result.success) {
      toast({
        title: "Eligibility Submitted!",
        description: "Your loan eligibility has been determined.",
      });
      window.location.href = "/loan-application/membership";
    } else {
      toast({
        title: "Error",
        description:
          result.error || "Failed to submit eligibility. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-xl mb-8">
          Congrats! Your Pre-Approved UPTO 3X of monthly income Offer is
          Successfully Confirmed. Process Credit Builder Loan Your Offer Now.
        </p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              {...register("fullName")}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phoneNo">Phone No</Label>
            <Input type="tel" id="phoneNo" {...register("phoneNo")} required />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="emailID">Email ID</Label>
            <Input
              type="email"
              id="emailID"
              {...register("emailID")}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="panNo">PAN No</Label>
            <Input type="text" id="panNo" {...register("panNo")} required />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="aadharNo">Aadhar No</Label>
            <Input
              type="text"
              id="aadharNo"
              {...register("aadharNo")}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="emiTenure">Select EMI Tenure</Label>

            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12" id="r1" {...register("emiTenure")} />
                <Label htmlFor="r1">12 months (EMI amount at 11% p.a.)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24" id="r2" {...register("emiTenure")} />
                <Label htmlFor="r2">24 months (EMI amount at 11% p.a.)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="36" id="r3" {...register("emiTenure")} />
                <Label htmlFor="r3">36 months (EMI amount at 11% p.a.)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="48" id="r4" {...register("emiTenure")} />
                <Label htmlFor="r4">48 months (EMI amount at 11% p.a.)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="60" id="r5" {...register("emiTenure")} />
                <Label htmlFor="r5">60 months (EMI amount at 11% p.a.)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="72" id="r6" {...register("emiTenure")} />
                <Label htmlFor="r6">72 months (EMI amount at 11% p.a.)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button type="submit" className="mt-8 text-md">
          Submit
        </Button>
      </form>

      <p className="text-xl mt-8">
        You need to buy a membership due to this reason lorem ipsum. You'll find
        a Subscription in the next step.
      </p>

      <DevTool control={control} />
    </div>
  );
};

export default LaStepTwo;
