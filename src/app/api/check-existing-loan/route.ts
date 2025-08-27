import { type NextRequest, NextResponse } from "next/server";
import { checkExistingLoanApplication } from "@/actions/loanApplicationActions";

export async function POST(request: NextRequest) {
  try {
    const { panNo } = await request.json();

    if (!panNo) {
      return NextResponse.json(
        { error: "PAN number is required" },
        { status: 400 }
      );
    }

    const result = await checkExistingLoanApplication(panNo);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in check-existing-loan API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
