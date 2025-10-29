import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Server-side Clerk sign-out endpoint
 * This works even when Clerk's client-side JavaScript fails to load
 * due to DNS/satellite domain configuration issues
 */
export async function POST() {
  try {
    const { userId, sessionId } = await auth();

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Revoke the session server-side
    await (await clerkClient()).sessions.revokeSession(sessionId);

    // Create response with cleared Clerk cookies
    const response = NextResponse.json({ success: true });

    // Clear Clerk session cookies
    // Clerk uses cookies with __session, __clerk_db_jwt, etc.
    const cookiesToClear = [
      '__session',
      '__clerk_db_jwt',
      '__client_uat',
    ];

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
    });

    return response;
  } catch (error) {
    console.error('[Clerk Sign Out API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
