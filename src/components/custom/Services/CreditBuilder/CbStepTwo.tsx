"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  getCreditBuilderData,
  submitCreditBuilderSubscription,
} from "@/actions/formActions";

type FormValues = {
  fullName: string;
  phoneNo: string;
  plan: string;
};

const CbStepTwo: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      phoneNo: "",
      plan: "",
    },
  });
  const { register, control, handleSubmit, setValue, watch } = form;
  const { user } = useUser();

  const selectedPlan = watch("plan");

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const data = await getCreditBuilderData(user.id);
          if (data) {
            setValue("fullName", data.fullName || "");
            setValue("phoneNo", data.phoneNo || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Error",
            description: "Failed to load user data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user, setValue, toast]);

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a subscription.",
        variant: "destructive",
      });
      return;
    }

    if (!data.plan) {
      toast({
        title: "Plan Selection Required",
        description: "Please select a subscription plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitCreditBuilderSubscription(data);
      if (result.success) {
        toast({
          title: "Subscription Submitted!",
          description: "We've received your credit builder subscription.",
        });
        router.push("/credit-builder/subscription/success");
      } else {
        throw new Error(result.error || "Failed to submit subscription");
      }
    } catch (error) {
      console.error("Error submitting subscription:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <p className="font-bold">
          New Credit Build Up Plans Subscription
          <span className="text-red-600"> *</span>
        </p>

        <div className="flex flex-col gap-6 bg-[rgba(255,255,255,0.4)] p-6 border-[1px] rounded-xl">
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="plan">Select a Plan</Label>
            <RadioGroup
              value={selectedPlan}
              onValueChange={(value) => setValue("plan", value)}
            >
              {[
                {
                  value: "1 month: ₹300 including GST",
                  label: "1 month: ₹300 including GST",
                },
                {
                  value: "3 months: ₹900 including GST",
                  label: "3 months : ₹900 including GST",
                },
                {
                  value: "6 month: ₹1800 including GST",
                  label: "6 month: ₹1800 including GST",
                },
                {
                  value: "9 month: ₹2700 including GST",
                  label: "9 month: ₹2700 including GST",
                },
                {
                  value: "12 month: ₹3600 including GST",
                  label: "12 month: ₹3600 including GST",
                },
                {
                  value: "15 month: ₹4500 including GST",
                  label: "15 month: ₹4500 including GST",
                },
                {
                  value: "18 month: ₹5400 including GST",
                  label: "18 month: ₹5400 including GST",
                },
                {
                  value: "21 month: ₹6300 including GST",
                  label: "21 month: ₹6300 including GST",
                },
                {
                  value: "24 month: ₹7200 including GST",
                  label: "24 month: ₹7200 including GST",
                },
              ].map((plan, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={plan.value}
                    id={`r${index + 1}`}
                    {...register("plan")}
                  />
                  <Label htmlFor={`r${index + 1}`}>{plan.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <Button type="submit" className="mt-8 text-md" disabled={isLoading}>
          {isLoading ? "Processing..." : "Make Payment"}
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default CbStepTwo;
