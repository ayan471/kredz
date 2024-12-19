import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID!,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
          "x-api-version": "2022-09-01",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify payment");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
