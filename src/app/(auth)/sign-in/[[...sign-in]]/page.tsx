// Using Clerk SDK for authentication
'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
      />
    </main>
  );
}