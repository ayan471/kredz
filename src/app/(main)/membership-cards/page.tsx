"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, CreditCard, Zap, Shield, Clock } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./components/Loader";

type FormValues = {
  plan: string;
};

interface PlanOption {
  value: string;
  label: string;
  discountedPrice: number;
  realPrice: number;
  features: string[];
  popular?: boolean;
  color: string;
  icon: React.ReactNode;
}

const planOptions: PlanOption[] = [
  {
    value: "Bronze",
    label: "Bronze",
    discountedPrice: 179,
    realPrice: 300,
    features: [
      "Instant processing",
      "Exclusive interest rates",
      "24/7 customer support",
    ],
    color: "from-amber-400 to-amber-600",
    icon: <CreditCard className="w-8 h-8" />,
  },
  {
    value: "Silver",
    label: "Silver",
    discountedPrice: 289,
    realPrice: 600,
    features: [
      "All Bronze features",
      "Priority customer support",
      "Monthly credit report",
    ],
    color: "from-gray-300 to-gray-500",
    icon: <Zap className="w-8 h-8" />,
  },
  {
    value: "Gold",
    label: "Gold",
    discountedPrice: 389,
    realPrice: 900,
    features: [
      "All Silver features",
      "Quarterly financial consultation",
      "Advanced credit monitoring",
    ],
    popular: true,
    color: "from-yellow-300 to-yellow-500",
    icon: <Shield className="w-8 h-8" />,
  },
  {
    value: "Platinum",
    label: "Platinum",
    discountedPrice: 479,
    realPrice: 1200,
    features: [
      "All Gold features",
      "Monthly financial consultation",
      "Exclusive loan offers",
    ],
    color: "from-gray-600 to-gray-800",
    icon: <Sparkles className="w-8 h-8" />,
  },
];

const MembershipCardsPage: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  const form = useForm<FormValues>({
    defaultValues: {
      plan: "",
    },
  });
  const { register, handleSubmit, setValue, watch } = form;

  const selectedPlan = watch("plan");

  useEffect(() => {
    if (user) {
      setUserDetails({
        fullName: `${user.firstName} ${user.lastName}`,
        phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      });
    }
  }, [user]);

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
      const orderId = `MC-${user?.id}-${Date.now().toString().slice(-8)}`.slice(
        0,
        38
      );

      const response = await fetch("/api/initiate-phonepe-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(totalAmount),
          orderId,
          customerName: userDetails.fullName,
          customerPhone: userDetails.phoneNumber,
          customerEmail: userDetails.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate payment");
      }

      const paymentData = await response.json();

      if (paymentData.success && paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error(paymentData.error || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error in payment process:", error);
      toast({
        title: "Payment Error",
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

  if (!isLoaded) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Welcome to Kredz Membership
          </h2>
          <p className="text-xl mb-8">
            Please sign in to view our exclusive membership options.
          </p>
          <Button
            onClick={() => {
              // Add your sign-in logic here
            }}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300"
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <form
          className="flex flex-col gap-12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-center">
            <motion.h2
              className="text-5xl md:text-6xl font-extrabold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">
                Elevate Your Financial Future
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Choose the Kredz Membership that aligns with your aspirations
            </motion.p>
          </div>

          <RadioGroup
            value={selectedPlan}
            onValueChange={(value) => setValue("plan", value)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {planOptions.map((plan, index) => {
                const { baseAmount, gstAmount, totalAmount } =
                  calculateTotalAmount(plan.discountedPrice);
                return (
                  <motion.div
                    key={plan.value}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      className={`relative overflow-hidden transition-all duration-300 transform ${
                        selectedPlan === plan.value
                          ? "ring-4 ring-orange-400 shadow-2xl scale-105"
                          : "hover:shadow-xl hover:scale-102"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-90`}
                      ></div>
                      <CardContent className="relative z-10 p-6">
                        {plan.popular && (
                          <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-bl-lg">
                            MOST POPULAR
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-3xl font-bold text-white">
                            {plan.label}
                          </h3>
                          <div className="p-2 bg-white rounded-full">
                            {plan.icon}
                          </div>
                        </div>
                        <div className="flex flex-col items-baseline mb-6">
                          <span className="text-4xl font-extrabold text-white">
                            ₹{plan.discountedPrice}
                          </span>
                          <span className="text-sm text-gray-200 line-through">
                            ₹{plan.realPrice}
                          </span>
                          <div className="flex flex-col items-start mt-2">
                            <span className="text-sm text-gray-200">
                              + ₹{gstAmount} GST
                            </span>
                            <span className="text-lg font-semibold text-white">
                              Total: ₹{totalAmount}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-white"
                            >
                              <Check className="w-5 h-5 mr-2 text-green-400" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <RadioGroupItem
                          value={plan.value}
                          id={plan.value}
                          className="sr-only"
                          {...register("plan")}
                        />
                        <label
                          htmlFor={plan.value}
                          className={`flex items-center justify-center w-full py-3 rounded-full cursor-pointer transition-all duration-300 ${
                            selectedPlan === plan.value
                              ? "bg-white text-gray-800 font-bold shadow-lg"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                        >
                          {selectedPlan === plan.value ? (
                            <>
                              <Check className="w-5 h-5 mr-2" />
                              Selected
                            </>
                          ) : (
                            "Choose Plan"
                          )}
                        </label>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </RadioGroup>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center"
          >
            <Button
              type="submit"
              className="mt-8 text-xl w-full max-w-md py-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 rounded-full shadow-lg"
              disabled={isLoading || !selectedPlan}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Initiating Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6 mr-2" />
                  Get Your Membership Card
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default MembershipCardsPage;
