import { formatCurrency } from "@/components/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// IMPORTANT: This route should NOT be protected by authentication
// since it needs to be accessible by payment callbacks
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, name, amount, transactionId, productName, planDetails } =
      data;

    console.log("PAYMENT SUCCESS EMAIL: Sending notification with data:", {
      email,
      name,
      amount,
      transactionId,
      productName,
      planDetails,
    });

    // Validate required fields
    if (!email || !email.includes("@")) {
      console.error("PAYMENT SUCCESS EMAIL: Invalid email address:", email);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 }
      );
    }

    // Log all input data for debugging
    console.log("PAYMENT SUCCESS EMAIL: Full input data:", {
      email,
      name,
      amount,
      transactionId,
      productName,
      planDetails,
      timestamp: new Date().toISOString(),
    });

    // Add additional validation for transaction ID
    if (!transactionId) {
      console.error("PAYMENT SUCCESS EMAIL: Missing transaction ID");
      // Continue anyway but log the issue
    }

    // Check if Resend is configured
    if (!resend) {
      console.error("PAYMENT SUCCESS EMAIL: Resend API is not configured.");
      return NextResponse.json(
        {
          success: false,
          error: "Resend API is not configured",
          config: {
            resendApiKey: !!resendApiKey,
          },
        },
        { status: 500 }
      );
    }

    // Format the payment date
    const formattedDate = new Date().toLocaleDateString("en-IN", {
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
       <title>Payment Success - ${productName}</title>
       <style>
         body {
           font-family: Arial, sans-serif;
           line-height: 1.6;
           color: #333;
           max-width: 600px;
           margin: 0 auto;
         }
         .container {
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
         .success-icon {
           font-size: 48px;
           color: #22c55e;
           text-align: center;
           margin-bottom: 20px;
         }
         .details {
           margin-bottom: 20px;
         }
         .details div {
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
       <div class="container">
         <div class="header">
           <h1>Payment Successful!</h1>
         </div>
         
         <div class="success-icon">✓</div>
         
         <p>Dear ${name},</p>
         
         <p>Thank you for your payment. Your transaction has been completed successfully.</p>
         
         <div class="details">
           <div><strong>Invoice Number:</strong> ${invoiceNumber}</div>
           <div><strong>Date:</strong> ${formattedDate}</div>
           <div><strong>Transaction ID:</strong> ${transactionId}</div>
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
           <p>If you have any questions, please contact our support team.</p>
           <p>&copy; ${new Date().getFullYear()} Kredz. All rights reserved.</p>
         </div>
       </div>
     </body>
     </html>
   `;

    // Update the email sending section to use the verified domain
    // Replace the testing mode workaround with direct sending to the customer

    // Send email using Resend
    try {
      console.log("PAYMENT SUCCESS EMAIL: Attempting to send via Resend API");

      // Use the verified domain email address
      const fromEmail = process.env.EMAIL_FROM || "Kredz <admin@kredz.in>";

      const { data: resendData, error } = await resend.emails.send({
        from: fromEmail, // Use the verified domain
        to: email, // Send directly to the customer's email
        subject: `Payment Receipt - ${productName}`,
        html: htmlContent,
      });

      if (error) {
        console.error("PAYMENT SUCCESS EMAIL: Resend API error:", error);
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            details: error,
          },
          { status: 500 }
        );
      }

      console.log(
        "PAYMENT SUCCESS EMAIL: Sent successfully to customer:",
        resendData
      );
      return NextResponse.json({
        success: true,
        method: "resend",
        data: resendData,
        recipient: email,
        fromAddress: fromEmail,
      });
    } catch (resendError) {
      console.error(
        "PAYMENT SUCCESS EMAIL: Error sending via Resend:",
        resendError
      );
      return NextResponse.json(
        {
          success: false,
          error:
            resendError instanceof Error
              ? resendError.message
              : String(resendError),
          stack: resendError instanceof Error ? resendError.stack : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("PAYMENT SUCCESS EMAIL: Unexpected error:", error);
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
