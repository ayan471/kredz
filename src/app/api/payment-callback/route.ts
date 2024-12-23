import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    // Log the incoming request details for debugging
    console.log("Payment callback received:", {
      userId,
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    // If no user is authenticated, redirect to sign-in with return URL
    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url);
      // Preserve all query parameters
      searchParams.forEach((value, key) => {
        signInUrl.searchParams.append(key, value);
      });
      signInUrl.searchParams.set("redirect_url", "/payment-callback");
      console.log("Redirecting to sign-in:", signInUrl.toString());
      return NextResponse.redirect(signInUrl);
    }

    // Get payment status from PhonePe callback
    const status = searchParams.get("status");
    const transactionId = searchParams.get("transactionId");
    const merchantId = searchParams.get("merchantId");

    // Log the payment details
    console.log("Payment details:", { status, transactionId, merchantId });

    if (status === "SUCCESS") {
      // Redirect to dashboard with success message
      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("payment", "success");
      dashboardUrl.searchParams.set("txnId", transactionId || "");
      return NextResponse.redirect(dashboardUrl);
    } else {
      // Redirect to error page with payment failure message
      const errorUrl = new URL("/error", request.url);
      errorUrl.searchParams.set("message", "payment-failed");
      errorUrl.searchParams.set("txnId", transactionId || "");
      return NextResponse.redirect(errorUrl);
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    // Redirect to error page with error details
    const errorUrl = new URL("/error", request.url);
    errorUrl.searchParams.set("message", "payment-callback-failed");
    return NextResponse.redirect(errorUrl);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const url = new URL(request.url);

    // Log the incoming POST request
    console.log("Payment POST callback received for user:", userId);

    if (!userId) {
      console.log("Unauthorized POST request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Log the payment notification body
    console.log("Payment notification body:", body);

    // Verify PhonePe payment status
    const { status, transactionId, merchantId } = body;

    if (status === "SUCCESS") {
      // Add your payment success logic here
      // For example, update subscription status, send confirmation email, etc.
      console.log("Payment successful:", { transactionId, merchantId });

      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        data: { transactionId, merchantId },
      });
    } else {
      console.log("Payment failed:", { status, transactionId, merchantId });

      return NextResponse.json(
        {
          success: false,
          message: "Payment failed",
          data: { status, transactionId, merchantId },
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment POST callback error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
