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

    const status = searchParams.get("status");
    const transactionId = searchParams.get("transactionId");
    const merchantId = searchParams.get("merchantId");

    console.log("Payment details:", { status, transactionId, merchantId });

    // Instead of redirecting, return JSON response
    if (status === "SUCCESS") {
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
