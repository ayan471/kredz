"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  getLoanApplicationData,
  updateLoanApplicationData,
  determineMembershipPlan,
} from "@/actions/loanApplicationActions";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, setValue } = form;
  const [eligiblePlan, setEligiblePlan] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");
      if (id) {
        const result = await getLoanApplicationData(id);
        if (result.success && result.data) {
          Object.entries(result.data).forEach(([key, value]) => {
            if (key in form.getValues() && value !== null) {
              setValue(key as keyof FormValues, value as string);
            }
          });

          // Determine membership plan based on monthly income
          const monIncome = parseFloat(result.data.monIncome || "0");
          const membershipPlan = await determineMembershipPlan(monIncome);
          setEligiblePlan(membershipPlan);
          setValue("membershipPlan", membershipPlan);
        }
      }
    };
    fetchData();
  }, [searchParams, setValue, form]);

  const onSubmit = async (data: FormValues) => {
    const id = searchParams.get("id");
    if (!id) {
      toast({
        title: "Error",
        description: "Application ID not found",
        variant: "destructive",
      });
      return;
    }

    const result = await updateLoanApplicationData(id, { ...data, step: 3 });

    if (result.success) {
      toast({
        title: "Membership Submitted!",
        description: "Your loan membership has been processed.",
      });
      router.push(`/loan-application/success?id=${id}`);
    } else {
      toast({
        title: "Error",
        description:
          result.error || "Failed to submit Loan membership. Please try again.",
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
            <Label htmlFor="membershipPlan">Eligible Membership Plan</Label>
            <div className="text-lg font-semibold">{eligiblePlan}</div>
            <Input
              type="hidden"
              id="membershipPlan"
              {...register("membershipPlan")}
            />
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
