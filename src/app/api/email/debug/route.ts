import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

// Initialize all possible email services
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Create a nodemailer transporter for SMTP
let smtpTransporter: any = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Create a Gmail transporter as a last resort
let gmailTransporter: any = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email") || "test@example.com";
    const subject = searchParams.get("subject") || "Test Email";
    const method = searchParams.get("method") || "all";

    console.log(`Debug email request: email=${email}, method=${method}`);

    const results: any = {
      timestamp: new Date().toISOString(),
      email,
      subject,
      method,
      environment: process.env.NODE_ENV,
      services: {
        resend: {
          configured: !!resendApiKey,
          from: process.env.EMAIL_FROM || "noreply@kredz.in",
        },

        smtp: {
          configured: !!smtpTransporter,
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER ? "configured" : "not configured",
        },
        gmail: {
          configured: !!gmailTransporter,
          user: process.env.GMAIL_USER,
        },
      },
      attempts: [],
    };

    // Simple HTML content for test email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
        <h1 style="color: #f97316;">Test Email</h1>
        <p>This is a test email sent from Kredz to verify email functionality.</p>
        <p><strong>Method:</strong> ${method}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
      </div>
    `;

    // Update the Resend section to use the verified domain

    // Try Resend if configured and requested
    if ((method === "all" || method === "resend") && resend) {
      try {
        console.log("Attempting to send email via Resend");

        // Use the verified domain email address
        const fromEmail = process.env.EMAIL_FROM || "Kredz <admin@kredz.in>";

        const { data, error } = await resend.emails.send({
          from: fromEmail, // Use the verified domain
          to: email,
          subject: `${subject} (Resend)`,
          html: htmlContent,
        });

        results.attempts.push({
          service: "resend",
          success: !error,
          data: data || null,
          error: error || null,
          timestamp: new Date().toISOString(),
        });

        if (error) {
          console.error("Resend API error:", error);
        } else {
          console.log("Email sent successfully via Resend:", data);
        }
      } catch (error) {
        console.error("Exception sending via Resend:", error);
        results.attempts.push({
          service: "resend",
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Try SendGrid if configured and requested

    // Try SMTP if configured and requested
    if ((method === "all" || method === "smtp") && smtpTransporter) {
      try {
        console.log("Attempting to send email via SMTP");
        const info = await smtpTransporter.sendMail({
          from: process.env.EMAIL_FROM || '"Kredz" <noreply@kredz.in>',
          to: email,
          subject: `${subject} (SMTP)`,
          html: htmlContent,
        });

        results.attempts.push({
          service: "smtp",
          success: true,
          data: info,
          timestamp: new Date().toISOString(),
        });

        console.log("Email sent successfully via SMTP:", info);
      } catch (error) {
        console.error("Error sending via SMTP:", error);
        results.attempts.push({
          service: "smtp",
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Try Gmail as a last resort if configured and requested
    if ((method === "all" || method === "gmail") && gmailTransporter) {
      try {
        console.log("Attempting to send email via Gmail");
        const info = await gmailTransporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: `${subject} (Gmail)`,
          html: htmlContent,
        });

        results.attempts.push({
          service: "gmail",
          success: true,
          data: info,
          timestamp: new Date().toISOString(),
        });

        console.log("Email sent successfully via Gmail:", info);
      } catch (error) {
        console.error("Error sending via Gmail:", error);
        results.attempts.push({
          service: "gmail",
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Check if any attempt was successful
    const anySuccess = results.attempts.some((attempt: any) => attempt.success);

    return NextResponse.json(
      {
        success: anySuccess,
        message: anySuccess
          ? "Email sent successfully with at least one method"
          : "All email sending methods failed",
        results,
      },
      { status: anySuccess ? 200 : 500 }
    );
  } catch (error) {
    console.error("Error in debug email endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
