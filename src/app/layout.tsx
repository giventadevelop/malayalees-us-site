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
        domain: 'www.mosc-temp.com',
        signInUrl: 'https://www.adwiise.com/sign-in',
        signUpUrl: 'https://www.adwiise.com/sign-up',
      }
    : {
        // Primary domain allows redirects from satellites
        allowedRedirectOrigins: ['https://www.mosc-temp.com'],
      };

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      telemetry={false}
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