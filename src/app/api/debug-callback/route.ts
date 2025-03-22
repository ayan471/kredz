import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Log all request information for debugging
    console.log("DEBUG CALLBACK: Request URL:", request.url);
    console.log("DEBUG CALLBACK: Request method:", request.method);

    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    console.log(
      "DEBUG CALLBACK: All parameters:",
      Object.fromEntries(searchParams.entries())
    );

    // Extract key parameters
    const email = searchParams.get("email") || "test@example.com";
    const name = searchParams.get("name") || "Test User";
    const amount = searchParams.get("amount") || "100.00";
    const transactionId =
      searchParams.get("transactionId") || `TEST-${Date.now()}`;
    const productName = searchParams.get("productName") || "Test Product";
    const planDetails = searchParams.get("planDetails") || "Test Plan";

    // Try to send an email notification
    try {
      console.log(
        "DEBUG CALLBACK: Attempting to send email notification to:",
        email
      );

      // Call the success notification endpoint
      const notificationUrl = new URL("/api/success-notification", request.url);
      console.log(
        "DEBUG CALLBACK: Calling notification URL:",
        notificationUrl.toString()
      );

      const response = await fetch(notificationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          amount,
          transactionId,
          productName,
          planDetails,
        }),
      });

      // Log the response status
      console.log(
        "DEBUG CALLBACK: Notification response status:",
        response.status
      );

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
        console.log(
          "DEBUG CALLBACK: Notification response data:",
          responseData
        );
      } catch (jsonError) {
        const text = await response.text();
        console.log(
          "DEBUG CALLBACK: Notification response text:",
          text.substring(0, 500)
        );
        responseData = {
          error: "Failed to parse JSON response",
          text: text.substring(0, 500),
        };
      }

      return NextResponse.json({
        success: true,
        message: "Debug callback processed",
        email: {
          sent: response.ok,
          status: response.status,
          response: responseData,
        },
        request: {
          url: request.url,
          params: Object.fromEntries(searchParams.entries()),
        },
        config: {
          resendApiKey: process.env.RESEND_API_KEY ? "Set" : "Not set",
          emailFrom: process.env.EMAIL_FROM || "Not set",
          smtpHost: process.env.SMTP_HOST || "Not set",
          smtpUser: process.env.SMTP_USER ? "Set" : "Not set",
        },
      });
    } catch (emailError) {
      console.error(
        "DEBUG CALLBACK: Error sending email notification:",
        emailError
      );
      return NextResponse.json({
        success: false,
        message: "Debug callback processed but email notification failed",
        error:
          emailError instanceof Error ? emailError.message : String(emailError),
        request: {
          url: request.url,
          params: Object.fromEntries(searchParams.entries()),
        },
        config: {
          resendApiKey: process.env.RESEND_API_KEY ? "Set" : "Not set",
          emailFrom: process.env.EMAIL_FROM || "Not set",
          smtpHost: process.env.SMTP_HOST || "Not set",
          smtpUser: process.env.SMTP_USER ? "Set" : "Not set",
        },
      });
    }
  } catch (error) {
    console.error("DEBUG CALLBACK: Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing debug callback",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
