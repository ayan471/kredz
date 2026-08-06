// components/SabpaisaPaymentGateway.tsx
"use client";

import { useState } from "react";

interface SabpaisaPaymentGatewayProps {
  amount: number; // paise
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description?: string;
  onError?: (message: string) => void;
}

export default function SabpaisaPaymentGateway({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  description,
  onError,
}: SabpaisaPaymentGatewayProps) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          customerName,
          customerEmail,
          customerPhone,
          description,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.checkoutUrl) {
        onError?.(data.message || "Could not start payment");
        setLoading(false);
        return;
      }

      // Optionally stash merchantTxnId locally if you want a client-side fallback lookup
      sessionStorage.setItem("pendingTxnId", data.merchantTxnId);

      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      onError?.("Something went wrong starting the payment");
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePay} disabled={loading}>
      {loading ? "Redirecting..." : "Pay Now"}
    </button>
  );
}
