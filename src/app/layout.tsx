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

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Satellite domain configuration for multi-domain support (env-driven to match middleware)
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const envIsSatellite = process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE === 'true';
  const envDomain = process.env.NEXT_PUBLIC_CLERK_DOMAIN;
  const envProxyUrl = process.env.NEXT_PUBLIC_CLERK_PROXY_URL;
  const primarySignIn = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || 'https://www.adwiise.com/sign-in';
  const primarySignUp = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || 'https://www.adwiise.com/sign-up';
  const satelliteOrigin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mosc-temp.com';

  let clerkProps: any = {};
  if (envIsSatellite) {
    if (envProxyUrl) {
      clerkProps = { isSatellite: true, proxyUrl: envProxyUrl, signInUrl: primarySignIn, signUpUrl: primarySignUp };
    } else if (envDomain) {
      clerkProps = { isSatellite: true, domain: envDomain, signInUrl: primarySignIn, signUpUrl: primarySignUp };
    }
  } else {
    clerkProps = { allowedRedirectOrigins: [satelliteOrigin] };
  }

  // Determine tenant-scoped admin flag on the server
  let isTenantAdmin = false;
  try {
    const { userId } = await auth();
    if (userId) {
      const baseUrl = getAppUrl();
      const tenantId = getTenantId();
      // Use criteria list endpoint to ensure tenant filter applies
      const url = `${baseUrl}/api/proxy/user-profiles?userId.equals=${encodeURIComponent(userId)}&tenantId.equals=${encodeURIComponent(tenantId)}&size=1`;
      const resp = await fetch(url, { cache: 'no-store', headers: { 'Content-Type': 'application/json' } });
      if (resp.ok) {
        const arr = await resp.json();
        const p = Array.isArray(arr) ? arr[0] : arr;
        if (!p) {
          // Create minimal tenant-scoped profile immediately after sign-in if missing
          try {
            const u = await currentUser();
            const now = new Date().toISOString();
            const payload = {
              userId,
              email: u?.emailAddresses?.[0]?.emailAddress || '',
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
              // swallow error, admin remains false
            }
          } catch { }
        } else {
          isTenantAdmin = p?.userRole === 'ADMIN';
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