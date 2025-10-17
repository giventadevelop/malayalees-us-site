// Using Clerk SDK for authentication
'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/"
      />
    </main>
  );
}