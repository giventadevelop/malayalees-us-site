'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserProfileDTO } from '@/types';
import ProfileForm from '@/components/ProfileForm';
import { ProfileReconciliationTrigger } from '@/components/ProfileReconciliationTrigger';
import ErrorDialog from '@/components/ErrorDialog';
import Image from 'next/image';

/**
 * Client-side profile page wrapper that shows loading state
 * while fetching profile data from the server
 */
export default function ProfilePageWithLoading() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [lastResponseStatus, setLastResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    }
  }, [isLoaded, user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      setShowErrorDialog(false);
      setErrorDetails(null);

      // Call the server action through an API endpoint
      const response = await fetch('/api/profile/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      // Store the response status for later use
      setLastResponseStatus(response.status);

      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      } else {
        const errorText = await response.text();

        if (response.status === 401) {
          // For 401 errors, just log the error but don't prevent the page from showing
          console.log('[ProfilePageWithLoading] 🔄 401 error detected, but continuing to show profile form');
          // Don't set error state for 401s - let the page continue

          // Try to retry once after a short delay
          console.log('[ProfilePageWithLoading] 🔄 Retrying profile fetch after 401 error...');
          setTimeout(() => {
            if (user) {
              console.log('[ProfilePageWithLoading] 🔄 Retry attempt for user:', user.id);
              fetchProfile();
            }
          }, 1000); // Wait 1 second before retry
        } else if (response.status === 500) {
          const errorMessage = 'There is some unexpected error happened. Please try back again later.';
          setError(errorMessage);
          setErrorDetails(errorText);
          setShowErrorDialog(true);
        } else {
          const errorMessage = 'Failed to load profile';
          setError(errorMessage);
          setErrorDetails(errorText);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      const errorMessage = 'There is some unexpected error happened. Please try back again later.';
      setError(errorMessage);
      setErrorDetails(err instanceof Error ? err.message : 'Unknown error');
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences.</p>
        </div>

        {/* Loading State with Image */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-32 h-32 mb-6">
            <Image
              src="/images/user_profile_loading.webp"
              alt="Loading profile..."
              fill
              className="object-contain animate-pulse"
              priority
            />
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading your profile...</p>
          <div className="mt-4 flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state - only show for non-500 errors
  if (error && !showErrorDialog) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences.</p>
        </div>

        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
        </div>
      </div>
    );
  }

  // Show profile form
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences.</p>
        </div>

        {/* Profile Reconciliation Trigger Component - Temporarily disabled to prevent 401 errors */}
        {/* <ProfileReconciliationTrigger /> */}

        {/* Show subtle message if profile data failed to load due to auth issues */}
        {!profile && lastResponseStatus === 401 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              🔄 Profile data is being loaded. If you continue to see this message, please refresh the page.
            </p>
          </div>
        )}

        <ProfileForm initialProfile={profile || undefined} />
      </div>

      {/* Error Dialog for Backend Errors - Rendered as overlay */}
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Some unexpected error has occurred"
        message="Please try back again later."
      />
    </>
  );
}