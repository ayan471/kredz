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

    window.location.href = "/credit-builder/subscription/success";
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <p className="font-bold">
          New Credit Build Up Plans Subscription
          <span className="text-red-600"> *</span>
        </p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="fullName">Select A Plan</Label>
            <RadioGroup>
              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="1 month: ₹189 + GST - Real Price: ₹300"
                  id="r1"
                />
                <Label htmlFor="r1">
                  1 month: ₹189 + GST - Real Price: ₹300
                </Label>
              </div>
              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="3 months : ₹299 + GST - Real Price: ₹900"
                  id="r2"
                />
                <Label htmlFor="r2">
                  3 months : ₹299 + GST - Real Price: ₹900
                </Label>
              </div>
              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="6 month: ₹526 + GST - Real Price: ₹1800"
                  id="r3"
                />
                <Label htmlFor="r3">
                  6 month: ₹526 + GST - Real Price: ₹1800
                </Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="9 month: ₹779 + GST - Real Price: ₹2700"
                  id="r4"
                />
                <Label htmlFor="r4">
                  9 month: ₹779 + GST - Real Price: ₹2700
                </Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="12 month: ₹1015 + GST - Real Price: ₹3600"
                  id="r4"
                />
                <Label htmlFor="r4">
                  12 month: ₹1015 + GST - Real Price: ₹3600
                </Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="15 month: ₹1265 + GST - Real Price: ₹4500"
                  id="r5"
                />
                <Label htmlFor="r5">
                  15 month: ₹1265 + GST - Real Price: ₹4500
                </Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="18 month: ₹1518 + GST - Real Price: ₹5400"
                  id="r6"
                />
                <Label htmlFor="r6">
                  18 month: ₹1518 + GST - Real Price: ₹5400
                </Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="21 month: ₹1768 + GST - Real Price: ₹6300"
                  id="r7"
                />
                <Label htmlFor="r7">
                  21 month: ₹1768 + GST - Real Price: ₹6300
                </Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("empType")}
                  type="radio"
                  value="24 month: ₹2018 + GST - Real Price: ₹7200"
                  id="r8"
                />
                <Label htmlFor="r8">
                  24 month: ₹2018 + GST - Real Price: ₹7200
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button type="submit" className="mt-8 text-md">
          Make Payment
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default LaStepOne;
