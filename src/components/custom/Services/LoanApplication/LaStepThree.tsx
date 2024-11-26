"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { submitLoanMembership } from "@/actions/loanApplicationActions";

type FormValues = {
  fullName: string;
  phoneNo: string;
  emailID: string;
  panNo: string;
  aadharNo: string;
  membershipPlan: string;
};

const LaStepThree = () => {
  const { toast } = useToast();
  const form = useForm<FormValues>();
  const { register, control, handleSubmit } = form;

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await submitLoanMembership(formData);

    if (result.success) {
      toast({
        title: "Membership Submitted!",
        description: "Your loan membership has been processed.",
      });
      window.location.href = "/loan-application/success";
    } else {
      toast({
        title: "Error",
        description:
          result.error ||
          "Failed to submit  Loan membership. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-xl mb-8">
          Buy Membership Plan & Get Your upto 3X of monthly income. Pre-Approved
          Loan Offer Processed Instantly.
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

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="emailID">Email ID</Label>
            <Input type="email" id="emailID" {...register("emailID")} />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="panNo">PAN No</Label>
            <Input type="text" id="panNo" {...register("panNo")} />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="aadharNo">Aadhar No</Label>
            <Input type="text" id="aadharNo" {...register("aadharNo")} />
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="membershipPlan">Available Membership Plan</Label>

            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Bronze"
                  id="r1"
                  {...register("membershipPlan")}
                  disabled
                />
                <Label htmlFor="r1">Bronze</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Silver"
                  id="r2"
                  {...register("membershipPlan")}
                  disabled
                />
                <Label htmlFor="r2">Silver</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Gold"
                  id="r3"
                  {...register("membershipPlan")}
                  disabled
                />
                <Label htmlFor="r3">Gold</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Platinum"
                  id="r4"
                  {...register("membershipPlan")}
                />
                <Label htmlFor="r4">Platinum</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button type="submit" className="mt-8 text-md">
          Payment Gateway Link
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default LaStepThree;
