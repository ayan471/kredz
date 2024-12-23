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
  "/payment-callback",
]);

const adminUserIds = [
  "user_2qa96Ptiod6AXaQk2ucR89kZ6Td",
  "user_2qa8rrNJeL0qiZsJDSIWpRfX0Er",
  "user_2qa8Z81zJnpeajwEFOzc7GNYIsl",
  "user_2qbTYLpoXpl48krDyFr0Hob9pnF",
];

export default clerkMiddleware((auth, request: NextRequest) => {
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  const { userId } = auth();

  // If the user is not signed in and is trying to access a protected route, redirect them to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If the user is trying to access the admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check if the user's ID is in the adminUserIds array
    if (!adminUserIds.includes(userId)) {
      // If not, redirect them to the unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // For all other protected routes, allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
