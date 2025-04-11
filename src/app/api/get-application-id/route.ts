import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const applicationData =
      await prisma.creditBuilderApplicationData.findUnique({
        where: { userId },
        select: { id: true },
      });

    if (!applicationData) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ applicationId: applicationData.id });
  } catch (error) {
    console.error("Error fetching application ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch application ID" },
      { status: 500 }
    );
  }
}
