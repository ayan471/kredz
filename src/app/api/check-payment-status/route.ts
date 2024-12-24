import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transactionId");

  if (!transactionId) {
    return NextResponse.json(
      { success: false, message: "Transaction ID is missing" },
      { status: 400 }
    );
  }

  try {
    // Here you would typically make a request to PhonePe's API to check the status
    // For this example, we'll simulate a response
    const paymentStatus = await simulatePaymentStatusCheck(transactionId);

    if (paymentStatus.success) {
      return NextResponse.json({
        success: true,
        message: "Payment successful",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Payment failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while checking payment status",
      },
      { status: 500 }
    );
  }
}

async function simulatePaymentStatusCheck(
  transactionId: string
): Promise<{ success: boolean }> {
  // Simulate an API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate a success/failure response
  return { success: Math.random() < 0.8 }; // 80% success rate for simulation
}
