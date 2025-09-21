import { auth, currentUser } from '@clerk/nextjs/server';
import { UserProfileDTO } from '@/types';
import { getTenantId, getAppUrl } from '@/lib/env';
import { getCachedApiJwt, generateApiJwt } from '@/lib/api/jwt';

export async function fetchUserProfileServer(userId: string): Promise<UserProfileDTO | null> {
  const baseUrl = getAppUrl();

  try {
    console.log('[Profile Server] Starting 4-step fallback for userId:', userId);

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

    // Step 2: Fallback to email lookup with reconciliation
    console.log('[Profile Server] Step 2: Looking up profile by email with reconciliation');
    let user = null;
    let email = "";
    try {
      // Ensure currentUser() is properly awaited
      const currentUserResult = await currentUser();
      user = currentUserResult;
      email = user?.emailAddresses?.[0]?.emailAddress || "";
    } catch (error) {
      console.log('[Profile Server] Error getting current user:', error);
      // Continue without user data if currentUser() fails
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

          // NEW: Profile Reconciliation Logic
          if (user && needsReconciliation(profile, userId, user)) {
            console.log('[Profile Server] 🔄 Profile needs reconciliation, updating with Clerk data');
            console.log('[Profile Server] 📊 Reconciliation details:', {
              profileId: profile.id,
              profileUserId: profile.userId,
              currentClerkUserId: userId,
              profileFirstName: profile.firstName,
              profileLastName: profile.lastName,
              clerkFirstName: user.firstName,
              clerkLastName: user.lastName,
              needsReconciliation: true
            });

            try {
              const reconciledProfile = await reconcileProfileWithClerkData(profile, userId, user);
              console.log('[Profile Server] ✅ Profile reconciled successfully');
              return reconciledProfile;
            } catch (reconciliationError) {
              console.error('[Profile Server] ⚠️ Profile reconciliation failed, returning original profile:', reconciliationError);
              return profile; // Return original profile if reconciliation fails
            }
          } else {
            console.log('[Profile Server] ✅ Profile is already up-to-date, no reconciliation needed');
          }

          return profile;
        } else {
          console.log('[Profile Server] Step 2: No profile found by email, proceeding to Step 3');
        }
      }
    }

    // Step 3: Create profile automatically with Clerk user data
    console.log('[Profile Server] Step 3: Creating profile automatically with Clerk user data');
    if (user) {
      console.log('[Profile Server] Clerk user data:', {
        id: user.id,
        emailAddresses: user.emailAddresses,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      });
    }

    if (user) {
      try {
        // NEW: First check if a user with the same userId already exists
        console.log('[Profile Server] 🔍 Checking if user with userId already exists:', userId);
        const userIdCheckUrl = `${baseUrl}/api/proxy/user-profiles/by-user/${userId}`;
        const userIdCheckResponse = await fetch(userIdCheckUrl, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });

        if (userIdCheckResponse.ok) {
          // User with this userId already exists - update instead of create
          console.log('[Profile Server] ✅ Found existing profile by userId, updating instead of creating');
          const existingProfile = await userIdCheckResponse.json();

          // Prepare update payload with current Clerk user data
          const updatePayload: Partial<UserProfileDTO> = {
            id: existingProfile.id,
            userId: userId,
            updatedAt: new Date().toISOString()
          };

          // Update names if they're empty or different from Clerk data
          if (user.firstName && (!existingProfile.firstName || existingProfile.firstName.trim() === '' || existingProfile.firstName === 'Pending')) {
            updatePayload.firstName = user.firstName;
          }

          if (user.lastName && (!existingProfile.lastName || existingProfile.lastName.trim() === '' || existingProfile.lastName === 'User')) {
            updatePayload.lastName = user.lastName;
          }

          // Update the existing profile
          const updateResponse = await fetch(`${baseUrl}/api/proxy/user-profiles/${existingProfile.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/merge-patch+json' },
            body: JSON.stringify(updatePayload),
          });

          if (updateResponse.ok) {
            const updatedProfile = await updateResponse.json();
            console.log('[Profile Server] ✅ Profile updated successfully instead of creating new one');
            return updatedProfile;
          } else {
            console.error('[Profile Server] ❌ Failed to update existing profile:', updateResponse.status);
            // Fall back to returning the existing profile
            return existingProfile;
          }
        }

        // If no existing profile by userId, proceed with creation
        console.log('[Profile Server] ℹ️ No existing profile by userId, proceeding with creation');

        const createPayload = {
          userId: userId,
          email: user.emailAddresses?.[0]?.emailAddress || 'pending@example.com',
          firstName: user.firstName || 'Pending',
          lastName: user.lastName || 'User',
          userRole: 'ROLE_USER',
          userStatus: 'ACTIVE',
          tenantId: getTenantId(),
          // Add additional fields that might be required
          phone: '',
          addressLine1: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          familyName: (user.lastName || 'User'),
          cityTown: '',
          district: '',
          educationalInstitution: '',
          profileImageUrl: '',
          isEmailSubscribed: true,
          emailSubscriptionToken: '',
          isEmailSubscriptionTokenUsed: false,
          reviewedByAdminAt: null,
          requestId: null,
          requestReason: null,
          submittedAt: null,
          reviewedAt: null,
          approvedAt: null,
          rejectedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log('[Profile Server] Final create payload:', JSON.stringify(createPayload, null, 2));

        console.log('[Profile Server] Creating profile with payload:', createPayload);

        const createResponse = await fetch(`${baseUrl}/api/proxy/user-profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createPayload),
        });

        if (createResponse.ok) {
          const createdProfile = await createResponse.json();
          console.log('[Profile Server] ✅ Step 3 successful: Profile created automatically');
          return createdProfile;
        } else {
          const errorText = await createResponse.text();
          console.error('[Profile Server] ❌ Step 3 failed: Profile creation failed:', createResponse.status, errorText);

          // NEW: Handle duplicate key constraint violation gracefully
          if (createResponse.status === 500 && errorText.includes('duplicate key value violates unique constraint "ux_user_profile__user_id"')) {
            console.log('[Profile Server] ℹ️ Duplicate userId detected, attempting to fetch existing profile');

            // Try to fetch the existing profile that caused the constraint violation
            try {
              const existingProfileResponse = await fetch(`${baseUrl}/api/proxy/user-profiles/by-user/${userId}`, {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
              });

              if (existingProfileResponse.ok) {
                const existingProfile = await existingProfileResponse.json();
                console.log('[Profile Server] ✅ Retrieved existing profile after duplicate constraint violation');
                return existingProfile;
              }
            } catch (fetchError) {
              console.error('[Profile Server] ❌ Failed to fetch existing profile after duplicate constraint:', fetchError);
            }
          }

          // Try to parse error details
          try {
            const errorData = JSON.parse(errorText);
            console.error('[Profile Server] Error details:', errorData);
          } catch (parseError) {
            console.error('[Profile Server] Raw error response:', errorText);
          }
        }
      } catch (createError) {
        console.error('[Profile Server] ❌ Step 3 failed: Error creating profile:', createError);

        // NEW: Handle specific constraint violation errors
        if (createError instanceof Error && createError.message.includes('duplicate key value violates unique constraint')) {
          console.log('[Profile Server] ℹ️ Duplicate constraint detected, attempting to fetch existing profile');

          try {
            const existingProfileResponse = await fetch(`${baseUrl}/api/proxy/user-profiles/by-user/${userId}`, {
              headers: { 'Content-Type': 'application/json' },
              cache: 'no-store'
            });

            if (existingProfileResponse.ok) {
              const existingProfile = await existingProfileResponse.json();
              console.log('[Profile Server] ✅ Retrieved existing profile after duplicate constraint error');
              return existingProfile;
            }
          } catch (fetchError) {
            console.error('[Profile Server] ❌ Failed to fetch existing profile after duplicate constraint error:', fetchError);
          }
        }
      }
    }

    // Step 4: Final fallback - return null (will show profile form)
    console.log('[Profile Server] ❌ All steps failed: No profile found or created');
    return null;

  } catch (error) {
    console.error('[Profile Server] ❌ Critical error in profile fetching:', error);
    return null;
  }
}

