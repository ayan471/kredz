import { NextResponse } from "next/server";
import crypto from "crypto";
import { activateCreditBuilderSubscription } from "@/actions/formActions";
import { activateMembership } from "@/actions/loanApplicationActions";

const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const xVerify = request.headers.get("X-VERIFY");
    console.log(body);

    if (!xVerify || !PHONEPE_SALT_KEY) {
      console.error("Missing X-VERIFY header or PHONEPE_SALT_KEY");
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Verify the signature
    const [receivedChecksum, receivedSaltIndex] = xVerify.split("###");
    const payload = JSON.stringify(body);
    const computedChecksum =
      crypto
        .createHash("sha256")
        .update(payload + PHONEPE_SALT_KEY)
        .digest("hex") +
      "###" +
      PHONEPE_SALT_INDEX;

    if (computedChecksum !== xVerify) {
      console.error("Checksum verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Process the webhook payload
    const {
      merchantId,
      transactionId,
      merchantTransactionId,
      amount,
      paymentState,
    } = body;

    console.log("Received webhook:", {
      merchantId,
      transactionId,
      merchantTransactionId,
      amount,
      paymentState,
    });

    if (paymentState === "COMPLETED") {
      // Extract userId from merchantTransactionId (format: CB-userId-timestamp or LA-userId-timestamp)
      const userId = merchantTransactionId.split("-")[1];
      if (!userId) {
        console.error(
          "Invalid merchantTransactionId format:",
          merchantTransactionId
        );
        return NextResponse.json(
          { error: "Invalid merchantTransactionId format" },
          { status: 400 }
        );
      }

      if (merchantTransactionId.startsWith("LA")) {
        // Activate the loan application membership
        const result = await activateMembership(userId, transactionId);
        if (!result.success) {
          console.error(
            "Failed to activate loan application membership:",
            result.error
          );
          return NextResponse.json(
            { error: "Failed to activate loan application membership" },
            { status: 500 }
          );
        }
      } else if (merchantTransactionId.startsWith("CB")) {
        // Activate the Credit Builder subscription
        const result = await activateCreditBuilderSubscription(
          userId,
          transactionId
        );
        if (!result.success) {
          console.error(
            "Failed to activate Credit Builder subscription:",
            result.error
          );
          return NextResponse.json(
            { error: "Failed to activate Credit Builder subscription" },
            { status: 500 }
          );
        }
      } else {
        console.error(
          "Invalid merchantTransactionId prefix:",
          merchantTransactionId
        );
        return NextResponse.json(
          { error: "Invalid merchantTransactionId prefix" },
          { status: 400 }
        );
      }

      return NextResponse.json({ status: "OK" });
    } else if (paymentState === "FAILED") {
      // Handle failed payment
      console.log("Payment failed:", { merchantTransactionId, transactionId });
      // Implement any necessary actions for failed payments
      return NextResponse.json({ status: "OK" });
    }

    // For other payment states, just acknowledge receipt
    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Error processing PhonePe webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
