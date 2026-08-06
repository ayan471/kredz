import { decryptSabpaisaResponse } from "@/components/lib/sabpaisa-decrypt";
import { type NextRequest, NextResponse } from "next/server";

// ─── types ────────────────────────────────────────────────────────────────────

type TxnStatus = "SUCCESS" | "FAILED" | "ABORTED" | "PENDING" | "UNKNOWN";

type CallbackParams = {
  statusCode: string;
  clientTxnId: string;
  payerEmail: string;
  payerName: string;
  amount: string;
  planDetails: string;
  requestUrl: string;
};

// ─── service registry ─────────────────────────────────────────────────────────

type ServiceConfig = {
  productName: string;
  successPath: (id: string) => string;
  failurePath: (id: string) => string;
  pendingPath: (id: string) => string;
};

const SERVICE_REGISTRY: Record<string, ServiceConfig> = {
  "CB-": {
    productName: "Credit Builder Subscription",
    successPath: (id) => `/credit-builder-plan/payment-success?id=${id}`,
    failurePath: (id) => `/credit-builder-plan/payment-failure?id=${id}`,
    pendingPath: (id) => `/credit-builder-plan/payment-pending?id=${id}`,
  },
  "MC-": {
    productName: "Membership",
    successPath: (id) => `/membership-cards/success?id=${id}`,
    failurePath: (id) => `/membership-cards/failure?id=${id}`,
    pendingPath: (id) => `/membership-cards/payment-pending?id=${id}`,
  },
};

const DEFAULT_SERVICE: ServiceConfig = {
  productName: "Payment",
  successPath: (id) => `/payment-success?id=${id}`,
  failurePath: (id) => `/payment-failure?id=${id}`,
  pendingPath: (id) => `/payment-pending?id=${id}`,
};

function getServiceConfig(clientTxnId: string): ServiceConfig {
  for (const [prefix, config] of Object.entries(SERVICE_REGISTRY)) {
    if (clientTxnId.startsWith(prefix)) return config;
  }
  return DEFAULT_SERVICE;
}

// ─── status resolver ──────────────────────────────────────────────────────────

function resolveStatus(statusCode: string): {
  txnStatus: TxnStatus;
  isSuccess: boolean;
} {
  switch (statusCode) {
    case "0000":
      return { txnStatus: "SUCCESS", isSuccess: true };
    case "0300":
      return { txnStatus: "FAILED", isSuccess: false };
    case "0100":
      return { txnStatus: "PENDING", isSuccess: false };
    case "0200":
      return { txnStatus: "ABORTED", isSuccess: false };
    case "0999":
      return { txnStatus: "UNKNOWN", isSuccess: false };
    case "0400":
      return { txnStatus: "PENDING", isSuccess: false };
    case "404":
      return { txnStatus: "FAILED", isSuccess: false };
    default:
      console.warn("Unrecognised SabPaisa statusCode:", statusCode);
      return { txnStatus: "UNKNOWN", isSuccess: false };
  }
}

// ─── redirect helper ──────────────────────────────────────────────────────────

function getRedirectPath(txnStatus: TxnStatus, clientTxnId: string): string {
  const id = encodeURIComponent(clientTxnId);
  const service = getServiceConfig(clientTxnId);

  switch (txnStatus) {
    case "SUCCESS":
      return service.successPath(id);
    case "PENDING":
    case "UNKNOWN":
      return service.pendingPath(id);
    default:
      return service.failurePath(id); // FAILED, ABORTED
  }
}

// ─── email helper ─────────────────────────────────────────────────────────────

async function sendSuccessEmail(params: {
  email: string;
  name: string;
  amount: string;
  txnId: string;
  planDetails: string;
  requestUrl: string;
}) {
  if (!params.email) return;
  const service = getServiceConfig(params.txnId);

  try {
    const notificationUrl = new URL(
      "/api/success-notification",
      params.requestUrl,
    ).toString();

    const res = await fetch(notificationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: params.email,
        name: params.name,
        amount: params.amount,
        transactionId: params.txnId,
        productName: service.productName,
        planDetails: params.planDetails || "Standard Plan",
      }),
    });

    console.log("Success email result:", await res.json());
  } catch (err) {
    console.error("Success email error:", err);
  }
}

