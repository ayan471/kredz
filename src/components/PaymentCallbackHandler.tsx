"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentCallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        const response = await fetch("/api/payment-callback");
        const data = await response.json();

        if (data.success) {
          router.push(data.redirectUrl);
        } else {
          router.push(data.redirectUrl);
        }
      } catch (error) {
        console.error("Error handling payment callback:", error);
        router.push("/error?message=payment-callback-failed");
      }
    };

    handlePaymentCallback();
  }, [router]);

  return <div>Processing payment result...</div>;
}
