import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/event",
    "/pricing",
    "/events",
    "/api/proxy/(.*)",
    "/api/webhooks/(.*)",
    "/api/event/success/process",
    "/api/tasks",
    "/api/billing/(.*)",
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
    "/api/proxy/(.*)"
  ],

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
    // Optional: Protect API routes
    '/(api|trpc)(.*)',
  ],
};