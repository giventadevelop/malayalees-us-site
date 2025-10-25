import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Clerk SDK Middleware (v4 compatible)
 *
 * This middleware handles Clerk authentication for server-side functions like auth() and currentUser().
 * It allows both public and protected routes, with authentication checks handled by:
 * - Server-side: auth() and currentUser() in API routes and server components
 * - Client-side: useAuth() and useUser() hooks in client components
 */

export default authMiddleware({
  // Define public routes that don't require authentication
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/sso-callback(.*)',
    '/api/webhooks(.*)',
    '/api/public(.*)',
    '/mosc(.*)',
    '/events(.*)',
    '/gallery(.*)',
    '/about(.*)',
    '/contact(.*)',
  ],

  // Satellite domain configuration for multi-domain support
  // Detect if running on satellite domain
  isSatellite: process.env.NEXT_PUBLIC_APP_URL?.includes('mosc-temp.com') || false,
  domain: process.env.NEXT_PUBLIC_APP_URL?.includes('mosc-temp.com') ? 'www.mosc-temp.com' : undefined,

  // For Amplify domains, point to primary domain for sign-in
  signInUrl: process.env.NEXT_PUBLIC_APP_URL?.includes('amplifyapp.com') || process.env.NEXT_PUBLIC_APP_URL?.includes('mosc-temp.com')
    ? 'https://www.adwiise.com/sign-in'
    : '/sign-in',

  // Custom logic to add pathname header
  afterAuth(auth, req) {
    // Add pathname header for layout detection (used by ConditionalLayout)
    const response = NextResponse.next();
    response.headers.set('x-pathname', req.nextUrl.pathname);
    return response;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.[\\w]+$).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};