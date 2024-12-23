import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = auth();

    // If no user is authenticated, redirect to sign-in
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Extract any query parameters if needed
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    // Handle successful payment callback
    // You can add additional logic here based on your requirements

    // Redirect to success page or dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Payment callback error:", error);
    // Redirect to error page with preserved error message
    return NextResponse.redirect(
      new URL("/error?message=payment-callback-failed", request.url)
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Handle POST callback data
    // Add your payment verification logic here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
