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
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, CreditCard, Zap } from "lucide-react";

type FormValues = {
  fullName: string;
  phoneNo: string;
  plan: string;
};

interface PlanOption {
  value: string;
  label: string;
  duration: number;
  price: number;
  popular?: boolean;
  color: string;
}

const planOptions: PlanOption[] = [
  {
    value: "1 month: ₹300 including GST",
    label: "Starter",
    duration: 1,
    price: 300,
    color: "from-blue-400 to-blue-600",
  },
  {
    value: "3 months: ₹900 including GST",
    label: "Basic",
    duration: 3,
    price: 900,
    color: "from-green-400 to-green-600",
  },
  {
    value: "6 month: ₹1800 including GST",
    label: "Standard",
    duration: 6,
    price: 1800,
    popular: true,
    color: "from-purple-400 to-purple-600",
  },
  {
    value: "9 month: ₹2700 including GST",
    label: "Advanced",
    duration: 9,
    price: 2700,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    value: "12 month: ₹3600 including GST",
    label: "Pro",
    duration: 12,
    price: 3600,
    color: "from-orange-400 to-orange-600",
  },
  {
    value: "15 month: ₹4500 including GST",
    label: "Elite",
    duration: 15,
    price: 4500,
    color: "from-red-400 to-red-600",
  },
  {
    value: "18 month: ₹5400 including GST",
    label: "Premium",
    duration: 18,
    price: 5400,
    color: "from-pink-400 to-pink-600",
  },
  {
    value: "21 month: ₹6300 including GST",
    label: "Platinum",
    duration: 21,
    price: 6300,
    color: "from-indigo-400 to-indigo-600",
  },
  {
    value: "24 month: ₹7200 including GST",
    label: "Ultimate",
    duration: 24,
    price: 7200,
    color: "from-teal-400 to-teal-600",
  },
];

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Select Your Credit Builder Plan
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Choose the plan that best fits your credit-building goals
        </p>

        <RadioGroup
          value={selectedPlan}
          onValueChange={(value) => setValue("plan", value)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {planOptions.map((plan) => (
            <Card
              key={plan.value}
              className={`relative overflow-hidden transition-all duration-300 transform ${
                selectedPlan === plan.value
                  ? "ring-4 ring-orange-400 shadow-xl scale-105"
                  : "hover:shadow-lg hover:scale-102"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-75`}
              ></div>
              <CardContent className="relative z-10 p-6">
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {plan.label}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-extrabold text-white">
                    ₹{plan.price}
                  </span>
                  <span className="text-lg text-white ml-2">
                    / {plan.duration} {plan.duration === 1 ? "month" : "months"}
                  </span>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-white">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {plan.duration} {plan.duration === 1 ? "month" : "months"}{" "}
                      duration
                    </span>
                  </div>
                  <div className="flex items-center text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span className="text-sm">Includes GST</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="text-sm">Instant activation</span>
                  </div>
                </div>
                <RadioGroupItem
                  value={plan.value}
                  id={plan.value}
                  className="sr-only"
                  {...register("plan")}
                />
                <Label
                  htmlFor={plan.value}
                  className={`flex items-center justify-center w-full py-2 rounded-md cursor-pointer transition-colors duration-300 ${
                    selectedPlan === plan.value
                      ? "bg-white text-gray-800 font-bold"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {selectedPlan === plan.value ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    "Choose Plan"
                  )}
                </Label>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>

        <Button
          type="submit"
          className="mt-10 text-lg w-full max-w-md mx-auto py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processing...
            </>
          ) : (
            "Activate Your Plan Now"
          )}
        </Button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default CbStepTwo;
