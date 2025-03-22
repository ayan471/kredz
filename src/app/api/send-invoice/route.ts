import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { formatCurrency } from "../../../components/lib/utils";

// Initialize Resend with your API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Create a nodemailer transporter as a fallback
let fallbackTransporter: any = null;

// Try to initialize the fallback transporter if SMTP credentials are available
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  fallbackTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
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
    if (!resend && !fallbackTransporter) {
      console.error(
        "No email sending method available. Configure RESEND_API_KEY or SMTP settings."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Email sending is not configured",
          config: {
            resend: !!resendApiKey,
            smtp: !!fallbackTransporter,
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

    // Try sending with Resend first
    if (resend) {
      try {
        console.log(
          "API route: Attempting to send invoice email via Resend API"
        );
        const { data: resendData, error } = await resend.emails.send({
          from: process.env.EMAIL_FROM || "Kredz <noreply@kredz.in>",
          to: email,
          subject: `Payment Receipt - ${productName}`,
          html: htmlContent,
        });

        if (error) {
          console.error("Resend API error:", error);
          throw new Error(error.message);
        }

        console.log(
          "API route: Invoice email sent successfully via Resend:",
          resendData
        );
        return NextResponse.json({
          success: true,
          method: "resend",
          data: resendData,
        });
      } catch (resendError) {
        console.error(
          "API route: Error sending via Resend, will try fallback:",
          resendError
        );
        // If Resend fails, we'll try the fallback below
      }
    }

    // Try fallback SMTP if available
    if (fallbackTransporter) {
      try {
        console.log(
          "API route: Attempting to send invoice email via SMTP fallback"
        );
        const info = await fallbackTransporter.sendMail({
          from: process.env.EMAIL_FROM || '"Kredz" <noreply@kredz.in>',
          to: email,
          subject: `Payment Receipt - ${productName}`,
          html: htmlContent,
        });

        console.log(
          "API route: Invoice email sent successfully via SMTP:",
          info
        );
        return NextResponse.json({
          success: true,
          method: "smtp",
          data: info,
        });
      } catch (smtpError) {
        console.error("API route: Error sending via SMTP:", smtpError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to send email via SMTP",
            details:
              smtpError instanceof Error ? smtpError.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email with all available methods",
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
