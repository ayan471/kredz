/**
 * Checks if the URL contains payment status parameters
 * @param url The URL to check
 * @returns An object with the payment status and transaction ID
 */
export function getPaymentStatusFromUrl(url: string): {
  status: string | null;
  txnId: string | null;
} {
  try {
    const urlObj = new URL(url);
    const status = urlObj.searchParams.get("status");
    const txnId =
      urlObj.searchParams.get("clientTxnId") ||
      urlObj.searchParams.get("sabpaisaTxnId");

    return { status, txnId };
  } catch (error) {
    console.error("Error parsing URL for payment status:", error);
    return { status: null, txnId: null };
  }
}

/**
 * Determines the redirect URL based on payment status
 * @param status The payment status
 * @returns The URL to redirect to
 */
export function getRedirectUrlForStatus(status: string | null): string {
  if (!status) return "/payment-failure";

  return status === "SUCCESS" ? "/payment-success" : "/payment-failure";
}
