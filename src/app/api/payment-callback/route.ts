import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const stateParam = url.searchParams.get("state");

    if (!stateParam) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-error`
      );
    }

    // Decode the state parameter
    const state = JSON.parse(Buffer.from(stateParam, "base64").toString());

    // Redirect to the success page with the state information
    const successUrl = new URL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`
    );
    successUrl.searchParams.set("orderId", state.orderId);
    successUrl.searchParams.set("timestamp", state.timestamp.toString());

    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error("Error in payment callback:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-error`
    );
  }
}
