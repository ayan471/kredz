"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function PaymentCallbackHandler() {
  const router = useRouter();
  const { isLoaded, userId, getToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      if (!isLoaded) return;

      try {
        const token = await getToken();
        const response = await fetch("/api/payment-callback", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          router.push(data.redirectUrl);
        } else {
          router.push(data.redirectUrl);
        }
      } catch (error) {
        console.error("Error handling payment callback:", error);
        router.push("/error?message=payment-callback-failed");
      } finally {
        setIsProcessing(false);
      }
    };

    if (isLoaded) {
      handlePaymentCallback();
    }
  }, [isLoaded, userId, getToken, router]);

  if (isProcessing) {
    return <div>Processing payment result...</div>;
  }

  return null;
}
