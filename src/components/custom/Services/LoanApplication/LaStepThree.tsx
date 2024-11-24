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
  emailID: string;
  panNo: string;
  aadharNo: string;
  emiTenure: string;
};

const LaStepThree = () => {
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

    window.location.href = "/loan-application/success";
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
            <Input
              type="text"
              placeholder="Rajen Roy"
              value="Rajen Roy"
              id="fullName"
              {...register("fullName")}
            />
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
            <Label htmlFor="fullName">Available Membership Plan</Label>

            <RadioGroup>
              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="Bronze"
                  id="r1"
                  disabled
                />
                <Label htmlFor="r1">Bronze</Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="Silver"
                  id="r2"
                  disabled
                />
                <Label htmlFor="r2">Silver</Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="Gold"
                  id="r3"
                  disabled
                />
                <Label htmlFor="r3">Gold</Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="Platinum"
                  id="r3"
                />
                <Label htmlFor="r3">Platinum</Label>
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
