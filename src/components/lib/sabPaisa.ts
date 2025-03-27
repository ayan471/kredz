"use server";

type SabpaisaPaymentParams = {
  amount: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  planDetails?: string;
  callbackUrl?: string;
};

export async function initiateSabpaisaPayment({
  amount,
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  customerAddress = "Not Provided",
  planDetails = "",
  callbackUrl: customCallbackUrl,
}: SabpaisaPaymentParams) {
  try {
    // Ensure the orderId is clean (no query parameters)
    let cleanOrderId = orderId;
    if (cleanOrderId && cleanOrderId.includes("?")) {
      cleanOrderId = cleanOrderId.split("?")[0];
    }

    // Hardcoded values for Sabpaisa credentials
    const clientCode = process.env.NEXT_PUBLIC_SABPAISA_CLIENT_CODE;
    const transUserName = process.env.NEXT_PUBLIC_SABPAISA_USER_NAME;
    const transUserPassword = process.env.NEXT_PUBLIC_SABPAISA_USER_PASSWORD;
    const authkey = process.env.SABPAISA_AUTH_KEY;
    const authiv = process.env.SABPAISA_AUTH_IV;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Set the callback URL to the API route
    const callbackUrl = `${appUrl}/api/payment/callback`;

    // Generate a completely new unique transaction ID every time
    // This is the key change - we're not using the orderId directly in the transaction ID
    const timestamp = Date.now();
    const randomStr1 = Math.random().toString(36).substring(2, 8);
    const randomStr2 = Math.random().toString(36).substring(2, 8);
    const randomStr3 = Math.random().toString(36).substring(2, 6);

    // Create a prefix based on the order ID type
    let prefix = "TXN";
    if (cleanOrderId && cleanOrderId.startsWith("FASTER-")) {
      prefix = "FASTER";
    } else if (cleanOrderId && cleanOrderId.startsWith("CB-")) {
      prefix = "CB";
    } else if (cleanOrderId && cleanOrderId.startsWith("MC-")) {
      prefix = "MC";
    }

    // Generate a completely new unique ID that doesn't directly include the original orderId
    const uniqueClientTxnId =
      `${prefix}-${timestamp}-${randomStr1}-${randomStr2}-${randomStr3}`.slice(
        0,
        38
      );

    console.log(
      "Generated guaranteed unique transaction ID:",
      uniqueClientTxnId
    );

    // Debug log
    console.log("Sabpaisa payment initialization:", {
      clientCode,
      transUserName,
      uniqueClientTxnId,
      amount,
      callbackUrl,
      customerEmail,
    });

    // Return the payment details to be used by the client component
    return {
      success: true,
      paymentDetails: {
        clientCode,
        transUserName,
        transUserPassword,
        authkey,
        authiv,
        payerName: customerName,
        payerEmail: customerEmail,
        payerMobile: customerPhone,
        clientTxnId: uniqueClientTxnId,
        amount: amount.toString(),
        payerAddress: customerAddress,
        callbackUrl,
        udf12: planDetails,
        // Store the original orderId in a custom field for reference
        udf13: cleanOrderId || "",
      },
    };
  } catch (error) {
    console.error("Error initiating Sabpaisa payment:", error);
    return {
      success: false,
      error: "Failed to initiate payment. Please try again later.",
    };
  }
}
