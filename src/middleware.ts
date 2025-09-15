import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/charity-theme",
    "/(charity-theme)",
    "/event",
    "/event/success",
    "/event/success/(.*)",
    "/event/ticket-qr",
    "/test-mobile",
    "/pricing",
    "/events",
    "/events/(.*)/tickets",
    "/events/(.*)/tickets/(.*)",
    "/events/(.*)/register",
    "/events/(.*)/register/(.*)",
    "/events/(.*)/checkout",
    "/events/(.*)/checkout/(.*)",
    "/events/(.*)/payment",
    "/events/(.*)/payment/(.*)",
    "/events/(.*)/success",
    "/events/(.*)/success/(.*)",
    "/events/(.*)",
    "/api/proxy/(.*)",
    "/api/webhooks/(.*)",
    "/api/event/success/process",
    "/api/debug/(.*)",
    "/api/test-mobile",
    "/api/tasks",
    "/api/billing/(.*)",
    "/api/stripe/(.*)",
    "/api/payment/(.*)",
    "/api/checkout/(.*)",
    "/api/profile/(.*)",
    "/api/auth/(.*)",
    "/images/(.*)",
    "/_next/(.*)",
    "/favicon.ico",
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml"
  ],

  // Routes that can be accessed while signed out, but also show user info if signed in
  ignoredRoutes: [
    "/api/webhooks/(.*)",
    "/api/proxy/(.*)",
    "/api/stripe/event-checkout",
    "/api/stripe/get-session",
    "/api/payment/(.*)",
    "/api/checkout/(.*)",
    "/api/billing/(.*)"
  ],

  // Clock skew tolerance to handle system clock differences
  // Use very high tolerance for development to prevent authentication issues
  clockSkewInSeconds: process.env.NODE_ENV === 'development' ? 300 : 30,

  // Debug mode for development
  debug: true,

  // After authentication, redirect to this path if the user is not signed in
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return Response.redirect(new URL('/sign-in', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.[\\w]+$|_next).*)',
    // Protect API routes
    '/(api|trpc)(.*)',
  ],
};