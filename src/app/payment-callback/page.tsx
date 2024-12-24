"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PaymentCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "failure">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Collect all search params
        const params = new URLSearchParams(searchParams);
        console.log("Received params in client:", Object.fromEntries(params));

        // If no params are received, try to get them from localStorage
        if (params.toString() === "") {
          const storedParams = localStorage.getItem("paymentParams");
          if (storedParams) {
            console.log("Using stored params:", storedParams);
            const parsedParams = new URLSearchParams(storedParams);
            parsedParams.forEach((value, key) => {
              params.append(key, value);
            });
          }
        } else {
          // Store the params in localStorage
          localStorage.setItem("paymentParams", params.toString());
        }

        // If still no params, redirect to an error page
        if (params.toString() === "") {
          console.error("No parameters received and none stored");
          router.push("/payment-error");
          return;
        }

        const response = await fetch(
          `/api/check-payment-status?${params.toString()}`
        );
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Payment successful");
        } else {
          setStatus("failure");
          setMessage(data.message || "Payment failed");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setStatus("failure");
        setMessage("An error occurred while checking payment status");
      }
    };

    checkPaymentStatus();
  }, [searchParams, router]);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>
            {status === "loading"
              ? "Checking payment status..."
              : "Your payment status is shown below"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {status === "loading" && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
          {status === "success" && (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Payment Successful
              </h3>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          )}
          {status === "failure" && (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Payment Failed
              </h3>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
