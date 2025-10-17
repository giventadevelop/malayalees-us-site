import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { fetchUserProfileServer } from '@/app/profile/ApiServerActions';
import { fetchWithJwtRetry } from '@/lib/proxyHandler';

export const dynamic = 'force-dynamic';

/**
 * API endpoint to fetch user profile data
 * Used by client components that need loading states
 * Auto-creates user profile if it doesn't exist
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[PROFILE-FETCH-API] 🚀 Profile fetch endpoint called');

    // Get authenticated user from Clerk
    const { userId: clerkUserId } = await auth();
    const user = await currentUser();

    if (!clerkUserId || !user) {
      console.log('[PROFILE-FETCH-API] ❌ Not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[PROFILE-FETCH-API] ✅ Authenticated user:', clerkUserId);

    // Try to fetch existing profile
    let profile = await fetchUserProfileServer(clerkUserId);

    // If profile doesn't exist, create it automatically
    if (!profile) {
      console.log('[PROFILE-FETCH-API] ℹ️ Profile not found, creating automatically...');

      const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'tenant_demo_001';

      // Call backend sync endpoint to create user
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

      const syncPayload = {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName || 'User',
        lastName: user.lastName || 'User',
        tenantId: tenantId,
      };

      console.log('[PROFILE-FETCH-API] Sending sync request:', JSON.stringify(syncPayload));

      try {
        // Use centralized JWT retry helper (complies with .cursor/rules/nextjs_api_routes.mdc)
        const syncResponse = await fetchWithJwtRetry(`${backendUrl}/api/clerk/sync-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-Id': tenantId,
          },
          body: JSON.stringify(syncPayload),
        }, '[PROFILE-FETCH-API] sync-user');

        const syncResponseText = await syncResponse.text();
        console.log('[PROFILE-FETCH-API] Sync response status:', syncResponse.status);
        console.log('[PROFILE-FETCH-API] Sync response body:', syncResponseText);

        if (syncResponse.ok) {
          console.log('[PROFILE-FETCH-API] ✅ User created successfully, fetching again...');
          // Wait a bit for database to commit
          await new Promise(resolve => setTimeout(resolve, 500));
          // Fetch the newly created profile
          profile = await fetchUserProfileServer(clerkUserId);
        } else {
          console.error('[PROFILE-FETCH-API] ❌ Failed to create user:', syncResponse.status, syncResponseText);
        }
      } catch (syncError) {
        console.error('[PROFILE-FETCH-API] ❌ Error calling sync-user endpoint:', syncError);
      }
    }

    if (profile) {
      console.log('[PROFILE-FETCH-API] ✅ Profile fetched successfully');
      return NextResponse.json(profile);
    } else {
      console.log('[PROFILE-FETCH-API] ℹ️ No profile found after creation attempt');
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