'use client'

import { usePathname } from 'next/navigation';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if we're on the charity theme route
  const isCharityTheme = pathname === '/charity-theme';

  // If it's the charity theme route, don't render Header and Footer
  if (isCharityTheme) {
    return <>{children}</>;
  }

  // For all other routes, render with Header and Footer
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

