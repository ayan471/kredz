"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function PaymentStatusListener() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Don't clear transaction IDs immediately - we'll do this after successful redirection
    // This helps prevent empty IDs in success pages

    // Log all search params for debugging
    const allParams = Object.fromEntries(searchParams.entries());
    if (Object.keys(allParams).length > 0) {
      console.log("URL parameters detected:", { pathname, params: allParams });
    }

    // Check if we have payment response parameters
    const encResponse = searchParams.get("encResponse");
    const clientCode = searchParams.get("clientCode");
    const txnStatus =
      searchParams.get("txnStatus") || searchParams.get("status");
    const plan = searchParams.get("plan");

    // Special handling for malformed credit-builder/form URL
    if (
      pathname.includes("/credit-builder-plan/form") &&
      (encResponse || clientCode)
    ) {
      console.log("Detected malformed credit builder payment response URL");

      // Extract client transaction ID from various possible sources
      let clientTxnId =
        searchParams.get("clientTxnId") ||
        searchParams.get("sabpaisaTxnId") ||
        "";

      // If no transaction ID in URL, try localStorage
      if (!clientTxnId) {
        clientTxnId =
          localStorage.getItem("creditBuilderTxnId") ||
          localStorage.getItem("lastSabpaisaTxnId") ||
          "";
        console.log("Retrieved transaction ID from localStorage:", clientTxnId);
      }

      // If still no ID, generate a fallback one
      if (!clientTxnId) {
        clientTxnId = `CB-FALLBACK-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        console.log("Generated fallback transaction ID:", clientTxnId);

        // Store the generated ID in localStorage
        localStorage.setItem("creditBuilderTxnId", clientTxnId);
        localStorage.setItem("lastSabpaisaTxnId", clientTxnId);
      }

      // Determine payment status - assume success if encResponse exists
      const status = "SUCCESS";

      // Determine the correct base path
      const basePath = "/credit-builder-plan";

      // Try to send a direct notification about the payment
      try {
        const email =
          searchParams.get("payerEmail") ||
          localStorage.getItem("lastPayerEmail") ||
          "";
        if (email) {
          // Use the absolute URL for the success notification endpoint
          const notificationUrl = new URL(
            "/api/success-notification",
            window.location.origin
          ).toString();
          console.log("Sending success notification to:", notificationUrl);

          fetch(notificationUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              name: searchParams.get("payerName") || "Customer",
              amount: searchParams.get("amount") || "0",
              transactionId: clientTxnId,
              productName: "Credit Builder Subscription",
              planDetails: "Credit Builder Plan",
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log("Success notification result:", data))
            .catch((error) =>
              console.error("Error sending success notification:", error)
            );
        }
      } catch (error) {
        console.error("Error sending direct notification:", error);
      }

      // Redirect to the success page
      const redirectUrl = `${basePath}/payment-success?id=${clientTxnId}`;
      console.log("Redirecting from malformed URL to:", redirectUrl);
      router.push(redirectUrl);
      return;
    }

    // If we have payment response parameters (encResponse, clientCode, or txnStatus)
    if (encResponse || clientCode || txnStatus) {
      console.log("Payment response detected in URL", {
        pathname,
        encResponse,
        clientCode,
        txnStatus,
      });

      // Extract transaction ID from various possible parameters
      let clientTxnId =
        searchParams.get("clientTxnId") ||
        searchParams.get("sabpaisaTxnId") ||
        searchParams.get("id") ||
        "";

      // If transaction ID is still empty, try to extract from other parameters
      if (!clientTxnId || clientTxnId === "") {
        // Check if it's in the plan parameter (malformed URL case)
        const planParam = searchParams.get("plan");
        if (planParam && planParam.includes("clientTxnId=")) {
          const match = planParam.match(/clientTxnId=([^&]+)/);
          if (match && match[1]) {
            clientTxnId = match[1];
            console.log(
              "Extracted clientTxnId from plan parameter:",
              clientTxnId
            );
          }
        }

        // Check if it's in the udf12 parameter (we store email here, but sometimes txnId gets mixed in)
        const udf12Param = searchParams.get("udf12");
        if (!clientTxnId && udf12Param && udf12Param.includes("CB-")) {
          clientTxnId = udf12Param;
          console.log(
            "Extracted clientTxnId from udf12 parameter:",
            clientTxnId
          );
        }

        // If still no ID, try localStorage
        if (!clientTxnId) {
          clientTxnId =
            localStorage.getItem("creditBuilderTxnId") ||
            localStorage.getItem("lastSabpaisaTxnId") ||
            "";
          console.log("Retrieved clientTxnId from localStorage:", clientTxnId);
        }

        // Last resort: generate a new one
        if (!clientTxnId) {
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 10);
          clientTxnId = `CB-FALLBACK-${timestamp}-${randomStr}`;
          console.log("Generated new fallback clientTxnId:", clientTxnId);
        }
      }

      // Store the transaction ID in localStorage for recovery if needed
      localStorage.setItem("creditBuilderTxnId", clientTxnId);
      localStorage.setItem("lastSabpaisaTxnId", clientTxnId);
      console.log("Stored txnId in localStorage:", clientTxnId);

      // Extract email from various possible sources
      const email =
        searchParams.get("payerEmail") ||
        searchParams.get("udf12") || // We store email in udf12 as backup
        localStorage.getItem("lastPayerEmail") ||
        "";

      // Store email in localStorage if found
      if (email && email.includes("@")) {
        localStorage.setItem("lastPayerEmail", email);
        console.log("Stored email in localStorage:", email);
      }

      // Get payment status from URL
      const status = txnStatus || searchParams.get("status") || "FAILED";

      // Try to send a success notification directly if we have an email
      if ((status === "SUCCESS" || encResponse) && email) {
        try {
          // Use the absolute URL for the success notification endpoint
          const notificationUrl = new URL(
            "/api/success-notification",
            window.location.origin
          ).toString();
          console.log("Sending success notification to:", notificationUrl);

          fetch(notificationUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              name: searchParams.get("payerName") || "Customer",
              amount: searchParams.get("amount") || "0",
              transactionId: clientTxnId,
              productName: pathname.includes("/credit-builder-plan")
                ? "Credit Builder Subscription"
                : pathname.includes("/membership-cards")
                  ? "Membership"
                  : "Payment",
              planDetails: searchParams.get("udf12") || "Standard Plan",
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log("Success notification result:", data))
            .catch((error) =>
              console.error("Error sending success notification:", error)
            );
        } catch (error) {
          console.error("Error sending success notification:", error);
        }
      }

      // Handle loan eligibility result page specifically
      if (pathname.includes("/loan-eligibility-result")) {
        console.log("Detected loan eligibility payment response");

        // Extract application ID from the URL or from the transaction ID
        let applicationId = searchParams.get("applicationId") || "";

        // If no application ID but we have a transaction ID that starts with FASTER-
        if (
          !applicationId &&
          clientTxnId &&
          clientTxnId.startsWith("FASTER-")
        ) {
          applicationId = clientTxnId.replace("FASTER-", "");
        }

        // If eligibleAmount contains nested parameters (a sign of malformed URL)
        const eligibleAmount = searchParams.get("eligibleAmount") || "";
        if (eligibleAmount && eligibleAmount.includes("?clientCode=")) {
          // Try to extract application ID from localStorage
          const storedAppId = localStorage.getItem(
            "lastFasterProcessingApplication"
          );
          if (storedAppId) {
            applicationId = storedAppId;
          }
        }

        console.log("Loan eligibility payment details:", {
          applicationId,
          status,
        });

        // Redirect to the processing API with clean parameters
        const redirectUrl = `/api/payment/process-faster?encResponse=${encodeURIComponent(encResponse || "")}&applicationId=${applicationId}&status=${status}&clientTxnId=${clientTxnId}`;

        console.log("Redirecting to:", redirectUrl);
        router.push(redirectUrl);
        return;
      }

      // Handle credit builder form page
      if (pathname.includes("/credit-builder-plan/form")) {
        console.log("Detected credit builder payment response", {
          clientTxnId,
          encResponse,
          status,
          allParams,
          email,
        });

        // Determine the correct base path
        const basePath = "/credit-builder-plan";

        // Redirect to the appropriate success/failure page with the correct path
        const redirectUrl =
          status === "SUCCESS" || encResponse
            ? `${basePath}/payment-success?id=${clientTxnId}`
            : `${basePath}/payment-failure?id=${clientTxnId}`;

        console.log("Redirecting to:", redirectUrl);
        router.push(redirectUrl);
        return;
      }

      // Only run the rest of the logic on specific pages
      if (
        pathname.includes("/consultancy-application/membership") ||
        pathname.includes("/loan-application/step-three") ||
        pathname.includes("/membership-cards")
      ) {
        // Handle Sabpaisa response format
        if (clientCode) {
          console.log("Sabpaisa payment response detected with clientCode");

          // Determine if this is a membership payment based on the URL
          const isMembershipPayment = pathname.includes("/membership-cards");

          // Redirect to the appropriate page based on payment type and status
          if (isMembershipPayment) {
            // Fix the path for membership success/failure
            router.push(
              status === "SUCCESS"
                ? `/membership-cards/success?id=${clientTxnId}`
                : `/membership-cards/failure?id=${clientTxnId}`
            );
          } else {
            // For loan applications and consultancy, use the process API
            router.push(
              `/api/payment/process?id=${clientTxnId}&encResponse=${encResponse || ""}&status=${status}`
            );
          }
        }
        // Keep the existing logic for other payment types
        else if (encResponse) {
          let id = searchParams.get("id");

          if (id) {
            console.log("Payment response detected with ID parameter");

            // Clean the ID - remove any additional query parameters
            if (id.includes("?")) {
              id = id.split("?")[0];
            }

            // Redirect to a processing page that will handle the payment verification
            router.push(
              `/api/payment/process?id=${id}&encResponse=${encResponse}`
            );
          }
        }
      }
    }
  }, [searchParams, router, pathname]);

  // This component doesn't render anything
  return null;
}
