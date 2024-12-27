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
]);

const adminUserIds = [
  "user_2qnrMesjbOk9wRV32n4VOrcJ1I4",
  "user_2qnuTlOkJyAAmBrFO1MM6NdYVEo",
  "user_2qnuJyA1LjPRi5ziUfwlODZ4al6",
  "user_2qnu2PyLtlWfXd5PkC1RJXw3sMl",
];

export default clerkMiddleware((auth, request: NextRequest) => {
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  const { userId } = auth();

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
