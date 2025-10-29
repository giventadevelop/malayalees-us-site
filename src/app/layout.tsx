import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// NOTE: Using Clerk SDK for OAuth (works with custom Google credentials)
// Backend webhook syncs users to multi-tenant system
import TrpcProvider from "@/lib/trpc/Provider";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ConditionalLayout from "../components/ConditionalLayout";
import { headers } from "next/headers";
import { auth, currentUser } from "@clerk/nextjs";
import { getAppUrl, getTenantId } from "@/lib/env";
import { fetchWithJwtRetry } from "@/lib/proxyHandler";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Satellite domain configuration for multi-domain support
  // Primary domain: www.adwiise.com
  // Satellite domains: www.mosc-temp.com (and future tenant domains)

  const headersList = await headers();
  const hostname = headersList.get('host') || '';

  // Detect if this is a satellite domain
  const isSatellite = hostname.includes('mosc-temp.com');

  // Satellite domains must redirect to primary domain for authentication
  const clerkProps = isSatellite
    ? {
      isSatellite: true,
      domain: 'mosc-temp.com', // Bare domain without www (required by Clerk)
      signInUrl: 'https://www.adwiise.com/sign-in',
      signUpUrl: 'https://www.adwiise.com/sign-up',
    }
    : {
      // Primary domain allows redirects from satellites
      allowedRedirectOrigins: ['https://www.mosc-temp.com'], // Full URL with www is OK here
    };

  // Determine tenant-scoped admin flag on the server
  let isTenantAdmin = false;
  try {
    const { userId } = await auth();
    if (userId) {
      const baseUrl = getAppUrl();
      const tenantId = getTenantId();

      // Step 1: Check if userId + tenantId combination exists
      const url = `${baseUrl}/api/proxy/user-profiles?userId.equals=${encodeURIComponent(userId)}&tenantId.equals=${encodeURIComponent(tenantId)}&size=1`;
      const resp = await fetch(url, { cache: 'no-store', headers: { 'Content-Type': 'application/json' } });

      if (resp.ok) {
        const arr = await resp.json();
        const p = Array.isArray(arr) ? arr[0] : arr;

        if (!p) {
          // Step 2: Profile not found by userId + tenantId
          // Check if email + tenantId combination exists (different userId case)
          try {
            const u = await currentUser();
            const userEmail = u?.emailAddresses?.[0]?.emailAddress || '';

            if (userEmail) {
              // Check for existing profile with same email + tenantId but different userId
              const emailCheckUrl = `${baseUrl}/api/proxy/user-profiles?email.equals=${encodeURIComponent(userEmail)}&tenantId.equals=${encodeURIComponent(tenantId)}&size=1`;
              const emailResp = await fetch(emailCheckUrl, { cache: 'no-store', headers: { 'Content-Type': 'application/json' } });

              if (emailResp.ok) {
                const emailArr = await emailResp.json();
                const existingProfile = Array.isArray(emailArr) ? emailArr[0] : emailArr;

                if (existingProfile && existingProfile.userId !== userId) {
                  // Step 3: Email + tenantId exists but with different userId
                  // UPDATE the existing record's userId to match current Clerk userId
                  console.log('[Layout] Found existing profile with same email but different userId. Updating userId...');
                  console.log('[Layout] Old userId:', existingProfile.userId, '→ New userId:', userId);

                  // Use direct backend call with JWT (not proxy) for PATCH operations
                  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
                  const updatePayload = {
                    id: existingProfile.id, // MUST include id in PATCH payload per backend requirements
                    userId: userId, // Update to current Clerk userId
                    clerkUserId: userId, // Also update clerkUserId
                    tenantId: tenantId, // Include tenantId
                    updatedAt: new Date().toISOString(),
                    // Keep other fields from existing profile
                    email: userEmail,
                    firstName: u?.firstName || existingProfile.firstName,
                    lastName: u?.lastName || existingProfile.lastName,
                    profileImageUrl: u?.imageUrl || existingProfile.profileImageUrl,
                  };

                  console.log('[Layout] Sending PATCH request with payload:', JSON.stringify(updatePayload, null, 2));

                  const updateRes = await fetchWithJwtRetry(`${API_BASE_URL}/api/user-profiles/${existingProfile.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/merge-patch+json' },
                    body: JSON.stringify(updatePayload),
                  });

                  if (updateRes.ok) {
                    const updated = await updateRes.json();
                    isTenantAdmin = updated?.userRole === 'ADMIN';
                    console.log('[Layout] Successfully updated userId. Admin status:', isTenantAdmin);
                  } else {
                    const errorText = await updateRes.text();
                    console.error('[Layout] Failed to update userId:', updateRes.status);
                    console.error('[Layout] Error response:', errorText);
                  }
                } else {
                  // Step 4: No existing profile found - Create new profile
                  console.log('[Layout] Creating new user profile for userId:', userId);
                  const now = new Date().toISOString();
                  const payload = {
                    userId,
                    clerkUserId: userId,
                    email: userEmail,
                    firstName: u?.firstName || '',
                    lastName: u?.lastName || '',
                    profileImageUrl: u?.imageUrl || '',
                    userRole: 'MEMBER',
                    userStatus: 'PENDING_APPROVAL',
                    createdAt: now,
                    updatedAt: now,
                  };

                  const createRes = await fetch(`${baseUrl}/api/proxy/user-profiles`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });

                  if (!createRes.ok) {
                    console.error('[Layout] Failed to create user profile:', createRes.status);
                  } else {
                    console.log('[Layout] Successfully created new user profile');
                  }
                }
              }
            } else {
              // No email available, cannot check or create profile
              console.warn('[Layout] User has no email address, skipping profile creation');
            }
          } catch (err) {
            console.error('[Layout] Error in user profile creation/update logic:', err);
          }
        } else {
          // Step 5: Profile found by userId + tenantId - check admin status
          isTenantAdmin = p?.userRole === 'ADMIN';
          console.log('[Layout] Found existing profile. Admin status:', isTenantAdmin);
        }
      }
    }
  } catch (e) {
    // Fail closed (no admin) on error
    isTenantAdmin = false;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      {...clerkProps}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link href="https://fonts.googleapis.com/css?family=Epilogue:300,400,500,600,700|Sora:400,500,600,700&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        </head>
        <body className={inter.className + " flex flex-col min-h-screen"} suppressHydrationWarning>
          <TrpcProvider>
            <ConditionalLayout
              header={<Header hideMenuItems={false} isTenantAdmin={isTenantAdmin} />}
              footer={<Footer />}
            >
              {children}
            </ConditionalLayout>
          </TrpcProvider>
          <Script
            id="hcaptcha-config"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.hcaptchaConfig = {
                  passive: true,
                  usePassiveEventListeners: true
                };
              `,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}