export async function updateUserProfileServer(profileId: number, payload: Partial<UserProfileDTO>): Promise<UserProfileDTO | null> {
  try {
    console.log('[Profile Server] Updating profile:', profileId, 'with payload:', payload);

    // Get JWT token for direct backend authentication
    let token: string;
    try {
      const cachedToken = await getCachedApiJwt();
      if (!cachedToken) {
        throw new Error('No cached token available');
      }
      token = cachedToken;
    } catch (jwtError) {
      console.log('[Profile Server] Cached JWT failed, trying generateApiJwt:', jwtError);
      const generatedToken = await generateApiJwt();
      if (!generatedToken) {
        throw new Error('Failed to generate JWT token');
      }
      token = generatedToken;
    }

    // Add id field to payload as required by backend conventions
    const patchPayload = {
      id: profileId,
      ...payload
    };

    // Direct backend call using NEXT_PUBLIC_API_BASE_URL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
    }

    const response = await fetch(`${apiBaseUrl}/api/user-profiles/${profileId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(patchPayload),
    });

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
 * Uses direct backend API call with JWT authentication
 */
export async function generateEmailSubscriptionTokenServer(profileId: number): Promise<{ success: boolean; token?: string; error?: string }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // Generate a new token (UUID-like string)
    const newToken = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Get JWT token for backend authentication
    let token: string;
    try {
      const cachedToken = await getCachedApiJwt();
      if (!cachedToken) {
        throw new Error('No cached token available');
      }
      token = cachedToken;
    } catch (jwtError) {
      console.log('[generateEmailSubscriptionTokenServer] Cached JWT failed, trying generateApiJwt:', jwtError);
      const generatedToken = await generateApiJwt();
      if (!generatedToken) {
        throw new Error('Failed to generate JWT token');
      }
      token = generatedToken;
    }

    // Update the user profile with the new token using direct backend API call
    const url = `${API_BASE_URL}/api/user-profiles/${profileId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: profileId, // Include ID for PATCH operations
        tenantId: getTenantId(), // Include tenantId for multi-tenant support
        emailSubscriptionToken: newToken,
        isEmailSubscribed: true,
        updatedAt: new Date().toISOString()
      }),
    });

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

