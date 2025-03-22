import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email parameter is required",
        },
        { status: 400 }
      );
    }

    console.log(
      `TEST PAYMENT EMAIL: Sending test payment success email to: ${email}`
    );

    // Use our dedicated payment success notification endpoint
    try {
      const response = await fetch(
        new URL("/api/success-notification", request.url).toString(),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: "Test User",
            amount: "1000.00",
            transactionId: `TEST-${Date.now()}`,
            productName: "Test Product",
            planDetails: "Test Plan Details",
          }),
        }
      );

      // Check response status first
      console.log(
        `TEST PAYMENT EMAIL: Response status: ${response.status}, URL: ${response.url}`
      );

      if (!response.ok) {
        if (response.url.includes("/sign-in")) {
          return NextResponse.json(
            {
              success: false,
              error:
                "API route is protected by authentication. Please make sure the success-notification endpoint is not protected.",
              redirectedTo: response.url,
              status: response.status,
            },
            { status: 500 }
          );
        }

        // For other error statuses
        return NextResponse.json(
          {
            success: false,
            error: `API responded with status ${response.status}`,
            url: response.url,
          },
          { status: response.status }
        );
      }

      // Only try to parse the response as JSON if it's OK
      const result = await response.json();

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? "Test payment email sent successfully"
          : "Failed to send test payment email",
        details: result,
      });
    } catch (error) {
      console.error(
        "TEST PAYMENT EMAIL: Error sending test payment email:",
        error
      );
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("TEST PAYMENT EMAIL: Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
