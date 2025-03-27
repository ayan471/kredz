import { type NextRequest, NextResponse } from "next/server";
import uniqid from "uniqid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      planDetails,
    } = body;

    // Check if this is a faster processing payment
    const isFasterProcessing = orderId && orderId.startsWith("FASTER-");

    // Extract application ID if it's a faster processing payment
    let applicationId = "";
    if (isFasterProcessing) {
      applicationId = orderId.replace("FASTER-", "");
    }

    // Hardcoded values for Sabpaisa credentials
    const clientCode = process.env.NEXT_PUBLIC_SABPAISA_CLIENT_CODE;
    const transUserName = process.env.NEXT_PUBLIC_SABPAISA_USER_NAME;
    const transUserPassword = process.env.NEXT_PUBLIC_SABPAISA_USER_PASSWORD;
    const authkey = process.env.SABPAISA_AUTH_KEY;
    const authiv = process.env.SABPAISA_AUTH_IV;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Set the callback URL to point directly to the appropriate processing endpoint
    let callbackUrl;
    if (isFasterProcessing) {
      // For faster processing payments, redirect directly to the success/failure page
      callbackUrl = `${appUrl}/api/payment/process-faster?applicationId=${applicationId}`;
    } else {
      // For other payments, use the general callback
      callbackUrl = `${appUrl}/api/payment/callback`;
    }

    // Ensure the orderId is clean (no query parameters)
    let cleanOrderId = orderId;
    if (cleanOrderId && cleanOrderId.includes("?")) {
      cleanOrderId = cleanOrderId.split("?")[0];
    }

    // Generate a unique transaction ID with multiple random components
    const timestamp = Date.now();
    const randomStr1 = Math.random().toString(36).substring(2, 8);
    const randomStr2 = Math.random().toString(36).substring(2, 8);
    const randomStr3 = Math.random().toString(36).substring(2, 6);
    const randomStr4 = Math.random().toString(36).substring(2, 6);
    const clientTxnId = cleanOrderId
      ? `${cleanOrderId}-${timestamp}-${randomStr1}-${randomStr3}`.slice(0, 38)
      : `${uniqid()}-${timestamp}-${randomStr2}-${randomStr4}`.slice(0, 38);

    console.log("API generated unique transaction ID:", clientTxnId);

    // Debug log
    console.log("Sabpaisa payment initialization:", {
      clientCode,
      transUserName,
      clientTxnId,
      amount,
      callbackUrl,
    });

    // Return the payment details to be used by the client component
    return NextResponse.json({
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
        clientTxnId,
        amount: amount.toString(),
        payerAddress: "Not Provided",
        callbackUrl,
        udf12: planDetails || "",
      },
    });
  } catch (error) {
    console.error("Error initiating Sabpaisa payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate payment. Please try again later.",
      },
      { status: 500 }
    );
  }
}
