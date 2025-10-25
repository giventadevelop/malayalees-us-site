// Satellite domain - redirect to primary domain for authentication
// For localhost - show Clerk component directly for development
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    // Check if we're on a satellite domain
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;

      // Check if localhost - show Clerk component for development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setIsLocalhost(true);
        return;
      }

      // If on satellite domain, redirect to primary domain with return URL
      if (hostname.includes('mosc-temp.com')) {
        setShouldRedirect(true);
        // Get the current URL to return to after authentication
        const currentUrl = window.location.origin;

        // Redirect to primary domain with redirect_url parameter
        // Clerk will redirect back to this URL after successful authentication
        const redirectUrl = `https://www.adwiise.com/sign-up?redirect_url=${encodeURIComponent(currentUrl)}`;
        window.location.href = redirectUrl;
      }
    }
  }, []);

  // Show Clerk component for localhost development
  if (isLocalhost) {
    return (
      <main className="flex flex-col items-center justify-center flex-1 py-2">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 text-center mt-2">(Development Mode)</p>
        </div>
        <SignUp />
      </main>
    );
  }

  // Show loading state while redirecting (satellite domain)
  if (shouldRedirect) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign up...</p>
        </div>
      </main>
    );
  }

  // Default: show nothing (will determine redirect/component in useEffect)
  return null;
}