import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Log the payment callback data with a clear identifier
    console.log("PAYMENT CALLBACK (POST): Received data:", data);

    // Extract the clean ID without any additional parameters
    let id = data.clientTxnId || "";
    if (id.includes("?")) {
      id = id.split("?")[0];
    }

    // Check if this is a membership payment (starts with MC-) or credit builder payment (starts with CB-)
    const isMembershipPayment = id.startsWith("MC-");
    const isCreditBuilderPayment = id.startsWith("CB-");

    // Determine redirect URL based on payment status and payment type
    const status = data.status || "FAILED";
    let redirectUrl;

    // If payment is successful, send success notification email
    if (status === "SUCCESS") {
      // Extract user email from the payment data
      const userEmail = data.payerEmail || "";
      const userName = data.payerName || "Customer";
      const amount = data.amount || "0";
      const planDetails = data.udf12 || "Standard Plan";

      if (userEmail) {
        try {
          console.log(
            "PAYMENT CALLBACK (POST): Payment successful, sending email to:",
            userEmail
          );

          // Use our dedicated payment success notification endpoint with absolute URL
          const notificationUrl = new URL(
            "/api/success-notification",
            request.url
          ).toString();
          console.log(
            "PAYMENT CALLBACK (POST): Calling notification endpoint:",
            notificationUrl
          );

          const emailResponse = await fetch(notificationUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userEmail,
              name: userName,
              amount: amount,
              transactionId: id,
              productName: isCreditBuilderPayment
                ? "Credit Builder Subscription"
                : isMembershipPayment
                  ? "Membership"
                  : "Payment",
              planDetails: planDetails,
            }),
          });

          const emailResult = await emailResponse.json();
          console.log(
            "PAYMENT CALLBACK (POST): Email sending result:",
            emailResult
          );
        } catch (emailError) {
          console.error(
            "PAYMENT CALLBACK (POST): Error sending success email:",
            emailError
          );
          // Continue with the payment process even if email fails
        }
      } else {
        console.warn(
          "PAYMENT CALLBACK (POST): No email address found in payment data, skipping success email"
        );
      }
    }

    if (isCreditBuilderPayment) {
      // Check if the URL should use credit-builder-plan instead of credit-builder
      const basePath = "/credit-builder-plan";
      redirectUrl =
        status === "SUCCESS"
          ? `${basePath}/payment-success?id=${id}`
          : `${basePath}/payment-failure?id=${id}`;
    } else if (isMembershipPayment) {
      redirectUrl =
        status === "SUCCESS"
          ? `/membership-cards/success?id=${id}`
          : `/membership-cards/failure?id=${id}`;
    } else {
      redirectUrl =
        status === "SUCCESS"
          ? `/payment-success?id=${id}`
          : `/payment-failure?id=${id}`;
    }

    return NextResponse.json({
      success: true,
      message: "Payment callback processed",
      redirectUrl,
    });
  } catch (error) {
    console.error(
      "PAYMENT CALLBACK (POST): Error processing payment callback:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Error processing payment callback",
        redirectUrl: "/payment-failure",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    let clientTxnId =
      searchParams.get("clientTxnId") ||
      searchParams.get("sabpaisaTxnId") ||
      "";
    const encResponse = searchParams.get("encResponse");

    // Try to get email from multiple possible sources
    let payerEmail = searchParams.get("payerEmail") || "";
    const udf12 = searchParams.get("udf12") || "";

    // If udf12 contains an email (we stored it there as backup), use it
    if (!payerEmail && udf12 && udf12.includes("@")) {
      payerEmail = udf12;
      console.log(
        "PAYMENT CALLBACK (GET): Using email from udf12:",
        payerEmail
      );
    }

    const payerName = searchParams.get("payerName") || "";
    const amount = searchParams.get("amount") || "";
    const planDetails = searchParams.get("udf12") || "";

    // Log all parameters for debugging
    console.log(
      "PAYMENT CALLBACK (GET): All parameters:",
      Object.fromEntries(searchParams.entries())
    );

    // If clientTxnId is empty, try to extract it from other parameters
    if (!clientTxnId || clientTxnId === "") {
      // Check if it's in the plan parameter (malformed URL case)
      const planParam = searchParams.get("plan");
      if (planParam && planParam.includes("clientTxnId=")) {
        const match = planParam.match(/clientTxnId=([^&]+)/);
        if (match && match[1]) {
          clientTxnId = match[1];
          console.log(
            "PAYMENT CALLBACK (GET): Extracted clientTxnId from plan parameter:",
            clientTxnId
          );
        }
      }
    }

    // If still no transaction ID, generate a fallback one for logging purposes
    if (!clientTxnId || clientTxnId === "") {
      clientTxnId = `FALLBACK-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      console.log(
        "PAYMENT CALLBACK (GET): Generated fallback clientTxnId:",
        clientTxnId
      );
    }

    // Log the payment callback data with a clear identifier
    console.log("PAYMENT CALLBACK (GET): Received data:", {
      status,
      clientTxnId,
      encResponse,
      payerEmail,
      payerName,
      amount,
      planDetails,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    // Clean the ID - remove any additional query parameters
    if (clientTxnId.includes("?")) {
      clientTxnId = clientTxnId.split("?")[0];
    }

    // Check payment type based on the transaction ID prefix
    const isMembershipPayment = clientTxnId.startsWith("MC-");
    const isCreditBuilderPayment = clientTxnId.startsWith("CB-");

    // Process the payment status
    // Here you would update your database with the payment status

    // If payment is successful, send success notification email
    if ((status === "SUCCESS" || encResponse) && payerEmail) {
      try {
        console.log(
          "PAYMENT CALLBACK (GET): Payment successful, sending email to:",
          payerEmail
        );

        // Use our dedicated payment success notification endpoint with absolute URL
        const notificationUrl = new URL(
          "/api/success-notification",
          request.url
        ).toString();
        console.log(
          "PAYMENT CALLBACK (GET): Calling notification endpoint:",
          notificationUrl
        );

        const emailResponse = await fetch(notificationUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: payerEmail,
            name: payerName || "Customer",
            amount: amount,
            transactionId: clientTxnId,
            productName: isCreditBuilderPayment
              ? "Credit Builder Subscription"
              : isMembershipPayment
                ? "Membership"
                : "Payment",
            planDetails: planDetails || "Standard Plan",
          }),
        });

        const emailResult = await emailResponse.json();
        console.log(
          "PAYMENT CALLBACK (GET): Email sending result:",
          emailResult
        );
      } catch (emailError) {
        console.error(
          "PAYMENT CALLBACK (GET): Error sending success email:",
          emailError
        );
        // Continue with the payment process even if email fails
      }
    } else {
      console.warn(
        "PAYMENT CALLBACK (GET): Email not sent: Either payment failed or email address missing",
        {
          status,
          payerEmail,
        }
      );
    }

    // Redirect based on payment status and payment type
    let redirectUrl;

    // Check if we should use credit-builder-plan instead of credit-builder
    const basePath = "/credit-builder-plan";

    if (isCreditBuilderPayment) {
      redirectUrl =
        status === "SUCCESS" || encResponse
          ? `${basePath}/payment-success?id=${clientTxnId}`
          : `${basePath}/payment-failure?id=${clientTxnId}`;
    } else if (isMembershipPayment) {
      redirectUrl =
        status === "SUCCESS" || encResponse
          ? `/membership-cards/success?id=${clientTxnId}`
          : `/membership-cards/failure?id=${clientTxnId}`;
    } else {
      redirectUrl =
        status === "SUCCESS" || encResponse
          ? `/payment-success?id=${clientTxnId}`
          : `/payment-failure?id=${clientTxnId}`;
    }

    // Redirect the user to the appropriate page
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error(
      "PAYMENT CALLBACK (GET): Error processing payment callback:",
      error
    );
    // Redirect to failure page in case of error
    return NextResponse.redirect(new URL("/payment-failure", request.url));
  }
}
