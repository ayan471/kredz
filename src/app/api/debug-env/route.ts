import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Only return existence status, not actual values for security
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    variables: {
      NEXT_PUBLIC_SABPAISA_CLIENT_CODE:
        !!process.env.NEXT_PUBLIC_SABPAISA_CLIENT_CODE,
      SABPAISA_AUTH_KEY: !!process.env.SABPAISA_AUTH_KEY,
      SABPAISA_AUTH_IV: !!process.env.SABPAISA_AUTH_IV,
      NEXT_PUBLIC_SABPAISA_URL: !!process.env.NEXT_PUBLIC_SABPAISA_URL,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
    },
  });
}
