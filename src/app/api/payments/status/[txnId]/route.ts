// app/api/payments/status/[txnId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SabPaisa } from "sabpaisa-sdk";
import { getPaymentStatus } from "@/lib/payment-store";

const sabpaisa = new SabPaisa({
  merchantId: process.env.SABPAISA_MERCHANT_ID!,
  apiKey: process.env.SABPAISA_API_KEY!,
  secretKey: process.env.SABPAISA_SECRET_KEY!,
  isProduction: process.env.SABPAISA_ENVIRONMENT === "production",
});

/**
 * Payment Status Polling Endpoint
 *
 * Checks payment status using two approaches:
 * 1. In-memory webhook store (fast, if webhook is registered with SabPaisa)
 * 2. SabPaisa Enquiry API (works without webhook registration)
 *
 * GET /api/payments/status/:txnId
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ txnId: string }> }
) {
  const { txnId } = await params;

  if (!txnId) {
    return NextResponse.json({ error: "Missing txnId" }, { status: 400 });
  }

  const decodedId = decodeURIComponent(txnId);

  // ── 1. Check in-memory webhook store first (fastest path) ──────────────────
  const webhookRecord = getPaymentStatus(decodedId);
  if (webhookRecord) {
    console.log("Status: found in webhook store:", webhookRecord.status);
    return NextResponse.json({
      found: true,
      status: webhookRecord.status,
      success: webhookRecord.status === "SUCCESS",
      txnId: webhookRecord.txnId,
      merchantTxnId: webhookRecord.merchantTxnId,
      amount: webhookRecord.paidAmount ? String(webhookRecord.paidAmount) : undefined,
      paymentMode: webhookRecord.paymentMode,
      source: "webhook",
    });
  }

  // ── 2. Fall back to SabPaisa Enquiry API ───────────────────────────────────
  try {
    console.log("Status: calling SabPaisa enquiry API for txnId:", decodedId);
    const enquiry = await sabpaisa.enquiry(decodedId);

    console.log("Enquiry API response:", JSON.stringify(enquiry));

    if (!enquiry.success) {
      // Transaction not found yet — still processing
      return NextResponse.json({ found: false, source: "enquiry" });
    }

    // Parse status from enquiry response
    // SabPaisa enquiry returns: status, transactionStatus, statusCode, etc.
    const rawStatus: string =
      enquiry.status ||
      enquiry.transactionStatus ||
      enquiry.txnStatus ||
      "";

    const statusUpper = rawStatus.toUpperCase();

    let resolvedStatus: "SUCCESS" | "FAILED" | "PENDING" | "EXPIRED" | "TIMEOUT";
    if (statusUpper === "SUCCESS" || statusUpper === "0000") {
      resolvedStatus = "SUCCESS";
    } else if (statusUpper === "PENDING" || statusUpper === "0100" || statusUpper === "0400") {
      resolvedStatus = "PENDING";
    } else if (statusUpper === "EXPIRED") {
      resolvedStatus = "EXPIRED";
    } else if (statusUpper === "TIMEOUT") {
      resolvedStatus = "TIMEOUT";
    } else if (statusUpper === "FAILED" || statusUpper === "0300" || statusUpper === "404") {
      resolvedStatus = "FAILED";
    } else if (!rawStatus) {
      // Empty status = still processing
      return NextResponse.json({ found: false, source: "enquiry" });
    } else {
      resolvedStatus = "FAILED";
    }

    // PENDING means still processing — keep polling
    if (resolvedStatus === "PENDING") {
      return NextResponse.json({ found: false, source: "enquiry", status: "PENDING" });
    }

    const paidAmount = enquiry.paidAmount || enquiry.paid_amount || enquiry.amount;

    return NextResponse.json({
      found: true,
      status: resolvedStatus,
      success: resolvedStatus === "SUCCESS",
      txnId: enquiry.transactionId || enquiry.txn_id || decodedId,
      merchantTxnId: enquiry.merchantTxnId || decodedId,
      amount: paidAmount ? String(paidAmount) : undefined,
      paymentMode: enquiry.paymentMode || enquiry.payment_mode,
      source: "enquiry",
    });
  } catch (error: any) {
    console.error("Enquiry API error:", error.message);
    // Network error — tell frontend to keep polling
    return NextResponse.json({ found: false, source: "enquiry_error" });
  }
}


