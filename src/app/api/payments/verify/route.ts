// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { decryptSabpaisaResponse } from "@/components/lib/sabpaisa-decrypt";

/**
 * SabPaisa sends back an encrypted `encResponse` query param to the returnUrl.
 * This route decrypts it and returns a clean success/failure result.
 *
 * StatusCode mapping (SabPaisa docs):
 *   0000 → SUCCESS
 *   0300 → FAILED
 *   0100 → PENDING
 *   0200 → ABORTED
 *   0999 → UNKNOWN
 */
function resolveStatus(code: string): { isSuccess: boolean; txnStatus: string } {
  switch (code) {
    case "0000":
      return { isSuccess: true, txnStatus: "SUCCESS" };
    case "0100":
    case "0400":
      return { isSuccess: false, txnStatus: "PENDING" };
    case "0200":
      return { isSuccess: false, txnStatus: "ABORTED" };
    case "0300":
    case "404":
      return { isSuccess: false, txnStatus: "FAILED" };
    default:
      if (code === "SUCCESS") return { isSuccess: true, txnStatus: "SUCCESS" };
      if (code === "FAILED") return { isSuccess: false, txnStatus: "FAILED" };
      return { isSuccess: false, txnStatus: "UNKNOWN" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    console.log("SabPaisa verify - raw params keys:", Object.keys(params));

    const authkey = process.env.SABPAISA_AUTH_KEY ?? "";
    const authiv = process.env.SABPAISA_AUTH_IV ?? "";

    let statusCode = "";
    let clientTxnId = "";
    let transactionId = "";
    let amount = "";
    let paidAmount = "";
    let payerName = "";
    let payerEmail = "";

    const encResponse = params.encResponse ?? params.enc_response ?? "";

    if (encResponse) {
      // ✅ Decrypt the encrypted response from SabPaisa
      const decrypted = decryptSabpaisaResponse(encResponse, authkey, authiv);

      if (!decrypted) {
        console.error("SabPaisa verify: decryption failed");
        return NextResponse.json({
          success: false,
          status: "FAILED",
          message: "Could not decrypt payment response. Please contact support.",
        });
      }

      console.log("SabPaisa verify - decrypted:", decrypted);

      statusCode = decrypted.statusCode ?? decrypted.transactionStatus ?? decrypted.status ?? "";
      clientTxnId = decrypted.clientTxnId ?? decrypted.sabpaisaTxnId ?? "";
      transactionId = decrypted.sabpaisaTxnId ?? decrypted.transactionId ?? clientTxnId;
      amount = decrypted.amount ?? "0";
      paidAmount = decrypted.paidAmount ?? decrypted.amount ?? "0";
      payerName = decrypted.payerName ?? "";
      payerEmail = decrypted.payerEmail ?? decrypted.udf12 ?? "";
    } else {
      // Fallback: plain-text params (staging / no encryption)
      statusCode =
        params.statusCode ?? params.status ?? params.transactionStatus ?? "";
      clientTxnId = params.clientTxnId ?? params.merchant_txn_id ?? "";
      transactionId = params.sabpaisaTxnId ?? params.transaction_id ?? clientTxnId;
      amount = String(params.amount ?? "0");
      paidAmount = String(params.paidAmount ?? params.paid_amount ?? amount);
      payerName = params.payerName ?? params.customerName ?? "";
      payerEmail = params.payerEmail ?? "";
    }

    console.log("SabPaisa verify - resolved:", { statusCode, clientTxnId, transactionId });

    const { isSuccess, txnStatus } = resolveStatus(
      (statusCode ?? "").toUpperCase()
    );

    // Parse amount — SabPaisa may send in paise or rupees depending on integration
    const amountNum = parseFloat(paidAmount || amount) || 0;
    // Heuristic: if > 10000 it's likely paise, convert to rupees
    const amountDisplay =
      amountNum > 10000
        ? (amountNum / 100).toFixed(2)
        : amountNum.toFixed(2);

    return NextResponse.json({
      success: isSuccess,
      status: txnStatus,
      transactionId: transactionId || clientTxnId,
      orderId: clientTxnId,
      amount: amountNum > 0 ? amountDisplay : undefined,
      payerName,
      payerEmail,
      message: isSuccess
        ? "Payment successful"
        : txnStatus === "PENDING"
          ? "Payment is pending"
          : "Payment failed or was cancelled",
    });
  } catch (error: any) {
    console.error("SabPaisa verify error:", error);
    return NextResponse.json(
      { success: false, status: "FAILED", message: error.message },
      { status: 500 },
    );
  }
}

