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

  // For now, disable satellite mode for Amplify until domain is verified in Clerk
  // Just use standard Clerk configuration for all domains
  const isAmplifyDomain = host.includes('amplifyapp.com');

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      telemetry={false}
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