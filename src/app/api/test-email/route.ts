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

    console.log(`TEST EMAIL: Attempting to send test email to: ${email}`);

    // Create test data for the email
    const testData = {
      email,
      name: "Test User",
      amount: "100.00",
      transactionId: `TEST-${Date.now()}`,
      productName: "Test Product",
      planDetails: "Test Plan",
    };

    // Call the success notification endpoint
    try {
      const notificationUrl = new URL("/api/success-notification", request.url);
      console.log(`TEST EMAIL: Calling ${notificationUrl.toString()}`);

      const response = await fetch(notificationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      // Log response status
      console.log(`TEST EMAIL: Response status: ${response.status}`);

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
        console.log("TEST EMAIL: Response data:", responseData);
      } catch (jsonError) {
        const text = await response.text();
        console.log("TEST EMAIL: Response text:", text.substring(0, 500));
        responseData = {
          error: "Failed to parse JSON response",
          text: text.substring(0, 500),
        };
      }

      return NextResponse.json({
        success: response.ok,
        message: response.ok
          ? "Test email sent successfully"
          : "Failed to send test email",
        response: responseData,
        config: {
          resendApiKey: process.env.RESEND_API_KEY ? "Set" : "Not set",
          emailFrom: process.env.EMAIL_FROM || "Not set",
          smtpHost: process.env.SMTP_HOST || "Not set",
          smtpUser: process.env.SMTP_USER ? "Set" : "Not set",
        },
      });
    } catch (error) {
      console.error("TEST EMAIL: Error sending test email:", error);
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("TEST EMAIL: Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
