import { NextResponse } from "next/server";
import crypto from "crypto";

const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = "1";

var PAYMENT_DATASTORE = new Map();

export async function POST(request: Request) {
  const payload = await request.json();
  console.log(payload);
  // const xVerify = request.headers.get("X-VERIFY");

  // if (!xVerify) {
  //   return NextResponse.json(
  //     { error: "Missing X-VERIFY header" },
  //     { status: 400 }
  //   );
  // }

  // if (!PHONEPE_SALT_KEY) {
  //   console.error("PhonePe Salt Key is missing");
  //   return NextResponse.json(
  //     { error: "PhonePe configuration is incomplete" },
  //     { status: 500 }
  //   );
  // }

  // // Verify the webhook signature
  // const calculatedHash = crypto
  //   .createHash("sha256")
  //   .update(body + PHONEPE_SALT_KEY)
  //   .digest("hex");
  // const [receivedHash, receivedIndex] = xVerify.split("###");

  // if (calculatedHash !== receivedHash || receivedIndex !== PHONEPE_SALT_INDEX) {
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  // }

  // Process the webhook payload
  // const payload = JSON.parse(body);
  // console.log("Received webhook payload:", payload);

  // Here you would typically update your database with the payment status
  // For this example, we'll just log the status
  const { merchantId, merchantTransactionId, transactionId, amount, success } =
    payload;

  console.log(`${transactionId} ${success}`);
  PAYMENT_DATASTORE.set(transactionId, success);

  // console.log(`Payment status for transaction ${transactionId}: ${success}`);

  // Respond to PhonePe
  return NextResponse.json({ status: "OK" });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transactionId");

  console.log(transactionId);

  if (!transactionId) {
    return NextResponse.json(
      { error: "Missing transactionId parameter" },
      { status: 400 }
    );
  }

  const status = PAYMENT_DATASTORE.get(transactionId);

  if (status === undefined) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ status });
}
