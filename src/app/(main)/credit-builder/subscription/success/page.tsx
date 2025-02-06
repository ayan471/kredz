"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitCreditBuilderSubscription } from "@/actions/formActions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function PaymentStatus() {
  const [status, setStatus] = useState<"success" | "failure" | "processing">(
    "processing"
  );
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setStatus("failure");
        return;
      }

      try {
        const response = await fetch(`/api/verify-payment?order_id=${orderId}`);
        const data = await response.json();

        if (data.order_status === "PAID") {
          setStatus("success");
          // Submit the subscription
          const result = await submitCreditBuilderSubscription({
            fullName: data.customer_details.customer_name,
            phoneNo: data.customer_details.customer_phone,
            plan: data.order_meta.plan,
          });

          if (result.success) {
            toast({
              title: "Subscription Activated!",
              description: "Your Credit Builder plan is now active.",
            });
          } else {
            throw new Error(result.error || "Failed to activate subscription");
          }
        } else {
          setStatus("failure");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("failure");
      }
    };

    verifyPayment();
  }, [orderId, toast]);

  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">
          {status === "success"
            ? "Payment Successful!"
            : status === "failure"
              ? "Payment Failed"
              : "Processing Payment..."}
        </h1>
        <p className="text-gray-600 mb-6">
          {status === "success"
            ? "Your Credit Builder subscription has been activated."
            : status === "failure"
              ? "There was an issue processing your payment. Please try again."
              : "Please wait while we confirm your payment..."}
        </p>
        {status !== "processing" && (
          <Button onClick={handleContinue}>
            {status === "success" ? "Go to Dashboard" : "Try Again"}
          </Button>
        )}
      </div>
    </div>
  );
}
