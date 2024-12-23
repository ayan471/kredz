import { activateCreditBuilderSubscription } from "@/actions/formActions";
import { activateMembership } from "@/actions/loanApplicationActions";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received PhonePe callback:", body);

    // Verify the payment status
    if (body.code === "PAYMENT_SUCCESS") {
      const { merchantId, transactionId, providerReferenceId } = body;

      // Determine the type of activation based on the merchantId prefix
      if (merchantId.startsWith("LA")) {
        // Activate the loan application membership
        const result = await activateMembership(merchantId, transactionId);

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
          merchantId,
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
