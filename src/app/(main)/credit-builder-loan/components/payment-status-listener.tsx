"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function PaymentStatusListener() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we have payment response parameters
    const encResponse = searchParams.get("encResponse");
    const clientCode = searchParams.get("clientCode");

    // If we have an encResponse, it's a payment callback
    if (encResponse) {
      console.log("Payment response detected in URL", {
        pathname,
        encResponse,
      });

      // Extract transaction ID if available
      const clientTxnId = searchParams.get("clientTxnId") || "";

      // Handle the loan eligibility result page specifically
      if (pathname.includes("/loan-eligibility-result")) {
        // Extract application ID from the URL or eligibleAmount parameter
        let applicationId = searchParams.get("applicationId") || "";

        // If eligibleAmount contains nested parameters (a sign of malformed URL)
        const eligibleAmount = searchParams.get("eligibleAmount") || "";
        if (eligibleAmount.includes("?clientCode=")) {
          // Extract the actual eligible amount
          applicationId = searchParams.get("applicationId") || "";
        }

        console.log("Detected loan eligibility payment", { applicationId });

        // Redirect to the processing API with clean parameters
        const redirectUrl = `/api/payment/process-faster?encResponse=${encodeURIComponent(encResponse)}&applicationId=${applicationId}`;

        console.log("Redirecting to:", redirectUrl);
        router.push(redirectUrl);
        return;
      }

      // Determine payment type based on the current path or transaction ID prefix
      const isMembershipPayment = pathname.includes("/membership-cards");
      const isFasterProcessingPayment = clientTxnId.startsWith("FASTER-");

      // Determine where to redirect
      let redirectUrl;

      if (isMembershipPayment) {
        // For membership payments
        redirectUrl = `/api/payment/process-membership?encResponse=${encodeURIComponent(encResponse)}`;
        if (clientCode) {
          redirectUrl += `&clientCode=${encodeURIComponent(clientCode)}`;
        }
      } else if (isFasterProcessingPayment) {
        // For faster processing payments
        // Extract application ID from clientTxnId if available
        let applicationId = "";
        if (clientTxnId && clientTxnId.startsWith("FASTER-")) {
          applicationId = clientTxnId.replace("FASTER-", "");
        }

        redirectUrl = `/api/payment/process-faster?encResponse=${encodeURIComponent(encResponse)}`;
        if (applicationId) {
          redirectUrl += `&applicationId=${applicationId}`;
        }
        if (clientCode) {
          redirectUrl += `&clientCode=${encodeURIComponent(clientCode)}`;
        }
      } else {
        // For loan application payments, use the existing process route
        let id = searchParams.get("id") || clientTxnId;
        if (id && id.includes("?")) {
          id = id.split("?")[0];
        }
        redirectUrl = `/api/payment/process?id=${id}&encResponse=${encodeURIComponent(encResponse)}`;
      }

      console.log("Redirecting to:", redirectUrl);
      router.push(redirectUrl);
    }
  }, [searchParams, router, pathname]);

  // This component doesn't render anything
  return null;
}
