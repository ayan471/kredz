"use client";

import { useEffect, useState } from "react";
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
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Removed: SabpaisaPaymentGateway import (modal-based, deleted)
// ✅ Removed: initiateSabpaisaPayment import (old helper, deleted)

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
  const [requestedAmount, setRequestedAmount] = useState<number | null>(null);
  const { user } = useUser();

  // ✅ Removed: showPaymentModal and paymentDetails state

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

          if (user) {
            setValue("emailID", user.emailAddresses[0]?.emailAddress || "");
          }

          const monIncome = Number.parseFloat(result.data.monIncome || "0");
          const membershipPlan = await determineMembershipPlan(monIncome);
          setEligiblePlan(membershipPlan);
          setValue("membershipPlan", membershipPlan);

          setEligibleAmount(result.data.eligibleAmount || null);
          setRequestedAmount(Number.parseFloat(result.data.amtRequired || "0"));

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
              "Instant processing",
              "Exclusive interest rates",
              "24/7 customer support",
            ],
          });
        }
      }
    };
    fetchData();
  }, [searchParams, setValue, form, user]);

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
      // 1. Update loan application data
      const result = await updateLoanApplicationData(id, { ...data, step: 3 });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit loan membership");
      }

      toast({
        title: "Membership submitted",
        description: "Initiating payment...",
      });

      // 2. Calculate total amount including GST
      const totalAmount = Number.parseFloat(
        calculateAmounts(planDetails.discountedPrice).totalAmount,
      );

      // 3. ✅ Call the new SabPaisa API route — credentials stay server-side
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount, // sabpaisa-sdk expects rupees
          customerName: data.fullName,
          customerEmail: data.emailID,
          customerPhone: data.phoneNo,
          description: `${planDetails.name} Membership Plan - Loan Application ${id}`,
          clientReferenceId: id, // use the application ID as correlation key
        }),
      });

      const paymentResult = await res.json();

      if (!paymentResult.success || !paymentResult.checkoutUrl) {
        throw new Error(paymentResult.message || "Failed to initiate payment");
      }

      // 4. ✅ Store txn ID for reference on the return page and redirect
      sessionStorage.setItem("pendingTxnId", paymentResult.merchantTxnId);
      sessionStorage.setItem("loanApplicationId", id);
      window.location.href = paymentResult.checkoutUrl;

      // isSubmitting stays true — page is navigating away
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false); // only reset on failure
    }
  };

  // ✅ Removed: handlePaymentToggle (no modal to toggle)

  return (
    <div className="mx-auto w-full max-w-4xl p-6 space-y-8">
      <Card className="border-2 border-orange-500 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">
            Loan Application - Membership
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {eligibleAmount !== null && requestedAmount !== null && (
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      You are eligible for your requested loan amount:
                    </h2>
                    <p className="text-3xl font-bold">
                      ₹{requestedAmount.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="border-orange-500 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white">
                <CardTitle className="text-2xl font-bold">
                  {planDetails.name} Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                  <div className="text-3xl font-bold mb-4 md:mb-0">
                    ₹{calculateAmounts(planDetails.discountedPrice).basePrice}
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 w-full md:w-auto">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 mr-4">
                        Base Price:
                      </span>
                      <span className="font-medium">
                        ₹
                        {
                          calculateAmounts(planDetails.discountedPrice)
                            .basePrice
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 mr-4">
                        GST (18%):
                      </span>
                      <span className="font-medium">
                        ₹
                        {
                          calculateAmounts(planDetails.discountedPrice)
                            .gstAmount
                        }
                      </span>
                    </div>
                    <div className="border-t border-orange-200 my-2"></div>
                    <div className="flex justify-between items-center mt-2 p-2 bg-orange-100 rounded-md">
                      <span className="font-bold text-blue-900">Total:</span>
                      <span className="font-bold text-lg text-orange-600">
                        ₹
                        {
                          calculateAmounts(planDetails.discountedPrice)
                            .totalAmount
                        }
                      </span>
                    </div>
                    <div className="text-sm text-right mt-1 line-through text-gray-500">
                      Original: ₹{planDetails.realPrice}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-orange-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Input
                  type="hidden"
                  id="membershipPlan"
                  {...register("membershipPlan")}
                />
              </CardContent>
            </Card>

            <Card className="border-orange-500 shadow-md">
              <CardContent className="p-6 space-y-6">
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
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Proceed to Payment"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ✅ Removed: SabpaisaPaymentGateway modal — redirect handles payment now */}

      <DevTool control={control} />
    </div>
  );
};

export default LaStepThree;
