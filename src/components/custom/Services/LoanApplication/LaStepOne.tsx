"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useState } from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/components/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

type FormValues = {
  fullName: string;
  phoneNo: string;
  amtRequired: string;
  prpseOfLoan: string;
  aadharImg: string;
  aadharNo: string;
  panImg: string;
  panNo: string;
  creditScore: string;
  empType: string;
  EmpOthers: string;
  monIncome: string;
  currEmis: string;
  selfieImg: string;
  bankStatmntImg: string;
};

const LaStepOne = () => {
  const { toast } = useToast();

  const form = useForm<FormValues>();
  const { register, control, handleSubmit } = form;

  /* Form Triggers on form Submit */

  const onSubmit = async (data: FormValues) => {
    console.log("Form Submitted", data);

    toast({
      title: "Message Sent!",
      description:
        "We've received your message. We'll reply via email in the next 24 hours.",
    });

    window.location.href = "/loan-application/eligible";
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
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="amtRequired">Loan Amount Required(in ₹)</Label>
            <Input type="text" id="amtRequired" {...register("amtRequired")} />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="prpseOfLoan">Purpose of Loan</Label>
            <Input type="tel" id="prpseOfLoan" {...register("prpseOfLoan")} />
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

          <div className="grid w-full items-center gap-4">
            <Label htmlFor="fullName">Employment Type</Label>
            <RadioGroup>
              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="Salaried"
                  id="r1"
                />
                <Label htmlFor="r1">Salaried</Label>
              </div>
              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="Self Employed"
                  id="r2"
                />
                <Label htmlFor="r2">Self Employed</Label>
              </div>
              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="Others"
                  id="r3"
                />
                <Label htmlFor="r3">Others(mention below)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="EmpOthers">Employment Type(if Others)</Label>
            <Input type="text" id="EmpOthers" {...register("EmpOthers")} />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="monIncome">Monthly Income(in ₹)</Label>
            <Input type="text" id="monIncome" {...register("monIncome")} />
          </div>
        </div>

        <p className="font-bold">
          Step 3: <span className="text-red-600">*</span>
        </p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="currEmis">Current EMIs</Label>
            <Textarea id="currEmis" {...register("currEmis")} />
            <p className="text-[12px]">
              Separate by commas(in case of many EMIs)
            </p>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="selfieImg">Upload a selfie</Label>
            <Input id="selfieImg" type="file" {...register("selfieImg")} />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="bankStatmntImg">Upload bank statement</Label>
            <Input
              id="bankStatmntImg"
              type="file"
              {...register("bankStatmntImg")}
            />
          </div>
        </div>

        <Button type="submit" className="mt-8 text-md">
          Check Eligibility
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default LaStepOne;
