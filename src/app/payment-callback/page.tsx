"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const handleCallback = async () => {
      try {
        if (!isSignedIn) return;

        const status = searchParams.get("status");
        const transactionId = searchParams.get("transactionId");

        // Log the callback parameters
        console.log("Payment callback parameters:", {
          status,
          transactionId,
          isSignedIn,
        });

        if (status === "SUCCESS") {
          router.push(`/dashboard?payment=success&txnId=${transactionId}`);
        } else {
          router.push(`/dashboard?payment=failed&txnId=${transactionId}`);
        }
      } catch (error) {
        console.error("Payment callback error:", error);
        router.push("/dashboard?payment=error");
      }
    };

    handleCallback();
  }, [isLoaded, isSignedIn, router, searchParams]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-gray-600 mb-6">
          Please sign in to complete your payment process.
        </p>
        <Button
          onClick={() => {
            const currentUrl = window.location.href;
            router.push(
              `/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`
            );
          }}
        >
          Sign In to Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Your Payment</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Please wait while we verify your payment...
        </p>
      </div>
    </div>
  );
}
