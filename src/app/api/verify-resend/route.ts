import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get environment variables related to email
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;

    // Check if the API key is configured
    const apiKeyStatus = resendApiKey
      ? `Configured (starts with ${resendApiKey.substring(0, 3)}...)`
      : "Not configured";

    // Check if the EMAIL_FROM is configured
    const emailFromStatus = emailFrom
      ? `Configured (${emailFrom})`
      : "Not configured";

    // Get all environment variables (excluding sensitive ones)
    const safeEnvVars = Object.entries(process.env)
      .filter(
        ([key]) =>
          !key.includes("KEY") &&
          !key.includes("SECRET") &&
          !key.includes("PASSWORD")
      )
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string | undefined>
      );

    return NextResponse.json({
      success: true,
      resendApiKey: apiKeyStatus,
      emailFrom: emailFromStatus,
      environment: process.env.NODE_ENV,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      safeEnvVars,
    });
  } catch (error) {
    console.error("Error verifying Resend configuration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
