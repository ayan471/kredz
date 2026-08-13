"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type State = "verifying" | "success" | "failed";

interface PaymentDetails {
  transactionId?: string;
  orderId?: string;
  amount?: string;
  paymentMode?: string;
  message?: string;
}

export default function PaymentResponsePage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<State>("verifying");
  const [details, setDetails] = useState<PaymentDetails>({});

  useEffect(() => {
    // SabPaisa sends all payment data as plain query params in the redirect URL:
    // status, transaction_id, merchant_txn_id, paid_amount, payment_mode, amount, signature
    const status = searchParams.get("status") ?? "";
    const transactionId = searchParams.get("transaction_id") ?? "";
    const merchantTxnId = searchParams.get("merchant_txn_id") ?? "";
    const paidAmount = searchParams.get("paid_amount") ?? searchParams.get("amount") ?? "";
    const paymentMode = searchParams.get("payment_mode") ?? "";

    console.log("Payment response URL params:", {
      status, transactionId, merchantTxnId, paidAmount, paymentMode,
    });

    // Clean up sessionStorage
    sessionStorage.removeItem("pendingTxnId");

    if (!status) {
      // No status in URL — something went wrong with the redirect
      setState("failed");
      setDetails({ message: "Payment response not received. Please contact support if you were charged." });
      return;
    }

    if (status.toUpperCase() === "SUCCESS") {
      setState("success");
      setDetails({
        transactionId,
        orderId: merchantTxnId,
        amount: paidAmount,
        paymentMode,
      });
    } else {
      setState("failed");
      setDetails({
        message:
          status.toUpperCase() === "EXPIRED"
            ? "Payment session expired. No amount was charged."
            : status.toUpperCase() === "TIMEOUT"
              ? "Payment timed out. No amount was charged."
              : "Payment could not be completed. No amount was charged.",
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#EEF2FB] flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-[#1a3faa] rounded-lg flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 22 L16 10 L20 16 L24 10"
              stroke="#f47820"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 22 L24 22"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="text-[22px] font-bold text-[#1a2e6e] tracking-tight">
          K<span className="text-[#f47820]">₹</span>EDZ
        </span>
      </div>

      <div className="bg-white rounded-[20px] border border-gray-100 p-8 w-full max-w-md text-center">
        {/* Verifying */}
        {state === "verifying" && (
          <>
            <div className="w-12 h-12 border-[3px] border-[#E6F1FB] border-t-[#1a3faa] rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-[22px] font-medium text-[#1a2e6e] mb-2">
              Verifying your payment
            </h1>
            <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">
              Please wait while we confirm your transaction. This only takes a
              moment.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Bank-level secure verification
            </div>
          </>
        )}

        {/* Success */}
        {state === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#EAF3DE] flex items-center justify-center mx-auto mb-5 text-[36px]">
              <svg
                className="w-10 h-10 text-[#3B6D11]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-[#EAF3DE] text-[#3B6D11] text-[13px] font-medium px-4 py-1 rounded-full mb-4">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Payment confirmed
            </span>
            <h1 className="text-[22px] font-medium text-[#1a2e6e] mb-2">
              Your plan is now active!
            </h1>
            <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">
              Your Credit Builder subscription has been activated. Start
              building your credit score today.
            </p>

            <div className="bg-[#F7F9FE] rounded-xl p-5 mb-6 text-left space-y-3">
              {details.transactionId && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-gray-500">
                      Transaction ID
                    </span>
                    <span className="text-[13px] font-medium text-[#1a2e6e]">
                      {details.transactionId}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                </>
              )}
              {details.orderId && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-gray-500">Order ID</span>
                    <span className="text-[13px] font-medium text-[#1a2e6e]">
                      {details.orderId}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                </>
              )}
              {details.amount && (
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Amount paid</span>
                  <span className="text-[15px] font-medium text-[#3B6D11]">
                    ₹{details.amount}
                  </span>
                </div>
              )}
            </div>

            <Link
              href="/dashboard"
              className="block w-full py-3.5 bg-[#1a3faa] text-white rounded-full text-[15px] font-medium mb-3 hover:bg-[#1532 8c] transition-opacity hover:opacity-90"
            >
              Go to dashboard →
            </Link>
            <Link
              href="/"
              className="block w-full py-3.5 border-2 border-[#1a3faa] text-[#1a3faa] rounded-full text-[15px] font-medium hover:bg-blue-50 transition-colors"
            >
              Back to home
            </Link>
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-4">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Signature verified · Bank-level security
            </div>
          </>
        )}

        {/* Failed */}
        {state === "failed" && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#FCEBEB] flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-10 h-10 text-[#A32D2D]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-[#FCEBEB] text-[#A32D2D] text-[13px] font-medium px-4 py-1 rounded-full mb-4">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Payment failed
            </span>
            <h1 className="text-[22px] font-medium text-[#1a2e6e] mb-2">
              Payment was not completed
            </h1>
            <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">
              Your payment could not be processed. No amount has been charged to
              your account.
            </p>
            <div className="bg-[#F7F9FE] rounded-xl p-5 mb-6 text-left space-y-3">
              {details.message && (
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Reason</span>
                  <span className="text-[13px] font-medium text-[#A32D2D]">
                    {details.message}
                  </span>
                </div>
              )}
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Need help?</span>
                <a
                  href="mailto:support@kredz.in"
                  className="text-[13px] font-medium text-[#1a3faa]"
                >
                  support@kredz.in
                </a>
              </div>
            </div>
            <Link
              href="/credit-builder-plan"
              className="block w-full py-3.5 bg-[#1a3faa] text-white rounded-full text-[15px] font-medium mb-3 hover:opacity-90 transition-opacity"
            >
              Try again →
            </Link>
            <Link
              href="/"
              className="block w-full py-3.5 border-2 border-[#1a3faa] text-[#1a3faa] rounded-full text-[15px] font-medium hover:bg-blue-50 transition-colors"
            >
              Back to home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
