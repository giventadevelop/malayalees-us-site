import { auth } from '@clerk/nextjs/server';
import { UserProfileDTO } from '@/types';
import { getTenantId, getAppUrl } from '@/lib/env';
import { getCachedApiJwt, generateApiJwt } from '@/lib/api/jwt';
import { fetchWithJwtRetry } from '@/lib/proxyHandler';

export async function fetchUserProfileServer(userId: string): Promise<UserProfileDTO | null> {
  const baseUrl = getAppUrl();

  try {
    console.log('[Profile Server] Starting profile fetch for userId:', userId);

    // Step 1: Try to fetch the profile by userId
    console.log('[Profile Server] Step 1: Looking up profile by userId');
    const url = `${baseUrl}/api/proxy/user-profiles/by-user/${userId}`;
    let response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[Profile Server] ✅ Step 1 successful: Profile found by userId');
      return Array.isArray(data) ? data[0] : data;
    }

    // Step 2: Fallback to email lookup using Clerk auth() instead of currentUser()
    console.log('[Profile Server] Step 2: Looking up profile by email');
    let email = "";
    try {
      // Use auth() instead of currentUser() - it doesn't require middleware
      const { userId: authUserId } = await auth();
      if (authUserId) {
        // Fetch Clerk user data from API to get email
        const clerkApiKey = process.env.CLERK_SECRET_KEY;
        if (clerkApiKey) {
          const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${authUserId}`, {
            headers: {
              'Authorization': `Bearer ${clerkApiKey}`,
              'Content-Type': 'application/json'
            }
          });
          if (clerkRes.ok) {
            const clerkUser = await clerkRes.json();
            email = clerkUser.email_addresses?.[0]?.email_address || "";
          }
        }
      }
    } catch (error) {
      console.log('[Profile Server] Error getting user email:', error);
      // Continue without email if this fails
    }

    if (email) {
      const emailUrl = `${baseUrl}/api/proxy/user-profiles?email.equals=${encodeURIComponent(email)}`;
      const emailRes = await fetch(emailUrl, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });

      if (emailRes.ok) {
        const emailData = await emailRes.json();
        const profile = Array.isArray(emailData) ? emailData[0] : emailData;

        if (profile && profile.id) {
          console.log('[Profile Server] ✅ Step 2 successful: Profile found by email');

          // Check if profile needs userId update
          if (profile.userId !== userId) {
            console.log('[Profile Server] 🔄 Profile needs userId reconciliation');
            try {
              const updatePayload: Partial<UserProfileDTO> = {
                id: profile.id,
                userId: userId,
                updatedAt: new Date().toISOString()
              };

              const updateResponse = await fetch(`${baseUrl}/api/proxy/user-profiles/${profile.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/merge-patch+json' },
                body: JSON.stringify(updatePayload),
              });

              if (updateResponse.ok) {
                const updatedProfile = await updateResponse.json();
                console.log('[Profile Server] ✅ Profile reconciled successfully');
                return updatedProfile;
              }
            } catch (reconciliationError) {
              console.error('[Profile Server] ⚠️ Profile reconciliation failed:', reconciliationError);
            }
          }

          return profile;
        }
      }
    }

    // Step 3: Create profile if not found
    console.log('[Profile Server] ❌ No profile found for userId:', userId);
    console.log('[Profile Server] 🔨 Attempting to create profile automatically...');

    try {
      // Get user details from Clerk if we don't have email yet
      if (!email) {
        const { userId: authUserId } = await auth();
        if (authUserId) {
          const clerkApiKey = process.env.CLERK_SECRET_KEY;
          if (clerkApiKey) {
            const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${authUserId}`, {
              headers: {
                'Authorization': `Bearer ${clerkApiKey}`,
                'Content-Type': 'application/json'
              }
            });
            if (clerkRes.ok) {
              const clerkUser = await clerkRes.json();
              email = clerkUser.email_addresses?.[0]?.email_address || "";
            }
          }
        }
      }

      // Call backend sync endpoint to create user
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const tenantId = getTenantId();

      // Get Clerk user details for profile creation
      const clerkApiKey = process.env.CLERK_SECRET_KEY;
      let firstName = 'User';
      let lastName = 'User';

      if (clerkApiKey) {
        try {
          const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${clerkApiKey}`,
              'Content-Type': 'application/json'
            }
          });
          if (clerkRes.ok) {
            const clerkUser = await clerkRes.json();
            firstName = clerkUser.first_name || 'User';
            lastName = clerkUser.last_name || 'User';
            if (!email) {
              email = clerkUser.email_addresses?.[0]?.email_address || "";
            }
          }
        } catch (clerkError) {
          console.log('[Profile Server] Warning: Could not fetch Clerk user details:', clerkError);
        }
      }

      const syncPayload = {
        clerkUserId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        tenantId: tenantId,
      };

      console.log('[Profile Server] Calling sync-user endpoint:', JSON.stringify(syncPayload));

      // Use centralized JWT retry helper (complies with .cursor/rules/nextjs_api_routes.mdc)
      const syncResponse = await fetchWithJwtRetry(`${apiBaseUrl}/api/clerk/sync-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId,
        },
        body: JSON.stringify(syncPayload),
      }, '[Profile Server] sync-user');

      console.log('[Profile Server] Sync response status:', syncResponse.status);
      const syncResponseText = await syncResponse.text();
      console.log('[Profile Server] Sync response body:', syncResponseText);

      if (syncResponse.ok) {
        console.log('[Profile Server] ✅ User created successfully, fetching again...');
        // Wait a bit for database to commit
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retry fetching the profile
        const retryUrl = `${baseUrl}/api/proxy/user-profiles/by-user/${userId}`;
        const retryResponse = await fetch(retryUrl, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });

        if (retryResponse.ok) {
          const data = await retryResponse.json();
          console.log('[Profile Server] ✅ Profile created and retrieved successfully');
          return Array.isArray(data) ? data[0] : data;
        }
      } else {
        console.error('[Profile Server] ❌ Failed to create profile:', syncResponse.status, syncResponseText);
      }
    } catch (createError) {
      console.error('[Profile Server] ❌ Error creating profile:', createError);
    }

    return null;

  } catch (error) {
    console.error('[Profile Server] ❌ Critical error in profile fetching:', error);
    return null;
  }
}

/**
 * Update user profile - uses centralized fetchWithJwtRetry helper
 * Complies with .cursor/rules/nextjs_api_routes.mdc standards
 * CRITICAL: Always includes tenantId to comply with multi-tenant architecture
 */
export async function updateUserProfileServer(profileId: number, payload: Partial<UserProfileDTO>): Promise<UserProfileDTO | null> {
  try {
    console.log('[Profile Server] Updating profile:', profileId, 'with payload:', payload);

    // Add id field and tenantId as required by backend conventions
    const patchPayload = {
      id: profileId,
      tenantId: getTenantId(), // CRITICAL: Always include tenantId for multi-tenant support
      ...payload
    };

    // Direct backend call using NEXT_PUBLIC_API_BASE_URL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
    }

    // Use centralized JWT retry helper (complies with .cursor/rules/nextjs_api_routes.mdc)
    const response = await fetchWithJwtRetry(`${apiBaseUrl}/api/user-profiles/${profileId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify(patchPayload),
    }, '[Profile Server] update-profile');

    if (response.ok) {
      const updatedProfile = await response.json();
      console.log('[Profile Server] ✅ Profile updated successfully');
      return updatedProfile;
    } else {
      const errorText = await response.text();
      console.error('[Profile Server] ❌ Profile update failed:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('[Profile Server] ❌ Error updating profile:', error);
    return null;
  }
}

