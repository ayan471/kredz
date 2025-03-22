import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { formatCurrency } from "@/components/lib/utils";

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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      email,
      name,
      amount,
      transactionId,
      paymentDate,
      productName,
      planDetails,
    } = data;

    console.log("API route: Sending invoice email with data:", {
      email,
      name,
      amount,
      transactionId,
      paymentDate,
      productName,
      planDetails,
    });

    // Validate email
    if (!email || !email.includes("@")) {
      console.error("Invalid email address:", email);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 }
      );
    }

    // Check if we have any email sending method available
    if (!resend && !smtpTransporter && !gmailTransporter) {
      console.error(
        "No email sending method available. Configure at least one email service."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Email sending is not configured",
          config: {
            resend: !!resendApiKey,

            smtp: !!smtpTransporter,
            gmail: !!gmailTransporter,
          },
        },
        { status: 500 }
      );
    }

    // Format the payment date
    const formattedDate = new Date(paymentDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format the amount
    const formattedAmount = formatCurrency(Number.parseFloat(amount), "INR");

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${transactionId.slice(-4)}`;

    // Create the email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .invoice {
            border: 1px solid #ddd;
            padding: 20px;
            margin-top: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #f97316;
            padding-bottom: 10px;
          }
          .logo {
            max-width: 150px;
            margin-bottom: 10px;
          }
          .invoice-details {
            margin-bottom: 20px;
          }
          .invoice-details div {
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
          }
          .total {
            font-weight: bold;
            font-size: 18px;
            text-align: right;
            margin-top: 20px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>Payment Receipt</h1>
          </div>
          
          <div class="invoice-details">
            <div><strong>Invoice Number:</strong> ${invoiceNumber}</div>
            <div><strong>Date:</strong> ${formattedDate}</div>
            <div><strong>Transaction ID:</strong> ${transactionId}</div>
          </div>
          
          <div class="customer-details">
            <h3>Customer Information</h3>
            <div><strong>Name:</strong> ${name}</div>
            <div><strong>Email:</strong> ${email}</div>
          </div>
          
          <h3>Order Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Details</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${productName}</td>
                <td>${planDetails}</td>
                <td>${formattedAmount}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total">
            Total: ${formattedAmount}
          </div>
          
          <div class="footer">
            <p>Thank you for your payment. If you have any questions, please contact our support team.</p>
            <p>&copy; ${new Date().getFullYear()} Kredz. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const results: any = {
      attempts: [],
    };

    // Update the Resend section to use the verified domain

    // Try Resend first
    if (resend) {
      try {
        console.log(
          "API route: Attempting to send invoice email via Resend API"
        );

        // Use the verified domain email address
        const fromEmail = process.env.EMAIL_FROM || "Kredz <admin@kredz.in>";

        const { data: resendData, error } = await resend.emails.send({
          from: fromEmail, // Use the verified domain
          to: email,
          subject: `Payment Receipt - ${productName}`,
          html: htmlContent,
        });

        results.attempts.push({
          service: "resend",
          success: !error,
          data: resendData || null,
          error: error || null,
        });

        if (!error) {
          console.log(
            "API route: Invoice email sent successfully via Resend:",
            resendData
          );
          return NextResponse.json({
            success: true,
            method: "resend",
            data: resendData,
            results,
          });
        } else {
          console.error("Resend API error:", error);
          // Continue to try other methods
        }
      } catch (resendError) {
        console.error("API route: Error sending via Resend:", resendError);
        results.attempts.push({
          service: "resend",
          success: false,
          error:
            resendError instanceof Error
              ? resendError.message
              : String(resendError),
        });
        // Continue to try other methods
      }
    }

    // Try SendGrid if configured

    // Try SMTP if configured
    if (smtpTransporter) {
      try {
        console.log(
          "API route: Attempting to send invoice email via SMTP fallback"
        );
        const info = await smtpTransporter.sendMail({
          from: process.env.EMAIL_FROM || '"Kredz" <noreply@kredz.in>',
          to: email,
          subject: `Payment Receipt - ${productName}`,
          html: htmlContent,
        });

        results.attempts.push({
          service: "smtp",
          success: true,
          data: info,
        });

        console.log(
          "API route: Invoice email sent successfully via SMTP:",
          info
        );
        return NextResponse.json({
          success: true,
          method: "smtp",
          data: info,
          results,
        });
      } catch (smtpError) {
        console.error("API route: Error sending via SMTP:", smtpError);
        results.attempts.push({
          service: "smtp",
          success: false,
          error:
            smtpError instanceof Error ? smtpError.message : String(smtpError),
        });
        // Continue to try Gmail as last resort
      }
    }

    // Try Gmail as a last resort
    if (gmailTransporter) {
      try {
        console.log("API route: Attempting to send invoice email via Gmail");
        const info = await gmailTransporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: `Payment Receipt - ${productName}`,
          html: htmlContent,
        });

        results.attempts.push({
          service: "gmail",
          success: true,
          data: info,
        });

        console.log(
          "API route: Invoice email sent successfully via Gmail:",
          info
        );
        return NextResponse.json({
          success: true,
          method: "gmail",
          data: info,
          results,
        });
      } catch (gmailError) {
        console.error("API route: Error sending via Gmail:", gmailError);
        results.attempts.push({
          service: "gmail",
          success: false,
          error:
            gmailError instanceof Error
              ? gmailError.message
              : String(gmailError),
        });
      }
    }

    // If we get here, all methods failed
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email with all available methods",
        results,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("API route: Error in send-invoice:", error);
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
