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

    const status = searchParams.get("status");
    const transactionId = searchParams.get("transactionId");
    const merchantId = searchParams.get("merchantId");

    console.log("Payment details:", { status, transactionId, merchantId });

    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set(
        "redirect_url",
        `/payment-result?status=${status}&transactionId=${transactionId}`
      );
      return NextResponse.redirect(signInUrl);
    }

    // Note: The actual payment status should be verified through the webhook
    // This redirect is mainly for user experience
    if (status === "SUCCESS") {
      return NextResponse.redirect(
        new URL(
          `/dashboard?payment=pending&txnId=${transactionId || ""}`,
          request.url
        )
      );
    } else {
      return NextResponse.redirect(
        new URL(
          `/error?message=payment-failed&txnId=${transactionId || ""}`,
          request.url
        )
      );
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(
      new URL("/error?message=payment-callback-failed", request.url)
    );
  }
}
