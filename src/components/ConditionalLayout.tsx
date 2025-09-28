'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if this is a MOSC route
  const isMOSCRoute = pathname.startsWith("/mosc");
  
  // For MOSC routes, just render children without main app header/footer
  if (isMOSCRoute) {
    return <>{children}</>;
  }
  
  // For all other routes, render children normally (header/footer handled by parent)
  return <>{children}</>;
}