import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/contact",
  "/about-us",
  "/terms-of-use",
  "/privacy-policy",
  "/disclaimer",
  "/refund",
  "/faq",
  "/payment-callback",
  "/api/payment-callback",
  "/api/phonepe-callback",
  "/api/initiate-phonepe-payment",
  "/api/phonepe-webhook",
  "/payment-error",
  "/api/payment/callback(.*)",
  "/api/payment/success-notification(.*)",
  "/api/payment/process(.*)",
  "/api/payment/process-faster(.*)",
  "/api/payment/process-membership(.*)",
  "/api/test-payment-email(.*)",
]);

const adminUserIds = [
  "user_2qnrMesjbOk9wRV32n4VOrcJ1I4",
  "user_2qnuTlOkJyAAmBrFO1MM6NdYVEo",
  "user_2qnuJyA1LjPRi5ziUfwlODZ4al6",
  "user_2qnu2PyLtlWfXd5PkC1RJXw3sMl",
  "user_2qa8Z81zJnpeajwEFOzc7GNYIsl",
];

export default clerkMiddleware((auth, request: NextRequest) => {
  const { userId } = auth();
  const url = request.nextUrl;
  const searchParams = url.searchParams;
  const redirectUrl = searchParams.get("redirect_url");

  // Handle post-authentication redirect
  // If the user just signed in and we have a redirect URL in the query params
  if (userId && isPublicRoute(request) && redirectUrl) {
    // Create a response that redirects to the specified URL
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Continue with existing middleware logic
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  if (!userId) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!adminUserIds.includes(userId)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
