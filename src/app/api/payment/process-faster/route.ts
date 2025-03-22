import { type NextRequest, NextResponse } from "next/server";
import { updateFasterProcessingStatus } from "@/actions/creditBuilderLoanActions";
import { PrismaClient } from "@prisma/client";

// Create a dedicated Prisma client for this route
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    const encResponse = searchParams.get("encResponse");
    const applicationId = searchParams.get("applicationId");
    const status =
      searchParams.get("status") || searchParams.get("txnStatus") || "FAILED";
    const clientTxnId =
      searchParams.get("clientTxnId") ||
      searchParams.get("sabpaisaTxnId") ||
      "";

    // Log all parameters for debugging
    console.log(
      "DEBUGGING - All URL parameters:",
      Object.fromEntries(searchParams.entries())
    );
    console.log("Processing faster payment response:", {
      encResponse,
      applicationId,
      status,
      clientTxnId,
    });

    // If no application ID but we have a transaction ID that starts with FASTER-
    let finalApplicationId = applicationId;
    if (
      !finalApplicationId &&
      clientTxnId &&
      clientTxnId.startsWith("FASTER-")
    ) {
      finalApplicationId = clientTxnId.replace("FASTER-", "");
    }

    if (!finalApplicationId) {
      console.error("No application ID provided");
      return NextResponse.redirect(
        new URL("/faster-processing/failure", request.url)
      );
    }

    // Determine success based on status parameter - handle different possible status values
    const successStatuses = [
      "SUCCESS",
      "success",
      "SUCCESSFUL",
      "successful",
      "COMPLETED",
      "completed",
      "PAID",
      "paid",
    ];
    const isSuccess = successStatuses.includes(status) || Boolean(encResponse);

    console.log(
      `Payment status determined as: ${isSuccess ? "SUCCESS" : "FAILURE"} for application ${finalApplicationId}`
    );

    // Try both approaches to update the database
    if (isSuccess) {
      try {
        console.log(
          `ATTEMPTING to update application ${finalApplicationId} - marking faster processing as paid`
        );

        // First try direct Prisma update
        try {
          const directUpdate = await prisma.creditBuilderLoanApplication.update(
            {
              where: { id: finalApplicationId },
              data: { fasterProcessingPaid: true },
            }
          );
          console.log("Direct Prisma update result:", directUpdate);
        } catch (directError) {
          console.error("Direct Prisma update failed:", directError);
        }

        // Then try the server action
        const result = await updateFasterProcessingStatus(
          finalApplicationId,
          true
        );

        if (result.success) {
          console.log(
            "SUCCESSFULLY updated faster processing status:",
            result.data
          );
        } else {
          console.error(
            "FAILED to update faster processing status:",
            result.error
          );
        }
      } catch (dbError) {
        console.error("ERROR calling updateFasterProcessingStatus:", dbError);
      }
    }

    // Redirect based on payment status
    let redirectUrl;
    if (isSuccess) {
      // Redirect to success page with application ID
      redirectUrl = `/faster-processing/success?applicationId=${finalApplicationId}`;
    } else {
      // Redirect to failure page with application ID
      redirectUrl = `/faster-processing/failure?applicationId=${finalApplicationId}`;
    }

    console.log("Redirecting to:", redirectUrl);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Error processing faster payment response:", error);
    // Redirect to failure page in case of error
    return NextResponse.redirect(
      new URL("/faster-processing/failure", request.url)
    );
  } finally {
    // Disconnect the Prisma client
    await prisma.$disconnect();
  }
}
