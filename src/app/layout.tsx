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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Detect if running on Amplify satellite domain
  const headersList = headers();
  const host = headersList.get('host') || '';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  // Check if this is an Amplify domain (satellite) or primary domain
  const isAmplifyDomain = host.includes('amplifyapp.com');

  // Configure Clerk for satellite domain
  const satelliteDomain = isAmplifyDomain ? host : undefined;
  const isSatellite = isAmplifyDomain;

  // Primary domain for authentication (Account Portal pattern)
  // Auth pages must be on primary domain when using satellite domains
  const primaryDomain = 'https://www.adwiise.com';

  return (
    <ClerkProvider
      domain={satelliteDomain}
      isSatellite={isSatellite}
      proxyUrl={isSatellite ? "/__clerk" : undefined}
      signInUrl={isSatellite ? `${primaryDomain}/sign-in` : "/sign-in"}
      signUpUrl={isSatellite ? `${primaryDomain}/sign-up` : "/sign-up"}
      signInForceRedirectUrl={isSatellite ? `${primaryDomain}/sign-in` : undefined}
      signUpForceRedirectUrl={isSatellite ? `${primaryDomain}/sign-up` : undefined}
      signInFallbackRedirectUrl={isSatellite ? baseUrl : undefined}
      signUpFallbackRedirectUrl={isSatellite ? baseUrl : undefined}
      afterSignInUrl={isSatellite ? baseUrl : "/"}
      afterSignUpUrl={isSatellite ? baseUrl : "/"}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link href="https://fonts.googleapis.com/css?family=Epilogue:300,400,500,600,700|Sora:400,500,600,700&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        </head>
        <body className={inter.className + " flex flex-col min-h-screen"} suppressHydrationWarning>
          <TrpcProvider>
            <ConditionalLayout
              header={<Header hideMenuItems={false} />}
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