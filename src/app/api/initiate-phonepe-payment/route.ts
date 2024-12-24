import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";

const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_API_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
const PHONEPE_SALT_INDEX = "1";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const body = await request.json();
    console.log("Received request body:", body);

    if (!PHONEPE_SALT_KEY || !PHONEPE_MERCHANT_ID) {
      console.error("PhonePe Salt Key or Merchant ID is missing");
      return NextResponse.json(
        { error: "PhonePe configuration is incomplete" },
        { status: 500 }
      );
    }

    const { amount, orderId, customerName, customerPhone, customerEmail } =
      body;

    if (
      !amount ||
      !orderId ||
      !customerName ||
      !customerPhone ||
      !customerEmail
    ) {
      console.error("Missing required fields:", body);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      console.error("Invalid amount:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: userId || customerPhone,
      amount: Math.round(amount * 100),
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-callback`,
      redirectMode: "POST",
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe-webhook`,
      mobileNumber: customerPhone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    console.log("PhonePe payload:", payload);

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const checksum = crypto
      .createHash("sha256")
      .update(`${base64Payload}/pg/v1/pay${PHONEPE_SALT_KEY}`)
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
        { error: "Failed to initiate payment with PhonePe" },
        { status: phonePeResponse.status }
      );
    }

    const responseData = await phonePeResponse.json();
    console.log(JSON.stringify(responseData));

    if (responseData.success) {
      return NextResponse.json({
        success: true,
        paymentUrl: responseData.data.instrumentResponse.redirectInfo.url,
      });
    } else {
      console.error("PhonePe API error:", responseData);
      return NextResponse.json(
        {
          success: false,
          error:
            responseData.message || "Failed to initiate payment with PhonePe",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in PhonePe payment initiation:", error);
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
