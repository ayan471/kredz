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

const LaStepTwo = () => {
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

    window.location.href = "/loan-application/membership";
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-xl mb-8">
          Congrats, Rajen! Your Pre-Approved UPTO 3X of monthly income Offer is
          Successfully Confirmed. Process Credit Builder Loan Your Offer Now.
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
            <Label htmlFor="fullName">Select EMI Tenure</Label>

            <RadioGroup>
              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="12 months mention emi amount 11% pa"
                  id="r1"
                />
                <Label htmlFor="r1">12 months mention emi amount 11% pa</Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="24 months mention emi amount 11% pa"
                  id="r2"
                />
                <Label htmlFor="r2">24 months mention emi amount 11% pa</Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="36 months mention emi amount 11% pa"
                  id="r3"
                />
                <Label htmlFor="r3">36 months mention emi amount 11% pa</Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="48 months mention emi amount 11% pa"
                  id="r4"
                />
                <Label htmlFor="r4">48 months mention emi amount 11% pa</Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="60 months mention emi amount 11% pa"
                  id="r5"
                />
                <Label htmlFor="r5">60 months mention emi amount 11% pa</Label>
              </div>

              <div className="travelTypeCstm flex items-center space-x-2">
                <input
                  {...register("emiTenure")}
                  type="radio"
                  value="72 months mention emi amount 11% pa"
                  id="r6"
                />
                <Label htmlFor="r6">72 months mention emi amount 11% pa</Label>
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
