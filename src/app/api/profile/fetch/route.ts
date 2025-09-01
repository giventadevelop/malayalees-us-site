import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fetchUserProfileServer } from '@/app/profile/ApiServerActions';

export const dynamic = 'force-dynamic';

/**
 * API endpoint to fetch user profile data
 * Used by client components that need loading states
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[PROFILE-FETCH-API] 🚀 Profile fetch endpoint called');

    // Verify authentication using Clerk
    const { userId } = auth();
    console.log('[PROFILE-FETCH-API] 🔐 Auth check result:', { userId: userId || 'null' });

    if (!userId) {
      console.log('[PROFILE-FETCH-API] ❌ No userId from auth(), returning 401');
      return NextResponse.json({
        error: 'Authentication required',
        message: 'Please sign in to access your profile'
      }, { status: 401 });
    }

    // Get userId from request body (for verification)
    let requestedUserId: string;
    try {
      const body = await request.json();
      requestedUserId = body.userId;
      console.log('[PROFILE-FETCH-API] 📝 Request body userId:', requestedUserId);
    } catch (parseError) {
      console.error('[PROFILE-FETCH-API] ❌ Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Ensure user can only fetch their own profile
    if (userId !== requestedUserId) {
      console.log('[PROFILE-FETCH-API] ❌ User ID mismatch:', {
        authUserId: userId,
        requestedUserId: requestedUserId
      });
      return NextResponse.json({ error: 'Forbidden - User ID mismatch' }, { status: 403 });
    }

    console.log('[PROFILE-FETCH-API] ✅ Authentication verified, fetching profile for userId:', userId);

    // Fetch profile using existing server action
    const profile = await fetchUserProfileServer(userId);

    if (profile) {
      console.log('[PROFILE-FETCH-API] ✅ Profile fetched successfully');
      return NextResponse.json(profile);
    } else {
      console.log('[PROFILE-FETCH-API] ℹ️ No profile found, returning null');
      return NextResponse.json(null);
    }
  } catch (error) {
    console.error('[PROFILE-FETCH-API] ❌ Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}