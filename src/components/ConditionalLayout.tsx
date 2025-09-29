'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export default function ConditionalLayout({ children, header, footer }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if this is a MOSC route
  const isMOSCRoute = pathname?.startsWith("/mosc") ?? false;

  // For MOSC routes, just render children without main app header/footer
  if (isMOSCRoute) {
    return <>{children}</>;
  }

  // For all other routes, render the full layout with header and footer
  return (
    <>
      {header}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {footer}
    </>
  );
}