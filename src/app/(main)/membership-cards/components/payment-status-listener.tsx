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

      // Determine if this is a membership payment based on the current path
      const isMembershipPayment = pathname.includes("/membership-cards");

      // Determine where to redirect
      let redirectUrl;

      if (isMembershipPayment) {
        // For membership payments, redirect to membership success page
        redirectUrl = `/api/payment/process-membership?encResponse=${encodeURIComponent(encResponse)}`;
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
