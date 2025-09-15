'use client'

import { usePathname } from 'next/navigation';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer_original_backup";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if we're on routes that should not render Header and Footer
  const isCharityTheme = pathname === '/charity-theme';

  // Only exclude Header and Footer for charity theme route
  // Root route (/) should use the main Header and Footer
  if (isCharityTheme) {
    return <>{children}</>;
  }

  // For all other routes (including root route /), render with Header and Footer
  return (
    <>
      <Header hideMenuItems={false} />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </>
  );
}

