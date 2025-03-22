import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    const encResponse = searchParams.get("encResponse");
    const clientCode = searchParams.get("clientCode");

    console.log("Processing membership payment response:", {
      encResponse,
      clientCode,
    });

    // Here you would:
    // 1. Decrypt the encResponse if needed
    // 2. Verify the payment status with Sabpaisa
    // 3. Update your database with the payment status

    // For now, we'll assume success based on the presence of encResponse
    // In a real implementation, you'd determine success by decoding the response
    const isSuccess = encResponse ? true : false;

    // Extract transaction ID if available in the encResponse
    // This would require decoding the encResponse in a real implementation
    const txnId = "MEMBERSHIP-" + Date.now();

    // Redirect based on payment status
    const redirectUrl = isSuccess
      ? `/membership-cards/success?id=${txnId}`
      : `/membership-cards/failure?id=${txnId}`;

    // Redirect the user to the appropriate page
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Error processing membership payment response:", error);
    // Redirect to failure page in case of error
    return NextResponse.redirect(
      new URL("/membership-cards/failure", request.url)
    );
  }
}
