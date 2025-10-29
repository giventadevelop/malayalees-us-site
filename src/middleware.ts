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

// Compute satellite config safely for production to avoid missing domain/proxyUrl
const isSatEnv = process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE === 'true' || process.env.NEXT_PUBLIC_APP_URL?.includes('mosc-temp.com') || false;
const satDomain = process.env.NEXT_PUBLIC_CLERK_DOMAIN || (process.env.NEXT_PUBLIC_APP_URL?.includes('mosc-temp.com') ? 'mosc-temp.com' : undefined);
const satProxyUrl = process.env.NEXT_PUBLIC_CLERK_PROXY_URL;
const satConfig: any = {};
if (isSatEnv) {
  if (satDomain) {
    Object.assign(satConfig, { isSatellite: true, domain: satDomain });
  } else if (satProxyUrl) {
    Object.assign(satConfig, { isSatellite: true, proxyUrl: satProxyUrl });
  }
}

export default authMiddleware({
  // Define public routes that don't require authentication
  // IMPORTANT: Public API routes allow unauthenticated users to fetch public data
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/sso-callback(.*)',
    '/api/webhooks(.*)',
    '/api/public(.*)',
    '/api/proxy(.*)',  // Public API proxy routes for public data (events, etc.)
    '/mosc(.*)',
    '/events(.*)',
    '/gallery(.*)',
    '/about(.*)',
    '/contact(.*)',
    '/polls(.*)',
    '/charity-theme(.*)',
    '/calendar(.*)',
    '/focus-groups(.*)',
  ],

  // Satellite domain configuration (only applied when envs are set)
  ...satConfig,

  // For Amplify domains, point to primary domain for sign-in
  signInUrl: process.env.NEXT_PUBLIC_APP_URL?.includes('amplifyapp.com') || process.env.NEXT_PUBLIC_APP_URL?.includes('mosc-temp.com')
    ? 'https://www.adwiise.com/sign-in'
    : '/sign-in',

  // Ignore authentication on prefetch requests for public routes
  ignoredRoutes: [
    // Ignore Next.js RSC prefetch requests for public routes
    '/(.*)?_rsc=(.*)$',
  ],

  // Custom logic to add pathname header and handle prefetch requests
  afterAuth(auth, req) {
    // Add pathname header for layout detection (used by ConditionalLayout)
    const response = NextResponse.next();
    response.headers.set('x-pathname', req.nextUrl.pathname);

    // For prefetch requests on public routes, always allow them through
    if (req.nextUrl.searchParams.has('_rsc')) {
      // This is a Next.js prefetch/RSC request, allow it through without auth
      return response;
    }

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