// ─── shared core ──────────────────────────────────────────────────────────────

async function handleCallback(params: CallbackParams): Promise<NextResponse> {
  const cleanId = params.clientTxnId.split("?")[0] || `FALLBACK-${Date.now()}`;

  console.log("Payment callback:", {
    statusCode: params.statusCode,
    cleanId,
  });

  const { txnStatus, isSuccess } = resolveStatus(params.statusCode);

  // TODO: update your DB here
  // await db.transaction.upsert({ where: { clientTxnId: cleanId }, ... })

  if (isSuccess && params.payerEmail) {
    await sendSuccessEmail({
      email: params.payerEmail,
      name: params.payerName,
      amount: params.amount,
      txnId: cleanId,
      planDetails: params.planDetails,
      requestUrl: params.requestUrl,
    });
  }

  const redirectPath = getRedirectPath(txnStatus, cleanId);
  return NextResponse.redirect(new URL(redirectPath, params.requestUrl));
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    return await handleCallback({
      statusCode: form.get("statusCode")?.toString() ?? "",
      clientTxnId: form.get("clientTxnId")?.toString() ?? "",
      payerEmail:
        form.get("payerEmail")?.toString() ??
        (form.get("udf12")?.toString()?.includes("@")
          ? form.get("udf12")!.toString()
          : ""),
      payerName: form.get("payerName")?.toString() ?? "Customer",
      amount: form.get("amount")?.toString() ?? "0",
      planDetails: form.get("udf12")?.toString() ?? "",
      requestUrl: request.url,
    });
  } catch (error) {
    console.error("CALLBACK POST error:", error);
    return NextResponse.redirect(new URL("/payment-failure", request.url));
  }
}

// ─── GET handler ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;
    const encResponse = p.get("encResponse") ?? "";

    console.log("CALLBACK GET raw params:", Object.fromEntries(p.entries()));

    let statusCode = "";
    let clientTxnId = "";
    let payerEmail = "";
    let payerName = "Customer";
    let amount = "0";
    let planDetails = "";

    if (encResponse) {
      const authkey = process.env.SABPAISA_AUTH_KEY ?? "";
      const authiv = process.env.SABPAISA_AUTH_IV ?? "";

      const decrypted = decryptSabpaisaResponse(encResponse, authkey, authiv);

      if (!decrypted) {
        console.error("CALLBACK GET: decryption failed");
        return NextResponse.redirect(new URL("/payment-failure", request.url));
      }

      statusCode = decrypted.statusCode ?? decrypted.transactionStatus ?? "";
      clientTxnId = decrypted.clientTxnId ?? decrypted.sabpaisaTxnId ?? "";
      payerEmail = decrypted.payerEmail ?? decrypted.udf12 ?? "";
      payerName = decrypted.payerName ?? "Customer";
      amount = decrypted.amount ?? "0";
      planDetails = decrypted.udf12 ?? "";

      console.log("CALLBACK GET decrypted:", {
        statusCode,
        clientTxnId,
        payerEmail,
        amount,
      });
    } else {
      // Fallback for staging / plain-text responses
      statusCode = p.get("statusCode") ?? "";
      clientTxnId = p.get("clientTxnId") ?? p.get("sabpaisaTxnId") ?? "";
      payerEmail =
        p.get("payerEmail") ??
        (p.get("udf12")?.includes("@") ? p.get("udf12")! : "");
      payerName = p.get("payerName") ?? "Customer";
      amount = p.get("amount") ?? "0";
      planDetails = p.get("udf12") ?? "";
    }

    if (!clientTxnId) {
      console.error("CALLBACK GET: no clientTxnId after decryption");
      return NextResponse.redirect(new URL("/payment-failure", request.url));
    }

    return await handleCallback({
      statusCode,
      clientTxnId,
      payerEmail,
      payerName,
      amount,
      planDetails,
      requestUrl: request.url,
    });
  } catch (error) {
    console.error("CALLBACK GET error:", error);
    return NextResponse.redirect(new URL("/payment-failure", request.url));
  }
}
