"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { submitCreditBuilderSubscription } from "@/actions/formActions";

type FormValues = {
  fullName: string;
  phoneNo: string;
  empType: string;
};

const CbStepTwo: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormValues>();
  const { register, control, handleSubmit } = form;
  const { user } = useUser();

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a subscription.",
        variant: "destructive",
      });
      return;
    }

    const result = await submitCreditBuilderSubscription(data);
    if (result.success) {
      toast({
        title: "Subscription Submitted!",
        description: "We've received your credit builder subscription.",
      });
      router.push("/credit-builder/subscription/success");
    } else {
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <p className="font-bold">
          New Credit Build Up Plans Subscription
          <span className="text-red-600"> *</span>
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

          <div className="grid w-full items-center gap-4">
            <Label htmlFor="fullName">Select A Plan</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="1 month: ₹189 + GST - Real Price: ₹300"
                  id="r1"
                  {...register("empType")}
                />
                <Label htmlFor="r1">1 month: ₹300</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="3 months : ₹299 + GST - Real Price: ₹900"
                  id="r2"
                  {...register("empType")}
                />
                <Label htmlFor="r2">3 months : ₹900</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="6 month: ₹526 + GST - Real Price: ₹1800"
                  id="r3"
                  {...register("empType")}
                />
                <Label htmlFor="r3">6 month: ₹1800</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="9 month: ₹779 + GST - Real Price: ₹2700"
                  id="r4"
                  {...register("empType")}
                />
                <Label htmlFor="r4">9 month: ₹2700</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="12 month: ₹1015 + GST - Real Price: ₹3600"
                  id="r5"
                  {...register("empType")}
                />
                <Label htmlFor="r5">12 month: ₹3600</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="15 month: ₹1265 + GST - Real Price: ₹4500"
                  id="r6"
                  {...register("empType")}
                />
                <Label htmlFor="r6">15 month: ₹4500</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="18 month: ₹1518 + GST - Real Price: ₹5400"
                  id="r7"
                  {...register("empType")}
                />
                <Label htmlFor="r7">18 month: ₹5400</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="21 month: ₹1768 + GST - Real Price: ₹6300"
                  id="r8"
                  {...register("empType")}
                />
                <Label htmlFor="r8">21 month: ₹6300</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="24 month: ₹2018 + GST - Real Price: ₹7200"
                  id="r9"
                  {...register("empType")}
                />
                <Label htmlFor="r9">24 month: ₹7200</Label>
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

export default CbStepTwo;
