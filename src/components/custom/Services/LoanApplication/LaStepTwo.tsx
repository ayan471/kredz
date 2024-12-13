"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, Calendar, PiggyBank } from "lucide-react";
import { calculateEMI } from "@/components/lib/utils";

type FormValues = {
  fullName: string;
  phoneNo: string;
  emailID: string;
  panNo: string;
  aadharNo: string;
  emiTenure: string;
};

type EMIDetails = {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  interestRate: number;
};

const LaStepTwo = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, setValue, watch } = form;
  const [eligibleAmount, setEligibleAmount] = useState<number | null>(null);
  const [emiDetails, setEmiDetails] = useState<EMIDetails | null>(null);

  const selectedTenure = watch("emiTenure");

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

  useEffect(() => {
    if (eligibleAmount && selectedTenure) {
      const details = calculateEMI(eligibleAmount, parseInt(selectedTenure));
      setEmiDetails(details);
    }
  }, [eligibleAmount, selectedTenure]);

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

    const result = await updateLoanApplicationData(id, {
      ...data,
      step: 2,
      // Remove emiAmount, totalPayment, and totalInterest from here
    });

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

            <Controller
              name="emiTenure"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-2"
                >
                  {[12, 24, 36, 48, 60, 72].map((months) => {
                    const monthlyEMI = eligibleAmount
                      ? calculateEMI(eligibleAmount, months).emi
                      : 0;

                    return (
                      <div
                        key={months}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={months.toString()}
                            id={`r${months}`}
                          />
                          <Label htmlFor={`r${months}`}>{months} months</Label>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">
                            ₹{monthlyEMI.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600">/month</span>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            />
          </div>

          <AnimatePresence mode="wait">
            {emiDetails && (
              <motion.div
                key={selectedTenure}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <Card className="bg-white/80">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      EMI Breakdown
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IndianRupee className="w-5 h-5 text-blue-600" />
                          <span>Monthly EMI</span>
                        </div>
                        <span className="font-semibold">
                          ₹{emiDetails.emi.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <span>Loan Tenure</span>
                        </div>
                        <span className="font-semibold">
                          {selectedTenure} months
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PiggyBank className="w-5 h-5 text-green-600" />
                          <span>Total Interest</span>
                        </div>
                        <span className="font-semibold">
                          ₹{emiDetails.totalInterest.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-2 mt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total Payment</span>
                          <span className="font-bold text-lg">
                            ₹{emiDetails.totalPayment.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button type="submit" className="mt-8 text-md">
          Submit
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default LaStepTwo;
