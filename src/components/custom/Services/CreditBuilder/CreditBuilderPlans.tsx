"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, CreditCard, Monitor, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";

type FormValues = {
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

const CreditBuilderPlans: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const form = useForm<FormValues>({
    defaultValues: {
      plan: "",
    },
  });

  const { register, handleSubmit, setValue, watch } = form;
  const selectedPlan = watch("plan");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        title: "Authentication Required",
        description: "Please sign in to continue with your selected plan.",
        variant: "destructive",
      });
      // Redirect to sign in page or show sign in modal
      return;
    }

    if (!data.plan) {
      toast({
        title: "Plan Selection Required",
        description: "Please select a subscription plan to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Store the selected plan in localStorage or session storage
      // so we can access it on the form page
      localStorage.setItem("selectedCreditBuilderPlan", data.plan);

      // Redirect to the form page with the selected plan
      router.push(
        `/credit-builder-plan/form?plan=${encodeURIComponent(data.plan)}`
      );
    } catch (error) {
      console.error("Error processing plan selection:", error);
      toast({
        title: "Error",
        description: "Failed to process your selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
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
                      {isLoading ? "Processing..." : "Continue with this Plan"}
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
            disabled={isLoading || !selectedPlan}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </>
            ) : (
              "Continue with Selected Plan"
            )}
          </Button>
        )}
      </form>
    </div>
  );
};

export default CreditBuilderPlans;
