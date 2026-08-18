// app/api/webhooks/sabpaisa/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { setPaymentStatus, type PaymentStatus } from "@/lib/payment-store";

/**
 * SabPaisa Webhook Endpoint
 *
 * Register this URL with SabPaisa: https://yourdomain.com/api/webhooks/sabpaisa
 *
 * SabPaisa sends a POST with JSON body + HMAC-SHA256 signature in the header:
 *   x-sabpaisa-signature: <hmac-sha256 of raw body using your webhook secret>
 *
 * Webhook payload fields:
 *   event           - "payment.success" | "payment.failed" | "payment.expired" | "payment.timeout"
 *   txn_id          - SabPaisa transaction ID
 *   merchant_txn_id - Your order/reference ID (what you passed during createPayment)
 *   status          - "SUCCESS" | "FAILED" | "EXPIRED" | "TIMEOUT"
 *   request_amount  - number (in rupees)
 *   paid_amount     - number | null
 *   payment_mode    - "UPI" | "CARD" | "NETBANKING" | "WALLET" | null
 *   idempotency_key - "{txn_id}_{status}" — use to deduplicate
 */

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const expected = createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    const signatureHex = signature.replace(/^sha256=/, "");

    // Constant-time comparison to prevent timing attacks
    // Convert Buffers to Uint8Array to satisfy TypeScript types
    return timingSafeEqual(
      Uint8Array.from(Buffer.from(expected, "hex")),
      Uint8Array.from(Buffer.from(signatureHex, "hex")),
    );
  } catch {
    return false;
  }
}

function eventToStatus(event: string, status: string): PaymentStatus {
  if (event === "payment.success" || status === "SUCCESS") return "SUCCESS";
  if (event === "payment.expired" || status === "EXPIRED") return "EXPIRED";
  if (event === "payment.timeout" || status === "TIMEOUT") return "TIMEOUT";
  return "FAILED";
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-sabpaisa-signature") ?? "";
  const webhookSecret = process.env.SABPAISA_WEBHOOK_SECRET ?? "";

  // Log for debugging
  console.log("SabPaisa webhook received:", {
    signatureHeader: signature ? "present" : "missing",
    bodyPreview: rawBody.slice(0, 200),
  });

  // Verify signature if secret is configured
  if (webhookSecret && signature) {
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      console.error("SabPaisa webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else if (webhookSecret && !signature) {
    console.warn("SabPaisa webhook: missing signature header — rejecting");
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  } else {
    // No secret configured — log a warning but allow through (useful during dev)
    console.warn("SABPAISA_WEBHOOK_SECRET not set — skipping signature verification");
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    event = "",
    txn_id = "",
    merchant_txn_id = "",
    status = "",
    paid_amount,
    request_amount,
    payment_mode,
    idempotency_key,
  } = payload;

  const resolvedStatus = eventToStatus(event, status);
  const merchantId = merchant_txn_id || txn_id;

  if (!merchantId) {
    console.error("SabPaisa webhook: missing merchant_txn_id and txn_id");
    return NextResponse.json({ error: "Missing transaction IDs" }, { status: 400 });
  }

  console.log("SabPaisa webhook processed:", {
    event,
    txn_id,
    merchant_txn_id,
    resolvedStatus,
    idempotency_key,
  });

  // Store in memory for the payment-response page to poll
  setPaymentStatus(merchantId, {
    merchantTxnId: merchant_txn_id,
    txnId: txn_id,
    status: resolvedStatus,
    paidAmount: paid_amount ?? request_amount ?? undefined,
    paymentMode: payment_mode ?? undefined,
    event,
    updatedAt: Date.now(),
  });

  // Must respond with 2xx within 10 seconds
  return NextResponse.json({ received: true }, { status: 200 });
}
