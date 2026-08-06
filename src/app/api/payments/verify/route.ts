// app/api/payments/verify/route.ts
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
    const params = await req.json();
    const result = await sabpaisa.verifyCallback(params);

    if (!result.signatureValid) {
      return NextResponse.json({
        signatureValid: false,
        message: "Invalid signature",
      });
    }

    // ✅ paidAmountInRupees is already in rupees — just format it for display
    const amountInRupees = result.paidAmountInRupees
      ? (parseFloat(result.paidAmountInRupees) * 100).toFixed(2)
      : undefined;

    return NextResponse.json({
      success: result.success,
      signatureValid: true,
      transactionId: result.transactionId,
      orderId: result.merchantTxnId,
      amount: amountInRupees,
      message: result.errorMessage,
    });
  } catch (error: any) {
    console.error("SabPaisa verify error:", error);
    return NextResponse.json(
      { signatureValid: false, message: error.message },
      { status: 500 },
    );
  }
}
