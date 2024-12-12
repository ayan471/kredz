"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import {
  getLoanApplicationData,
  updateLoanApplicationData,
} from "@/actions/loanApplicationActions";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, setValue } = form;
  const [eligibleAmount, setEligibleAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");
      if (id) {
        const result = await getLoanApplicationData(id);
        if (result.success && result.data) {
          const applicationData = result.data;
          Object.entries(applicationData).forEach(([key, value]) => {
            if (key in form.getValues() && value !== null) {
              setValue(key as keyof FormValues, value as string);
            }
          });
          setEligibleAmount(applicationData.eligibleAmount || null);
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

    const result = await updateLoanApplicationData(id, { ...data, step: 2 });

    if (result.success) {
      toast({
        title: "Eligibility Submitted!",
        description: "Your loan eligibility has been determined.",
      });
      router.push(`/loan-application/membership?id=${id}`);
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
        {eligibleAmount !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-lg p-6 mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
            <div className="relative z-10">
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Congratulations!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl text-white"
              >
                Your eligible loan amount:
              </motion.p>
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-4xl font-bold text-white mt-2"
              >
                ₹{eligibleAmount.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>
        )}

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

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-xl mt-8 p-4 bg-blue-200 border-l-4 border-blue-600 text-blue-800"
      >
        You need to buy a membership due to this reason lorem ipsum. You'll find
        a Subscription in the next step.
      </motion.p>

      <DevTool control={control} />
    </div>
  );
};

export default LaStepTwo;
