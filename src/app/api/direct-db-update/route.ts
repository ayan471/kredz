import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a new Prisma client instance specifically for this route
// This ensures we're not using a cached connection
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "No application ID provided" },
        { status: 400 }
      );
    }

    console.log(`DIRECT DB UPDATE API: Updating application ${applicationId}`);

    // Check if the application exists
    const application = await prisma.creditBuilderLoanApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      console.error(`Application not found: ${applicationId}`);
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    console.log(
      "Current fasterProcessingPaid value:",
      application.fasterProcessingPaid
    );

    // Try MongoDB direct command
    try {
      const result = await prisma.$runCommandRaw({
        update: "CreditBuilderLoanApplication",
        updates: [
          {
            q: { _id: { $oid: applicationId } },
            u: { $set: { fasterProcessingPaid: true } },
          },
        ],
      });

      console.log("MongoDB direct command result:", result);
    } catch (mongoError) {
      console.error("MongoDB direct command error:", mongoError);
    }

    // Also try standard Prisma update
    const updatedApplication = await prisma.creditBuilderLoanApplication.update(
      {
        where: { id: applicationId },
        data: { fasterProcessingPaid: true },
      }
    );

    console.log("Updated application:", {
      id: updatedApplication.id,
      fasterProcessingPaid: updatedApplication.fasterProcessingPaid,
    });

    return NextResponse.json({
      success: true,
      message: "Faster processing status updated directly",
      data: {
        id: updatedApplication.id,
        fasterProcessingPaid: updatedApplication.fasterProcessingPaid,
      },
    });
  } catch (error) {
    console.error("DIRECT DB UPDATE API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update faster processing status" },
      { status: 500 }
    );
  } finally {
    // Disconnect the Prisma client to ensure we don't have connection leaks
    await prisma.$disconnect();
  }
}
