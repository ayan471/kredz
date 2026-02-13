"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  Sparkles,
  CreditCard,
  Zap,
  Shield,
  Crown,
  Star,
  ArrowRight,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./components/Loader";
import SabpaisaPaymentGateway from "@/components/sabpaisa-payment-gateway";
import { useRouter, useSearchParams } from "next/navigation";

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
  gradient: string;
  iconBg: string;
  icon: React.ReactNode;
  badge?: string;
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
    gradient: "from-blue-400 to-blue-500",
    iconBg: "bg-blue-100 text-blue-600",
    icon: <CreditCard className="w-6 h-6" />,
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
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-100 text-blue-700",
    icon: <Zap className="w-6 h-6" />,
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
    gradient: "from-blue-600 to-blue-700",
    iconBg: "bg-blue-100 text-blue-800",
    icon: <Crown className="w-6 h-6" />,
    badge: "MOST POPULAR",
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
    gradient: "from-blue-700 to-blue-900",
    iconBg: "bg-blue-100 text-blue-900",
    icon: <Sparkles className="w-6 h-6" />,
    badge: "BEST VALUE",
  },
];

const MembershipCardsPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      plan: "",
    },
  });
  const { register, handleSubmit, setValue, watch } = form;

  const selectedPlan = watch("plan");

  useEffect(() => {
    const encResponse = searchParams.get("encResponse");
    if (encResponse) {
      console.log("Payment response detected, waiting for redirection...");
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setUserDetails({
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
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
        (option) => option.value === data.plan,
      );
      if (!selectedPlanOption) {
        throw new Error("Invalid plan selected");
      }

      const { totalAmount } = calculateTotalAmount(
        selectedPlanOption.discountedPrice,
      );
      const orderId = `MC-${user?.id}-${Date.now().toString().slice(-8)}`.slice(
        0,
        38,
      );

      const response = await fetch("/api/initiate-sabpaisa-payment", {
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
          // Updated to show Total Amount in the Gateway details
          planDetails: `${selectedPlanOption.label} Plan - ₹${totalAmount}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate payment");
      }

      const paymentData = await response.json();

      if (paymentData.success && paymentData.paymentDetails) {
        setPaymentDetails(paymentData.paymentDetails);
        setShowPaymentModal(true);
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

  const handlePaymentToggle = () => {
    setShowPaymentModal(false);
  };

  if (!isLoaded) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10 px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            Premium Membership
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Welcome to Kredz Membership
          </h2>
          <p className="text-xl text-blue-700/80 mb-8 max-w-md mx-auto">
            Please sign in to view our exclusive membership options.
          </p>
          <Button
            onClick={() => router.push("/sign-in")}
            className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
          >
            Sign In to Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
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
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                Choose Your Plan
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="text-blue-900">Elevate Your</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                  Financial Future
                </span>
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-blue-700/70 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Choose the Kredz Membership that aligns with your aspirations
                and unlock exclusive financial benefits.
              </motion.p>
            </div>

            <RadioGroup
              value={selectedPlan}
              onValueChange={(value) => setValue("plan", value)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {planOptions.map((plan, index) => {
                  const { totalAmount } = calculateTotalAmount(
                    plan.discountedPrice,
                  );
                  const isSelected = selectedPlan === plan.value;

                  return (
                    <motion.div
                      key={plan.value}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative"
                    >
                      <Card
                        className={`relative overflow-hidden transition-all duration-300 cursor-pointer border-0 ${
                          isSelected
                            ? "ring-4 ring-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02]"
                            : "hover:shadow-xl hover:scale-[1.01] shadow-lg"
                        }`}
                        onClick={() => setValue("plan", plan.value)}
                      >
                        <div
                          className={`h-2 bg-gradient-to-r ${plan.gradient}`}
                        />

                        <CardContent className="p-6 bg-white">
                          {plan.badge && (
                            <div className="absolute top-4 right-4">
                              <span
                                className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${plan.gradient} text-white`}
                              >
                                {plan.badge}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl ${plan.iconBg}`}>
                              {plan.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900">
                              {plan.label}
                            </h3>
                          </div>

                          {/* UPDATED PRICING SECTION */}
                          <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-bold text-blue-900">
                                ₹{totalAmount}
                              </span>
                              <span className="text-lg text-blue-400 line-through">
                                ₹{plan.realPrice}
                              </span>
                            </div>
                            {/* <div className="mt-1 text-xs text-blue-600/70 font-medium italic">
                              (Inclusive of GST)
                            </div> */}
                          </div>

                          <div className="space-y-3 mb-6">
                            {plan.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center text-blue-800"
                              >
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                                  <Check className="w-3 h-3 text-blue-600" />
                                </div>
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
                            className={`flex items-center justify-center w-full py-3 rounded-xl cursor-pointer transition-all duration-300 font-semibold ${
                              isSelected
                                ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg`
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                          >
                            {isSelected ? (
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
                className="mt-4 text-lg w-full max-w-md py-7 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !selectedPlan}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                    Initiating Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Get Your Membership Card
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-600/60"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Instant Activation</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {showPaymentModal && paymentDetails && (
        <SabpaisaPaymentGateway
          clientCode={paymentDetails.clientCode}
          transUserName={paymentDetails.transUserName}
          transUserPassword={paymentDetails.transUserPassword}
          authkey={paymentDetails.authkey}
          authiv={paymentDetails.authiv}
          payerName={paymentDetails.payerName}
          payerEmail={paymentDetails.payerEmail}
          payerMobile={paymentDetails.payerMobile}
          clientTxnId={paymentDetails.clientTxnId}
          amount={paymentDetails.amount}
          payerAddress={paymentDetails.payerAddress}
          callbackUrl={paymentDetails.callbackUrl}
          isOpen={showPaymentModal}
          onToggle={handlePaymentToggle}
        />
      )}
    </div>
  );
};

export default MembershipCardsPage;
