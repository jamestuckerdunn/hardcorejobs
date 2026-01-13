import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/saved-jobs(.*)",
  "/applications(.*)",
  "/employer(.*)",
  "/admin(.*)",
  "/onboarding(.*)",
]);

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// In production, Clerk MUST be configured - fail fast
if (process.env.NODE_ENV === "production" && !isClerkConfigured) {
  throw new Error(
    "Clerk authentication must be configured in production. " +
    "Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable."
  );
}

// Export middleware conditionally (allows development without Clerk)
export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : function middleware(_request: NextRequest) {
      // Development only: pass through when Clerk isn't configured
      console.warn("⚠️ Clerk not configured - all routes are public");
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
