import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

    console.log(`DIRECT EMAIL TEST: Sending test email to: ${email}`);

    // Initialize Resend with your API key
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is not configured",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    // Send a simple test email
    try {
      console.log(
        "DIRECT EMAIL TEST: Attempting to send test email via Resend"
      );

      // Use the verified domain email address
      const fromEmail = process.env.EMAIL_FROM || "Kredz <admin@kredz.in>";

      const { data, error } = await resend.emails.send({
        from: fromEmail, // Use the verified domain
        to: email,
        subject: "Test Email from Kredz",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
            <h1 style="color: #f97316;">Test Email</h1>
            <p>This is a test email sent from Kredz to verify email functionality.</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> ${fromEmail}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
          </div>
        `,
      });

      if (error) {
        console.error("DIRECT EMAIL TEST: Resend API error:", error);
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            details: error,
          },
          { status: 500 }
        );
      }

      console.log("DIRECT EMAIL TEST: Email sent successfully:", data);
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        data: data,
      });
    } catch (error) {
      console.error("DIRECT EMAIL TEST: Error sending email:", error);
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("DIRECT EMAIL TEST: Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
