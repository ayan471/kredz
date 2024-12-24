import { NextResponse } from "next/server";
import crypto from "crypto";

const PHONEPE_API_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status";
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY;
const PHONEPE_SALT_INDEX = "1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const transactionId = searchParams.get("transactionId");
  const merchantId = searchParams.get("merchantId");
  const merchantTransactionId = searchParams.get("merchantTransactionId");

  if (!code || !transactionId || !merchantId || !merchantTransactionId) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters" },
      { status: 400 }
    );
  }

  if (!PHONEPE_MERCHANT_ID || !PHONEPE_API_KEY) {
    console.error("PhonePe API key or Merchant ID is missing");
    return NextResponse.json(
      { success: false, message: "PhonePe configuration is incomplete" },
      { status: 500 }
    );
  }

  try {
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      transactionId: transactionId,
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const checksum = crypto
      .createHash("sha256")
      .update(`${base64Payload}/pg/v1/status${PHONEPE_API_KEY}`)
      .digest("hex");

    const phonePeResponse = await fetch(PHONEPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": `${checksum}###${PHONEPE_SALT_INDEX}`,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    if (!phonePeResponse.ok) {
      const errorText = await phonePeResponse.text();
      console.error("PhonePe API error response:", errorText);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to check payment status with PhonePe",
        },
        { status: phonePeResponse.status }
      );
    }

    const responseData = await phonePeResponse.json();

    if (responseData.success) {
      const paymentStatus = responseData.data.state;
      if (paymentStatus === "COMPLETED") {
        return NextResponse.json({
          success: true,
          message: "Payment successful",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: `Payment ${paymentStatus.toLowerCase()}`,
        });
      }
    } else {
      console.error("PhonePe API error:", responseData);
      return NextResponse.json(
        {
          success: false,
          message: responseData.message || "Failed to check payment status",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while checking payment status",
      },
      { status: 500 }
    );
  }
}
