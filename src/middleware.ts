// OLD: import { authMiddleware } from "@clerk/nextjs";
// NEW: Backend Clerk authentication - minimal middleware for route headers
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for Backend Clerk Authentication
 *
 * This is a simplified middleware that only handles:
 * - Adding pathname headers for layout detection
 * - Allowing all routes (authentication is handled by AuthProvider and ProtectedRoute components)
 *
 * Note: The old Clerk authMiddleware has been removed. Authentication is now handled by:
 * - AuthProvider in root layout
 * - ProtectedRoute component for protected pages
 * - useRequireAuth hook for component-level protection
 */
export function middleware(req: NextRequest) {
  // Add pathname header for layout detection (used by ConditionalLayout)
  const response = NextResponse.next();
  response.headers.set('x-pathname', req.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.[\\w]+$|_next).*)',
    // Protect API routes
    '/(api|trpc)(.*)',
  ],
};