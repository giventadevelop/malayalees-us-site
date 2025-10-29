import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Server-side Clerk sign-out endpoint
 * This works even when Clerk's client-side JavaScript fails to load
 * due to DNS/satellite domain configuration issues
 */
export async function POST() {
  console.log('[Clerk Sign Out API] POST request received');

  try {
    // Get auth info
    console.log('[Clerk Sign Out API] Getting auth info...');
    const authData = await auth();
    const { userId, sessionId } = authData;

    console.log('[Clerk Sign Out API] Auth data:', { userId, sessionId, hasUser: !!userId, hasSession: !!sessionId });

    if (!userId || !sessionId) {
      console.log('[Clerk Sign Out API] No auth found, returning 401');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Try to revoke the session server-side
    let sessionRevoked = false;
    try {
      console.log('[Clerk Sign Out API] Attempting to revoke session on Clerk servers...');
      const client = await clerkClient();
      await client.sessions.revokeSession(sessionId);
      sessionRevoked = true;
      console.log('[Clerk Sign Out API] Session revoked successfully on Clerk servers');
    } catch (revokeError) {
      // If session revocation fails, continue anyway - we'll clear cookies
      console.error('[Clerk Sign Out API] Failed to revoke session on Clerk servers:', revokeError);
      console.log('[Clerk Sign Out API] Continuing with cookie clearing...');
    }

    // Create response with cleared Clerk cookies
    const response = NextResponse.json({
      success: true,
      sessionRevoked,
      message: sessionRevoked ? 'Signed out successfully' : 'Signed out (local cookies cleared)'
    });

    // Clear ALL Clerk-related cookies
    const cookiesToClear = [
      '__session',
      '__clerk_db_jwt',
      '__client_uat',
      '__client_uat_2rzRyJ2C', // Tenant-specific cookie
    ];

    console.log('[Clerk Sign Out API] Clearing cookies:', cookiesToClear);

    // Delete cookies - must use 'delete' not 'set' for Next.js
    cookiesToClear.forEach(cookieName => {
      response.cookies.delete(cookieName);
      // Also try deleting with explicit options
      response.cookies.delete({
        name: cookieName,
        path: '/',
      });
    });

    console.log('[Clerk Sign Out API] Sign out successful, returning response');
    return response;
  } catch (error) {
    console.error('[Clerk Sign Out API] Unexpected error:', error);
    console.error('[Clerk Sign Out API] Error stack:', (error as Error).stack);
    console.error('[Clerk Sign Out API] Error message:', (error as Error).message);

    // Even if we error, try to clear cookies
    const response = NextResponse.json(
      {
        error: 'Sign out error, but attempting to clear cookies',
        message: (error as Error).message
      },
      { status: 200 } // Return 200 so the client proceeds with clearing state
    );

    // Try to clear cookies anyway
    const cookiesToClear = [
      '__session',
      '__clerk_db_jwt',
      '__client_uat',
      '__client_uat_2rzRyJ2C',
    ];

    cookiesToClear.forEach(cookieName => {
      response.cookies.delete(cookieName);
      response.cookies.delete({
        name: cookieName,
        path: '/',
      });
    });

    return response;
  }
}
