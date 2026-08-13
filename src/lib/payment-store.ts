/**
 * Simple in-memory store for payment statuses.
 * The webhook writes here; the /api/payments/status route reads from here.
 * TTL = 10 minutes — enough time for the user to see their result.
 *
 * NOTE: Works well for single-instance deployments and serverless (webhook +
 * status poll typically hit the same instance within seconds on Vercel).
 * For multi-region deployments, replace with Redis/KV.
 */

export type PaymentStatus = "SUCCESS" | "FAILED" | "EXPIRED" | "TIMEOUT" | "PENDING";

export interface PaymentRecord {
  merchantTxnId: string;
  txnId: string;
  status: PaymentStatus;
  paidAmount?: number;
  paymentMode?: string;
  event: string;
  updatedAt: number; // Date.now()
}

const TTL_MS = 10 * 60 * 1000; // 10 minutes

// Global map — survives across requests in the same process
const store = new Map<string, PaymentRecord>();

export function setPaymentStatus(merchantTxnId: string, record: PaymentRecord) {
  store.set(merchantTxnId, record);
  // Also index by sabpaisa txn_id for flexible lookup
  if (record.txnId && record.txnId !== merchantTxnId) {
    store.set(record.txnId, record);
  }
}

export function getPaymentStatus(id: string): PaymentRecord | undefined {
  const record = store.get(id);
  if (!record) return undefined;
  // Evict stale records
  if (Date.now() - record.updatedAt > TTL_MS) {
    store.delete(id);
    return undefined;
  }
  return record;
}
