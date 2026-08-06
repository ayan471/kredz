import { NextRequest, NextResponse } from "next/server";
import { SabPaisa } from "sabpaisa-sdk";

const sabpaisa = new SabPaisa({
  merchantId: process.env.SABPAISA_MERCHANT_ID!,
  apiKey: process.env.SABPAISA_API_KEY!,
  secretKey: process.env.SABPAISA_SECRET_KEY!,
  isProduction: process.env.SABPAISA_ENVIRONMENT === "production",
});

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      customerName,
      customerEmail,
      customerPhone,
      description,
      clientReferenceId,
    } = await req.json();

    if (!amount || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const orderId = clientReferenceId || `ORD${Date.now()}`;

    // app/api/payments/create/route.ts
    const response = await sabpaisa.createPayment({
      orderId,
      amount: Math.round(parseFloat(amount)), // ✅ just rupees — no * 100
      customerName,
      customerEmail,
      customerPhone,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment-response`,
      description: description || "Order payment",
    });

    if (!response.success) {
      return NextResponse.json(
        { success: false, message: response.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: sabpaisa.getCheckoutUrl(response),
      merchantTxnId: orderId,
    });
  } catch (error: any) {
    console.error("SabPaisa create payment error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
