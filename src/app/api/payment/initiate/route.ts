import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();

    // SabPaisa configuration
    const clientCode = process.env.NEXT_PUBLIC_SABPAISA_CLIENT_CODE;
    const authKey = process.env.SABPAISA_AUTH_KEY;
    const authIV = process.env.SABPAISA_AUTH_IV;
    const sabpaisaUrl =
      process.env.NEXT_PUBLIC_SABPAISA_URL ||
      "https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    // Debug environment variables
    console.log("Environment variables check:");
    console.log("clientCode:", clientCode);
    console.log(
      "authKey:",
      authKey ? `exists (length: ${authKey?.length})` : "missing"
    );
    console.log(
      "authIV:",
      authIV ? `exists (length: ${authIV?.length})` : "missing"
    );
    console.log("sabpaisaUrl:", sabpaisaUrl);
    console.log("appUrl:", appUrl);

    if (!clientCode || !authKey || !authIV) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment gateway configuration is missing",
          details: {
            clientCode: !!clientCode,
            authKey: !!authKey,
            authIV: !!authIV,
          },
        },
        { status: 500 }
      );
    }

    // Generate a unique transaction ID
    const txnId = `LOAN_${requestData.orderId}_${Date.now()}`;

    // Create payload for SabPaisa
    const payload = {
      clientCode,
      transUserName: requestData.customerName,
      transUserEmail: requestData.customerEmail,
      transUserMobile: requestData.customerPhone,
      transUserAmount: requestData.amount.toString(),
      transUserRemark:
        requestData.transUserRemark ||
        `Loan Membership Payment - ${requestData.orderId}`,
      transPaymentType: "CARD", // Default payment type
      transClientTxnId: txnId,
      transCallbackUrl: `${appUrl}/api/payment/callback?orderId=${requestData.orderId}`,
      transFailureCallbackUrl: `${appUrl}/payment/failure?orderId=${requestData.orderId}`,
      transPaymentDetails:
        requestData.transPaymentDetails ||
        `Loan Membership - ${requestData.orderId}`,
    };

    console.log("Payment payload:", JSON.stringify(payload, null, 2));

    // Encrypt the payload using AES-256-CBC
    const encryptedPayload = encryptPayload(
      JSON.stringify(payload),
      authKey,
      authIV
    );

    // FIX: Properly handle the URL construction
    // Check if the base URL already has query parameters
    const baseUrl = sabpaisaUrl;
    const separator = baseUrl.includes("?") ? "&" : "?";

    // Construct the payment URL with the correct separator
    const paymentUrl = `${baseUrl}${separator}clientCode=${encodeURIComponent(clientCode)}&encData=${encodeURIComponent(encryptedPayload)}`;

    console.log("Payment URL generated:", paymentUrl);

    return NextResponse.json({
      success: true,
      paymentUrl,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to initiate payment",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Update the encryptPayload function to handle key length properly and fix type issues
function encryptPayload(payload: string, key: string, iv: string): string {
  try {
    // Create fixed-length key and IV using string padding/truncation instead of Buffer
    // This avoids TypeScript compatibility issues with Buffer and Uint8Array
    let normalizedKey = key;
    if (key.length < 32) {
      // Pad the key to 32 characters
      normalizedKey = key.padEnd(32, "0");
    } else if (key.length > 32) {
      // Truncate the key to 32 characters
      normalizedKey = key.substring(0, 32);
    }

    let normalizedIV = iv;
    if (iv.length < 16) {
      // Pad the IV to 16 characters
      normalizedIV = iv.padEnd(16, "0");
    } else if (iv.length > 16) {
      // Truncate the IV to 16 characters
      normalizedIV = iv.substring(0, 16);
    }

    console.log(
      `Using key length: ${normalizedKey.length}, IV length: ${normalizedIV.length}`
    );

    // Create cipher with normalized key and IV as strings
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      normalizedKey,
      normalizedIV
    );

    let encrypted = cipher.update(payload, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error(
      `Encryption failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