// Profile Reconciliation Logic
// Handles cases where existing profiles need to be updated with current Clerk user data

/**
 * Determines if a profile needs reconciliation with Clerk user data
 */
function needsReconciliation(profile: UserProfileDTO, currentClerkUserId: string, currentUser: any): boolean {
  const needsUserIdUpdate = profile.userId !== currentClerkUserId;
  const needsNameUpdate = !profile.firstName ||
                         profile.firstName.trim() === '' ||
                         !profile.lastName ||
                         profile.lastName.trim() === '' ||
                         profile.firstName === 'Pending' ||
                         profile.lastName === 'User';

  const needsReconciliation = needsUserIdUpdate || needsNameUpdate;

  console.log('[Profile Reconciliation] Checking if profile needs reconciliation:', {
    profileId: profile.id,
    profileUserId: profile.userId,
    currentClerkUserId,
    profileFirstName: profile.firstName,
    profileLastName: profile.lastName,
    currentUserFirstName: currentUser?.firstName,
    currentUserLastName: currentUser?.lastName,
    needsUserIdUpdate,
    needsNameUpdate,
    needsReconciliation
  });

  return needsReconciliation;
}

/**
 * Reconciles a profile with current Clerk user data
 * Updates userId, firstName, lastName if they differ or are empty
 */
async function reconcileProfileWithClerkData(
  profile: UserProfileDTO,
  currentClerkUserId: string,
  currentUser: any
): Promise<UserProfileDTO> {
  try {
    console.log('[Profile Reconciliation] Starting profile reconciliation:', {
      profileId: profile.id,
      oldUserId: profile.userId,
      newUserId: currentClerkUserId,
      oldFirstName: profile.firstName,
      newFirstName: currentUser?.firstName,
      oldLastName: profile.lastName,
      newLastName: currentUser?.lastName
    });

    // Prepare update payload with Clerk user data
    const updatePayload: Partial<UserProfileDTO> = {
      id: profile.id,
      userId: currentClerkUserId, // Always update to current Clerk user ID
      updatedAt: new Date().toISOString()
    };

    // Update names if they're empty or different from Clerk data
    if (currentUser?.firstName && (!profile.firstName || profile.firstName.trim() === '' || profile.firstName === 'Pending')) {
      updatePayload.firstName = currentUser.firstName || '';
    }

    if (currentUser?.lastName && (!profile.lastName || profile.lastName.trim() === '' || profile.lastName === 'User')) {
      updatePayload.lastName = currentUser.lastName || '';
    }

    console.log('[Profile Reconciliation] Update payload for reconciliation:', updatePayload);

    // Use the existing updateUserProfileServer function
    const updatedProfile = await updateUserProfileServer(profile.id, updatePayload);

    if (updatedProfile) {
      console.log('[Profile Reconciliation] ✅ Profile reconciled successfully:', {
        profileId: updatedProfile.id,
        newUserId: updatedProfile.userId,
        newFirstName: updatedProfile.firstName,
        newLastName: updatedProfile.lastName
      });
      return updatedProfile;
    } else {
      throw new Error('Profile update failed during reconciliation');
    }
  } catch (error) {
    console.error('[Profile Reconciliation] ❌ Error during profile reconciliation:', error);
    throw error;
  }
}