import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/contact",
  "/about-us",
  "/terms-of-use",
  "/privacy-policy",
  "/disclaimer",
  "/refund",
  "/faq",
  "/payment-callback(.*)",
  "/api/phonepe-callback(.*)",
  "/api/phonepe-callback(.*)",
  "/api/initiate-phonepe-payment(.*)",
]);

const adminUserIds = [
  "user_2qa96Ptiod6AXaQk2ucR89kZ6Td",
  "user_2qa8rrNJeL0qiZsJDSIWpRfX0Er",
  "user_2qa8Z81zJnpeajwEFOzc7GNYIsl",
  "user_2qbTYLpoXpl48krDyFr0Hob9pnF",
];

export default clerkMiddleware((auth, request: NextRequest) => {
  // Special handling for payment callback
  if (request.nextUrl.pathname === "/payment-callback") {
    const { userId } = auth();
    if (!userId) {
      // Instead of redirecting, allow the request to proceed
      // The client-side component will handle the authentication
      return NextResponse.next();
    }
  }

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
