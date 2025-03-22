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
import { Check, Clock, CreditCard, Monitor, User, Zap } from "lucide-react";
import { initiatePhonePePayment } from "@/components/lib/phonePe";

type FormValues = {
  fullName: string;
  phoneNo: string;
  plan: string;
};

interface PlanOption {
  value: string;
  label: string;
  duration: number;
  discountedPrice: number;
  originalPrice: number;
  popular?: boolean;
  color: string;
}

const planOptions: PlanOption[] = [
  {
    value: "1 month",
    label: "Starter",
    duration: 1,
    discountedPrice: 189,
    originalPrice: 300,
    color: "from-blue-400 to-blue-600",
  },
  {
    value: "3 months",
    label: "Basic",
    duration: 3,
    discountedPrice: 299,
    originalPrice: 900,
    color: "from-green-400 to-green-600",
  },
  {
    value: "6 months",
    label: "Standard",
    duration: 6,
    discountedPrice: 526,
    originalPrice: 1800,
    popular: true,
    color: "from-purple-400 to-purple-600",
  },
  {
    value: "9 months",
    label: "Advanced",
    duration: 9,
    discountedPrice: 779,
    originalPrice: 2700,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    value: "12 months",
    label: "Pro",
    duration: 12,
    discountedPrice: 1015,
    originalPrice: 3600,
    color: "from-orange-400 to-orange-600",
  },
  {
    value: "15 months",
    label: "Elite",
    duration: 15,
    discountedPrice: 1265,
    originalPrice: 4500,
    color: "from-red-400 to-red-600",
  },
  {
    value: "18 months",
    label: "Premium",
    duration: 18,
    discountedPrice: 1518,
    originalPrice: 5400,
    color: "from-pink-400 to-pink-600",
  },
  {
    value: "21 months",
    label: "Platinum",
    duration: 21,
    discountedPrice: 1768,
    originalPrice: 6300,
    color: "from-indigo-400 to-indigo-600",
  },
  {
    value: "24 months",
    label: "Ultimate",
    duration: 24,
    discountedPrice: 2018,
    originalPrice: 7200,
    color: "from-teal-400 to-teal-600",
  },
];

const CbStepTwo: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const calculateTotalAmount = (baseAmount: number) => {
    const gstAmount = baseAmount * 0.18;
    const totalAmount = baseAmount + gstAmount;
    return {
      baseAmount: baseAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

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
      const selectedPlanOption = planOptions.find(
        (option) => option.value === data.plan
      );
      if (!selectedPlanOption) {
        throw new Error("Invalid plan selected");
      }

      const { totalAmount } = calculateTotalAmount(
        selectedPlanOption.discountedPrice
      );
      const orderId = `CB-${user.id}-${Date.now().toString().slice(-8)}`.slice(
        0,
        38
      );

      // Save subscription data first
      const subscriptionResult = await submitCreditBuilderSubscription(data);
      if (!subscriptionResult.success) {
        throw new Error(
          subscriptionResult.error || "Failed to submit subscription"
        );
      }

      // Initiate PhonePe payment
      const paymentResult = await initiatePhonePePayment({
        amount: parseFloat(totalAmount),
        orderId,
        customerName: data.fullName,
        customerPhone: data.phoneNo,
        customerEmail: user.primaryEmailAddress?.emailAddress || "",
      });

      if (paymentResult.success && paymentResult.paymentUrl) {
        window.location.href = paymentResult.paymentUrl;
      } else {
        throw new Error(paymentResult.error || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error in subscription process:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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
          {planOptions.map((plan) => {
            const { baseAmount, gstAmount, totalAmount } = calculateTotalAmount(
              plan.discountedPrice
            );
            return (
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
                  <div className="flex flex-col items-baseline mb-4">
                    <span className="text-3xl font-extrabold text-white">
                      ₹{baseAmount}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-white">
                        + ₹{gstAmount} GST
                      </span>
                      <span className="text-lg font-semibold text-white">
                        ₹{totalAmount}
                      </span>
                    </div>
                    <span className="text-sm text-white line-through">
                      ₹{plan.originalPrice}
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-white">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {plan.duration}{" "}
                        {plan.duration === 1 ? "month" : "months"} plan
                      </span>
                    </div>
                    <div className="flex items-center text-white">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Improve & Boost Your Credit Score
                      </span>
                    </div>
                    <div className="flex items-center text-white">
                      <Monitor className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Monitor & Maintain Good Credit Health
                      </span>
                    </div>
                    <div className="flex items-center text-white">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Identify & Remove Errors From Your Credit Report
                      </span>
                    </div>
                    <div className="flex items-center text-white">
                      <Check className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Assured Credit Builder Loan*(t&c)
                      </span>
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
                  {isMobile && selectedPlan === plan.value && (
                    <Button
                      type="submit"
                      className="mt-4 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md transition-colors duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Activate Plan"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </RadioGroup>

        {!isMobile && (
          <Button
            type="submit"
            className="mt-10 text-lg w-full max-w-md mx-auto py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Initiating PhonePe Payment...
              </>
            ) : (
              "Activate Plan"
            )}
          </Button>
        )}
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default CbStepTwo;
