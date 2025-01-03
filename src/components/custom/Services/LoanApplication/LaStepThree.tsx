"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  getLoanApplicationData,
  updateLoanApplicationData,
  determineMembershipPlan,
} from "@/actions/loanApplicationActions";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Check } from "lucide-react";
import { initiatePhonePePayment } from "@/components/lib/phonePe";

type FormValues = {
  fullName: string;
  phoneNo: string;
  emailID: string;
  panNo: string;
  aadharNo: string;
  membershipPlan: string;
};

const calculateAmounts = (basePrice: number) => {
  const gstAmount = basePrice * 0.18;
  const totalAmount = basePrice + gstAmount;
  return {
    basePrice: basePrice.toFixed(2),
    gstAmount: gstAmount.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
  };
};

const LaStepThree = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, setValue } = form;
  const [eligiblePlan, setEligiblePlan] = useState<string>("");
  const [planDetails, setPlanDetails] = useState<{
    name: string;
    discountedPrice: number;
    realPrice: number;
    features: string[];
  }>({ name: "", discountedPrice: 0, realPrice: 0, features: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibleAmount, setEligibleAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");
      if (id) {
        const result = await getLoanApplicationData(id);
        if (result.success && result.data) {
          Object.entries(result.data).forEach(([key, value]) => {
            if (key in form.getValues() && value !== null) {
              setValue(key as keyof FormValues, value as string);
            }
          });

          // Determine membership plan based on monthly income
          const monIncome = parseFloat(result.data.monIncome || "0");
          const membershipPlan = await determineMembershipPlan(monIncome);
          setEligiblePlan(membershipPlan);
          setValue("membershipPlan", membershipPlan);

          setEligibleAmount(result.data.eligibleAmount || null);

          // Set plan details (replace with actual data)
          setPlanDetails({
            name: membershipPlan,
            discountedPrice:
              membershipPlan === "Bronze"
                ? 179
                : membershipPlan === "Silver"
                  ? 289
                  : membershipPlan === "Gold"
                    ? 389
                    : membershipPlan === "Platinum"
                      ? 479
                      : 0,
            realPrice:
              membershipPlan === "Bronze"
                ? 300
                : membershipPlan === "Silver"
                  ? 600
                  : membershipPlan === "Gold"
                    ? 900
                    : membershipPlan === "Platinum"
                      ? 1200
                      : 0,
            features: [
              // "Pre-approved loan offer",
              "Instant processing",
              "Exclusive interest rates",
              "24/7 customer support",
            ],
          });
        }
      }
    };
    fetchData();
  }, [searchParams, setValue, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const id = searchParams.get("id");
    if (!id) {
      toast({
        title: "Error",
        description: "Application ID not found",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await updateLoanApplicationData(id, { ...data, step: 3 });

      if (result.success) {
        toast({
          title: "Membership Submitted!",
          description: "Initiating payment...",
        });

        const paymentResult = await initiatePhonePePayment({
          amount: parseFloat(
            calculateAmounts(planDetails.discountedPrice).totalAmount
          ),
          orderId: id,
          customerName: data.fullName,
          customerPhone: data.phoneNo,
          customerEmail: data.emailID,
        });

        if (paymentResult.success && paymentResult.paymentUrl) {
          // Redirect to the payment URL
          window.location.href = paymentResult.paymentUrl;
        } else {
          console.error("Payment initiation failed:", paymentResult.error);
          toast({
            title: "Payment Error",
            description:
              paymentResult.error ||
              "Failed to initiate payment. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        throw new Error(result.error || "Failed to submit Loan membership");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[720px] px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-10"
      >
        Membership Plan
      </motion.h1>

      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        {eligibleAmount !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 p-6 bg-green-100 border-green-300 border rounded-xl text-green-800"
          >
            <h2 className="text-xl font-semibold mb-2">
              Your Eligible Loan Amount
            </h2>
            <p className="text-3xl font-bold">
              ₹{eligibleAmount.toLocaleString()}
            </p>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-6 bg-gradient-to-br from-blue-500 to-purple-600 p-8 sm:p-10 border-[1px] rounded-xl text-white shadow-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold">{planDetails.name} Plan</h2>
            <div className="flex items-end sm:items-center flex-col">
              <span className="text-3xl font-bold">
                ₹{calculateAmounts(planDetails.discountedPrice).basePrice}
              </span>
              <span className="text-sm">
                + ₹{calculateAmounts(planDetails.discountedPrice).gstAmount} GST
              </span>
              <span className="text-lg font-semibold">
                Total: ₹
                {calculateAmounts(planDetails.discountedPrice).totalAmount}
              </span>
              <span className="text-sm line-through text-gray-300">
                ₹{planDetails.realPrice}
              </span>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {planDetails.features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-center"
              >
                <Check className="w-5 h-5 mr-2 text-green-400" />
                {feature}
              </motion.li>
            ))}
          </ul>
          <Input
            type="hidden"
            id="membershipPlan"
            {...register("membershipPlan")}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col gap-8 bg-white p-8 sm:p-10 border-[1px] rounded-xl shadow-md"
        >
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="fullName">Full Name</Label>
            <Input type="text" id="fullName" {...register("fullName")} />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="phoneNo">Phone No</Label>
            <Input type="tel" id="phoneNo" {...register("phoneNo")} />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="emailID">Email ID</Label>
            <Input type="email" id="emailID" {...register("emailID")} />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="panNo">PAN No</Label>
            <Input type="text" id="panNo" {...register("panNo")} />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="aadharNo">Aadhar No</Label>
            <Input type="text" id="aadharNo" {...register("aadharNo")} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button
            type="submit"
            className="w-full text-md py-4 sm:py-6 text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </Button>
        </motion.div>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default LaStepThree;