export async function createUserProfileServer(payload: Omit<UserProfileDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfileDTO | null> {
  const baseUrl = getAppUrl();

  try {
    const response = await fetch(`${baseUrl}/api/proxy/user-profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        tenantId: getTenantId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
}

export async function resubscribeEmailServer(email: string, token: string): Promise<boolean> {
  const baseUrl = getAppUrl();

  try {
    const response = await fetch(`${baseUrl}/api/proxy/user-profiles/resubscribe-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
    return response.ok;
  } catch (error) {
    console.error('Error resubscribing email:', error);
    return false;
  }
}

export async function checkEmailSubscriptionServer(email: string): Promise<{ isSubscribed: boolean; token?: string }> {
  const baseUrl = getAppUrl();

  try {
    const url = `${baseUrl}/api/proxy/user-profiles?email.equals=${encodeURIComponent(email)}`;
    const response = await fetch(url, { method: 'GET' });

    if (response.ok) {
      const data = await response.json();
      const profile = Array.isArray(data) ? data[0] : data;
      return {
        isSubscribed: !profile?.emailUnsubscribed,
        token: profile?.emailSubscriptionToken
      };
    }
    return { isSubscribed: false };
  } catch (error) {
    console.error('Error checking email subscription:', error);
    return { isSubscribed: false };
  }
}

/**
 * Fetch user profile by email address
 * Note: The proxy handler automatically injects tenantId.equals for security
 */
export async function fetchUserProfileByEmailServer(email: string): Promise<UserProfileDTO | null> {
  const baseUrl = getAppUrl();

  try {
    // The proxy handler automatically adds tenantId.equals for security
    // This ensures we only get profiles for the current tenant
    const url = `${baseUrl}/api/proxy/user-profiles?email.equals=${encodeURIComponent(email)}`;
    console.log('[fetchUserProfileByEmailServer] Fetching profile by email:', email);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      const profile = Array.isArray(data) ? data[0] : data;
      console.log('[fetchUserProfileByEmailServer] Profile found:', {
        id: profile?.id,
        email: profile?.email,
        tenantId: profile?.tenantId
      });
      return profile || null;
    }

    console.error('Error fetching profile by email:', response.status);
    return null;
  } catch (error) {
    console.error('Error fetching profile by email:', error);
    return null;
  }
}

/**
 * Generate a new email subscription token for a user profile
 * Uses centralized fetchWithJwtRetry helper - complies with .cursor/rules/nextjs_api_routes.mdc
 */
export async function generateEmailSubscriptionTokenServer(profileId: number): Promise<{ success: boolean; token?: string; error?: string }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // Generate a new token (UUID-like string)
    const newToken = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Update the user profile with the new token using centralized JWT retry helper
    const url = `${API_BASE_URL}/api/user-profiles/${profileId}`;
    const response = await fetchWithJwtRetry(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify({
        id: profileId, // Include ID for PATCH operations
        tenantId: getTenantId(), // Include tenantId for multi-tenant support
        emailSubscriptionToken: newToken,
        isEmailSubscribed: true,
        updatedAt: new Date().toISOString()
      }),
    }, '[generateEmailSubscriptionTokenServer]');

    if (response.ok) {
      console.log('[generateEmailSubscriptionTokenServer] Successfully generated token:', newToken);
      return { success: true, token: newToken };
    } else {
      const errorText = await response.text();
      console.error('Error generating email subscription token:', response.status, errorText);
      return { success: false, error: `Failed to generate token: ${response.status}` };
    }
  } catch (error) {
    console.error('Error generating email subscription token:', error);
    return { success: false, error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}