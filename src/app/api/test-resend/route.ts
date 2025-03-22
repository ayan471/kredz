import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email") || "kredz.tech@gmail.com"; // Default to the verified email

    // Get the API key from environment variables
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is not configured in environment variables",
          env: process.env.NODE_ENV,
        },
        { status: 500 }
      );
    }

    // Initialize Resend with the API key
    const resend = new Resend(resendApiKey);

    // Update the test email endpoint to use the verified domain

    // Try to send a test email
    console.log("RESEND TEST: Attempting to send test email to:", email);

    // Use the verified domain email address
    const fromEmail = process.env.EMAIL_FROM || "Kredz <admin@kredz.in>";

    const { data, error } = await resend.emails.send({
      from: fromEmail, // Use the verified domain
      to: email,
      subject: "Test Email from Resend API",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h1 style="color: #f97316;">Resend Test Email</h1>
      <p>This is a test email sent directly from the Resend API to verify email functionality.</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
      <p><strong>From:</strong> ${fromEmail}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
    </div>
  `,
    });

    if (error) {
      console.error("RESEND TEST: API error:", error);

      // Check if this is the testing mode restriction error
      if (
        error.message.includes(
          "You can only send testing emails to your own email address"
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Resend Testing Mode Restriction",
            details: error,
            solution:
              "Your Resend account is in testing mode. You can only send emails to kredz.tech@gmail.com until you verify a domain.",
            nextSteps: [
              "1. Visit https://resend.com/domains to verify your domain",
              "2. Once verified, update your EMAIL_FROM environment variable to use your verified domain",
              "3. Try sending a test email to kredz.tech@gmail.com in the meantime to verify the API works",
            ],
            testUrl: `/api/test-resend?email=kredz.tech@gmail.com`,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
          apiKeyConfigured: !!resendApiKey,
          env: process.env.NODE_ENV,
        },
        { status: 500 }
      );
    }

    console.log("RESEND TEST: Email sent successfully:", data);

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      data: data,
      apiKeyConfigured: !!resendApiKey,
      env: process.env.NODE_ENV,
      emailFrom: process.env.EMAIL_FROM || "Not configured",
    });
  } catch (error) {
    console.error("RESEND TEST: Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        apiKeyConfigured: !!process.env.RESEND_API_KEY,
        env: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }
}
