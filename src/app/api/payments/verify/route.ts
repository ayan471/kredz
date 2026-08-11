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

    console.log("SabPaisa callback params:", params);

    const result = await sabpaisa.verifyCallback(params);

    console.log("SabPaisa verify result:", result);

    // ✅ paidAmountInRupees is already in rupees — use it directly
    const amountInRupees = result.paidAmountInRupees
      ? parseFloat(String(result.paidAmountInRupees)).toFixed(2)
      : result.amountInRupees
        ? parseFloat(String(result.amountInRupees)).toFixed(2)
        : undefined;

    // Determine success: use SDK result first, then fall back to status field
    const status = result.status || (params.status || "").toUpperCase();
    const isSuccess =
      result.success ||
      status === "SUCCESS" ||
      params.status?.toUpperCase() === "SUCCESS";

    return NextResponse.json({
      success: isSuccess,
      signatureValid: result.signatureValid,
      status,
      transactionId: result.transactionId || params.transaction_id,
      orderId: result.merchantTxnId || params.merchant_txn_id,
      amount: amountInRupees,
      message: (result as any).errorMessage || params.message || (isSuccess ? "Payment successful" : "Payment failed"),
    });
  } catch (error: any) {
    console.error("SabPaisa verify error:", error);
    return NextResponse.json(
      { success: false, signatureValid: false, message: error.message },
      { status: 500 },
    );
  }
}
