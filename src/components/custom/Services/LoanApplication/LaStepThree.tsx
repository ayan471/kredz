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
import { initiatePhonePePayment } from "@/components/lib/phonePe";
import { useUser } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const { user } = useUser();

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

          // Set email from Clerk
          if (user) {
            setValue("emailID", user.emailAddresses[0]?.emailAddress || "");
          }

          // Determine membership plan based on monthly income
          const monIncome = Number.parseFloat(result.data.monIncome || "0");
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
      const result = await updateLoanApplicationData(id, { ...data, step: 3 });

      if (result.success) {
        toast({
          title: "Membership Submitted!",
          description: "Initiating payment...",
        });

        const paymentResult = await initiatePhonePePayment({
          amount: Number.parseFloat(
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
    <div className="mx-auto w-full max-w-4xl p-6 space-y-8">
      <Card className="border-2 border-orange-500 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">
            Loan Application - Membership
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* <div className="mb-8">
            <Progress
              value={(3 / 6) * 100}
              className="w-full h-3 rounded-full bg-orange-200"
            />
            <div className="flex justify-between mt-4">
              {[
                "Loan Application",
                "Eligibility",
                "Membership",
                "Loan Approval",
                "Loan Agreement",
                "Loan Disbursement",
              ].map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium
                    ${index <= 2 ? "bg-orange-500 text-white" : "bg-orange-100 text-blue-950"}
                    ${index === 2 ? "ring-4 ring-orange-500 ring-offset-2" : ""}`}
                  >
                    {index <= 2 ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 ${index === 2 ? "font-semibold text-blue-950" : "text-gray-500"}`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div> */}

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {eligibleAmount !== null && (
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Your Eligible Loan Amount
                  </h2>
                  <p className="text-3xl font-bold">
                    ₹{eligibleAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="border-orange-500 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-950 text-white">
                <CardTitle className="text-2xl font-bold">
                  {planDetails.name} Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-3xl font-bold">
                    ₹{calculateAmounts(planDetails.discountedPrice).basePrice}
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      + ₹
                      {calculateAmounts(planDetails.discountedPrice).gstAmount}{" "}
                      GST
                    </div>
                    <div className="text-lg font-semibold">
                      Total: ₹
                      {
                        calculateAmounts(planDetails.discountedPrice)
                          .totalAmount
                      }
                    </div>
                    <div className="text-sm line-through text-gray-500">
                      ₹{planDetails.realPrice}
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

      <DevTool control={control} />
    </div>
  );
};

export default LaStepThree;
