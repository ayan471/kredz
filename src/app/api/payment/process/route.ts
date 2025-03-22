import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const encResponse = searchParams.get("encResponse");

    console.log("Processing payment response:", { id, encResponse });

    // Here you would:
    // 1. Decrypt the encResponse if needed
    // 2. Verify the payment status with Sabpaisa
    // 3. Update your database with the payment status

    // For now, we'll assume success and redirect
    // In a real implementation, you'd determine success based on the response
    const isSuccess = true;

    // Redirect based on payment status with the clean ID
    const redirectUrl = isSuccess
      ? `/payment-success?id=${id}`
      : `/payment-failure?id=${id}`;

    // Redirect the user to the appropriate page
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Error processing payment response:", error);
    // Redirect to failure page in case of error
    return NextResponse.redirect(new URL("/payment-failure", request.url));
  }
}
