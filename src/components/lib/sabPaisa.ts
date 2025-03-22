"use server";

import uniqid from "uniqid";

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
    if (cleanOrderId.includes("?")) {
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

    // Generate a unique transaction ID if needed
    const clientTxnId = cleanOrderId || uniqid();

    // Debug log
    console.log("Sabpaisa payment initialization:", {
      clientCode,
      transUserName,
      clientTxnId,
      amount,
      callbackUrl,
      customerEmail,
    });

    // Always add additional randomness to ensure uniqueness, regardless of the input orderId
    const timestamp = Date.now();
    const randomStr1 = Math.random().toString(36).substring(2, 8);
    const randomStr2 = Math.random().toString(36).substring(2, 8);
    const uniqueOrderId =
      `${orderId}-${timestamp}-${randomStr1}-${randomStr2}`.slice(0, 38);
    console.log("Generated guaranteed unique transaction ID:", uniqueOrderId);

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
        clientTxnId: uniqueOrderId,
        amount: amount.toString(),
        payerAddress: customerAddress,
        callbackUrl,
        udf12: planDetails,
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
