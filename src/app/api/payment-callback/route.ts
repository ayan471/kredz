import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    console.log("Payment callback received:", {
      userId,
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    const state = searchParams.get("state");
    const status = searchParams.get("status");
    const transactionId = searchParams.get("transactionId");
    const merchantId = searchParams.get("merchantId");

    // Verify the state parameter
    // For example: const isValidState = await verifyState(userId, state);
    // if (!isValidState) {
    //   return NextResponse.json({ success: false, error: "Invalid state" }, { status: 400 });
    // }

    console.log("Payment details:", { status, transactionId, merchantId });

    if (status === "SUCCESS") {
      // Process successful payment
      // For example: await processSuccessfulPayment(userId, transactionId);

      return NextResponse.json({
        success: true,
        message: "Payment successful",
        redirectUrl: `/dashboard?payment=success&txnId=${transactionId || ""}`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Payment failed",
        redirectUrl: `/error?message=payment-failed&txnId=${transactionId || ""}`,
      });
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json({
      success: false,
      message: "Payment callback failed",
      redirectUrl: "/error?message=payment-callback-failed",
    });
  }
}
