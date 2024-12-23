import { activateCreditBuilderSubscription } from "@/actions/formActions";
import { activateMembership } from "@/actions/loanApplicationActions";
import { NextResponse } from "next/server";
import crypto from "crypto";

const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY;
const PHONEPE_SALT_INDEX = "1"; // Make sure this matches your PhonePe settings

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received PhonePe callback:", body);

    // Verify the signature
    const xVerify = request.headers.get("X-VERIFY");
    if (!xVerify || !PHONEPE_API_KEY) {
      console.error("Missing X-VERIFY header or API key");
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const [receivedChecksum, receivedSaltIndex] = xVerify.split("###");
    const calculatedChecksum = crypto
      .createHash("sha256")
      .update(JSON.stringify(body) + PHONEPE_API_KEY)
      .digest("hex");

    if (
      receivedChecksum !== calculatedChecksum ||
      receivedSaltIndex !== PHONEPE_SALT_INDEX
    ) {
      console.error("Checksum verification failed");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Verify the payment status
    if (body.code === "PAYMENT_SUCCESS") {
      const { merchantId, transactionId, providerReferenceId } = body;

      // Extract userId from merchantId (format: CB-userId-timestamp or LA-userId-timestamp)
      const userId = merchantId.split("-")[1];
      if (!userId) {
        console.error("Invalid merchantId format:", merchantId);
        return NextResponse.json(
          { success: false, error: "Invalid merchantId format" },
          { status: 400 }
        );
      }

      // Determine the type of activation based on the merchantId prefix
      if (merchantId.startsWith("LA")) {
        // Activate the loan application membership
        const result = await activateMembership(userId, transactionId);

        if (result.success) {
          return NextResponse.json({
            success: true,
            message: "Loan application membership activated successfully",
          });
        } else {
          console.error(
            "Failed to activate loan application membership:",
            result.error
          );
          return NextResponse.json(
            {
              success: false,
              error: "Failed to activate loan application membership",
            },
            { status: 500 }
          );
        }
      } else if (merchantId.startsWith("CB")) {
        // Activate the Credit Builder subscription
        const result = await activateCreditBuilderSubscription(
          userId,
          transactionId
        );

        if (result.success) {
          return NextResponse.json({
            success: true,
            message: "Credit Builder subscription activated successfully",
          });
        } else {
          console.error(
            "Failed to activate Credit Builder subscription:",
            result.error
          );
          return NextResponse.json(
            {
              success: false,
              error: "Failed to activate Credit Builder subscription",
            },
            { status: 500 }
          );
        }
      } else {
        console.error("Invalid merchantId prefix:", merchantId);
        return NextResponse.json(
          { success: false, error: "Invalid merchantId prefix" },
          { status: 400 }
        );
      }
    } else {
      console.error("Payment failed:", body);
      return NextResponse.json(
        { success: false, error: "Payment failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing PhonePe callback:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
