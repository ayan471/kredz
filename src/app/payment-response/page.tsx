"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type State = "verifying" | "success" | "failed" | "invalid_signature";

interface PaymentDetails {
  transactionId?: string;
  orderId?: string;
  amount?: string;
  message?: string;
}

export default function PaymentResponsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>("verifying");
  const [details, setDetails] = useState<PaymentDetails>({});

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => (params[k] = v));

    fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.signatureValid) {
          setState("invalid_signature");
          return;
        }
        if (result.success) {
          setState("success");
          setDetails({
            transactionId: result.transactionId,
            orderId: result.orderId,
            amount: result.amount,
          });
        } else {
          setState("failed");
          setDetails({ message: result.message });
        }
      })
      .catch(() => {
        setState("failed");
        setDetails({ message: "Could not verify payment status." });
      });
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

        {/* Invalid signature */}
        {state === "invalid_signature" && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#FAEEDA] flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-10 h-10 text-[#854F0B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-[#FAEEDA] text-[#854F0B] text-[13px] font-medium px-4 py-1 rounded-full mb-4">
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
                  d="M12 9v2m0 4h.01"
                />
              </svg>
              Verification failed
            </span>
            <h1 className="text-[22px] font-medium text-[#1a2e6e] mb-2">
              Invalid payment signature
            </h1>
            <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">
              This payment response could not be verified. If you believe this
              is an error, please contact our support team immediately.
            </p>
            <div className="bg-[#F7F9FE] rounded-xl p-5 mb-6 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">
                  Contact support
                </span>
                <a
                  href="mailto:support@kredz.in"
                  className="text-[13px] font-medium text-[#1a3faa]"
                >
                  support@kredz.in
                </a>
              </div>
            </div>
            <Link
              href="/"
              className="block w-full py-3.5 bg-[#1a3faa] text-white rounded-full text-[15px] font-medium hover:opacity-90 transition-opacity"
            >
              Go to home →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
