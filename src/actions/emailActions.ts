"use server";

import { formatCurrency } from "@/components/lib/utils";
import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the type for invoice email data
interface InvoiceEmailData {
  email: string;
  name: string;
  amount: string;
  transactionId: string;
  paymentDate: string;
  productName: string;
  planDetails: string;
}

/**
 * Sends an invoice email to the user after successful payment
 */
export async function sendInvoiceEmail({
  email,
  name,
  amount,
  transactionId,
  paymentDate,
  productName,
  planDetails,
}: InvoiceEmailData) {
  try {
    // Validate email
    if (!email || !email.includes("@")) {
      console.error("Invalid email address:", email);
      return { success: false, error: "Invalid email address" };
    }

    // Check if RESEND_API_KEY is set
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return { success: false, error: "Email API key is not configured" };
    }

    console.log("Sending invoice email with the following data:", {
      email,
      name,
      amount,
      transactionId,
      paymentDate,
      productName,
      planDetails,
    });

    // Format the payment date
    const formattedDate = new Date(paymentDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format the amount
    const formattedAmount = formatCurrency(Number.parseFloat(amount), "INR");

    // Generate invoice number (you can use your own logic)
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

    // Send the email
    console.log("Attempting to send email via Resend API");
    const { data, error } = await resend.emails.send({
      from: "Kredz <admin@kredz.in>", // Update with your domain
      to: email,
      subject: `Payment Receipt - ${productName}`,
      html: htmlContent,
    });

    if (error) {
      console.error("Error sending invoice email:", error);
      return { success: false, error: error.message };
    }

    console.log("Invoice email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendInvoiceEmail:", error);
    return { success: false, error: "Failed to send invoice email" };
  }
}
