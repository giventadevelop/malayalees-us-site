// Satellite domain - redirect to primary domain for authentication
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if we're on a satellite domain
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;

      // If on satellite domain, redirect to primary domain
      if (hostname.includes('mosc-temp.com')) {
        window.location.href = 'https://www.adwiise.com/sign-in';
      }
    }
  }, []);

  // Show loading state while redirecting
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    </main>
  );
}