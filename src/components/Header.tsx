'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ChevronDown, X, Menu, LogOut } from 'lucide-react';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';

const navItems = [
  {
    name: 'Home',
    href: '/',
    active: false
  },
  {
    name: 'About',
    href: '/#about-us',
    active: false
  },
  {
    name: 'Events',
    href: '/events',
    active: false
  },
  {
    name: 'Focus Groups',
    href: '/focus-groups',
    active: false
  },
  {
    name: 'Calendar',
    href: '/calendar',
    active: false
  },
  {
    name: 'Gallery',
    href: '/gallery',
    active: false
  },
  {
    name: 'Polls',
    href: '/polls',
    active: false
  },
  {
    name: 'Team',
    href: '/#team-section',
    active: false
  },
  {
    name: 'Contact',
    href: '/#contact',
    active: false
  }
];

// Admin submenu items
const adminSubmenuItems = [
  { name: 'Admin Home', href: '/admin' },
  { name: 'Manage Users', href: '/admin/manage-usage' },
  { name: 'Manage Events', href: '/admin/events' },
  { name: 'Event Analytics', href: '/admin/events/dashboard' },
  { name: 'Registrations', href: '/admin/events/registrations' },
  { name: 'Poll Management', href: '/admin/polls' },
  { name: 'Focus Groups', href: '/admin/focus-groups' },
  { name: 'Promotion Emails', href: '/admin/promotion-emails' },
  { name: 'Test Stripe', href: '/admin/test-stripe' },
  { name: 'Media Management', href: '/admin/media' },
  { name: 'Executive Committee', href: '/admin/executive-committee' }
];

const ORG_NAME = "Adwiise";

type HeaderProps = {
  hideMenuItems?: boolean;
  variant?: 'charity' | 'default';
  isTenantAdmin?: boolean;
};

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  console.log('[Header] handleSmoothScroll called with:', href);

  if (!href.startsWith('#')) return;

  e.preventDefault();
  console.log('[Header] Preventing default and handling hash navigation');

  // If we're not on the home page, navigate there first
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    console.log('[Header] Not on home page, navigating to:', `/${href}`);
    // Navigate to home page with hash
    window.location.href = `/${href}`;
    return;
  }

  // If we're on the home page, update the URL hash and let the page handle scrolling
  const targetId = href.substring(1);
  console.log('[Header] On home page, updating hash to:', targetId);

  // Update the URL hash
  window.history.pushState(null, '', href);

  // Trigger a hashchange event to let the page component handle the scrolling
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};

export default function Header({ hideMenuItems = false, variant = 'charity', isTenantAdmin }: HeaderProps) {
  const pathname = usePathname();
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isAdmin, setIsAdmin] = useState(!!isTenantAdmin);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // CRITICAL: Check for sign-out flag IMMEDIATELY on mount, before Clerk loads
  // This must run synchronously on first render
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Debug: Always log the current URL to verify flag is present
    const currentUrl = window.location.href;
    console.log('[Header FLAG CHECK] Current URL:', currentUrl);
    console.log('[Header FLAG CHECK] Search params:', window.location.search);

    const urlParams = new URLSearchParams(window.location.search);
    const clerkSignedOut = urlParams.get('clerk_signout');

    console.log('[Header FLAG CHECK] clerk_signout flag value:', clerkSignedOut);

    if (clerkSignedOut === 'true') {
      // Store debug info that persists across reload
      sessionStorage.setItem('clerk_signout_detected', new Date().toISOString());

      console.log('[Header] ===== DETECTED clerk_signout=true FLAG! =====');
      console.log('[Header] Clearing flag and forcing hard reload...');

      // Log all cookies before clearing
      console.log('[Header] Current cookies:', document.cookie);

      // Clear any Clerk-related storage on satellite domain
      try {
        // Clear localStorage items that might contain Clerk data
        const localStorageKeys = Object.keys(localStorage);
        localStorageKeys.forEach(key => {
          if (key.includes('clerk') || key.includes('__clerk')) {
            console.log('[Header] Clearing localStorage key:', key);
            localStorage.removeItem(key);
          }
        });

        // Clear sessionStorage items (except our debug flag)
        const sessionStorageKeys = Object.keys(sessionStorage);
        sessionStorageKeys.forEach(key => {
          if (key !== 'clerk_signout_detected' && (key.includes('clerk') || key.includes('__clerk'))) {
            console.log('[Header] Clearing sessionStorage key:', key);
            sessionStorage.removeItem(key);
          }
        });

        // Try to clear Clerk cookies (this may not work due to HttpOnly/Secure flags)
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          if (cookieName.includes('clerk') || cookieName.includes('__clerk') || cookieName.includes('__session')) {
            console.log('[Header] Attempting to clear cookie:', cookieName);
            // Try multiple domain variations
            const domains = [
              window.location.hostname,
              '.mosc-temp.com',
              'mosc-temp.com',
              '.adwiise.com',
              'adwiise.com',
              ''
            ];
            domains.forEach(domain => {
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            });
          }
        });

        console.log('[Header] Cleared Clerk-related storage and cookies');
        console.log('[Header] Cookies after clearing:', document.cookie);
      } catch (e) {
        console.error('[Header] Error clearing storage:', e);
      }

      // Remove the flag from URL
      urlParams.delete('clerk_signout');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');

      console.log('[Header] New URL after flag removal:', newUrl);
      console.log('[Header] Executing hard reload NOW...');

      // Force a HARD reload (clears cache) by using location.replace
      window.location.replace(newUrl);
    } else {
      // Check if we just did a reload after sign-out
      const detectedTime = sessionStorage.getItem('clerk_signout_detected');
      if (detectedTime) {
        console.log('[Header] ===== POST-SIGNOUT RELOAD COMPLETE =====');
        console.log('[Header] Flag was detected at:', detectedTime);
        console.log('[Header] Page has been reloaded, Clerk state should be cleared');
        console.log('[Header] Cookies after reload:', document.cookie);

        // List all cookies to help debug
        const cookies = document.cookie.split(';').map(c => c.trim());
        console.log('[Header] Cookie list:', cookies);

        sessionStorage.removeItem('clerk_signout_detected');
      }
    }
  }, []); // Empty deps array = runs once on mount

  // Listen for sign-out events from other tabs (cross-tab synchronization)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      // Detect sign-out broadcast from another tab
      if (e.key === 'clerk_signout_broadcast' && e.newValue) {
        console.log('[Header] ===== SIGN-OUT DETECTED FROM ANOTHER TAB =====');
        console.log('[Header] This tab will reload to clear session...');

        // Small delay to ensure the message is logged
        setTimeout(() => {
          // Reload page to clear any cached auth state
          window.location.reload();
        }, 100);
      }
    };

    // Listen for localStorage changes from other tabs
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Monitor auth state and detect invalid sessions (handle 401s gracefully)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If Clerk is loaded but no user, and we're on a protected route, we may have been signed out
    if (isLoaded && !userId && !user) {
      // Check if we were previously signed in (detect session invalidation)
      const wasSignedIn = sessionStorage.getItem('was_signed_in');
      const currentPath = window.location.pathname;

      if (wasSignedIn === 'true' && currentPath.startsWith('/admin')) {
        console.log('[Header] ===== SESSION INVALIDATED =====');
        console.log('[Header] You were signed out in another tab or your session expired');
        console.log('[Header] Redirecting to home page...');

        // Clear the flag
        sessionStorage.removeItem('was_signed_in');

        // Redirect to home with a message
        window.location.href = '/?session_expired=true';
      }
    } else if (isLoaded && userId) {
      // Track that user is signed in
      sessionStorage.setItem('was_signed_in', 'true');
    }
  }, [isLoaded, userId, user]);

  // Debug: Log auth state changes
  useEffect(() => {
    console.log('[Header] Auth state:', {
      isLoaded,
      userId,
      userName: user?.firstName,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
    });

    // Check for sign out logs from previous page load
    if (typeof window !== 'undefined') {
      const savedLogs = sessionStorage.getItem('signout_debug_logs');
      if (savedLogs) {
        console.log('[Header] =============== PREVIOUS SIGN OUT LOGS ===============');
        try {
          const logs = JSON.parse(savedLogs);
          logs.forEach((log: string) => console.log(log));
          console.log('[Header] ===============================================');
        } catch (e) {
          console.error('[Header] Failed to parse saved logs');
        }
        // Clear the logs after displaying
        sessionStorage.removeItem('signout_debug_logs');
      }

      // Note: clerk_signout flag detection moved to separate useEffect that runs immediately on mount
    }
  }, [isLoaded, userId, user]);

  // Prefer server-verified tenant admin flag when provided; otherwise fall back to Clerk metadata
  useEffect(() => {
    if (typeof isTenantAdmin === 'boolean') {
      setIsAdmin(isTenantAdmin);
      return;
    }
    if (isLoaded && user) {
      const publicRole = user.publicMetadata?.role as string;
      const orgRole = user.organizationMemberships?.[0]?.role;
      const isAdminUser =
        publicRole === 'admin' ||
        publicRole === 'administrator' ||
        orgRole === 'admin' ||
        orgRole === 'org:admin';
      setIsAdmin(isAdminUser);
    } else {
      setIsAdmin(false);
    }
  }, [isLoaded, user, isTenantAdmin]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    console.log('[Header] =============== SIGN OUT STARTED ===============');
    console.log('[Header] Sign out button clicked at:', new Date().toISOString());

    setIsSigningOut(true);

    // Broadcast sign-out to all other tabs BEFORE redirecting
    try {
      localStorage.setItem('clerk_signout_broadcast', Date.now().toString());
      console.log('[Header] Broadcasted sign-out to other tabs');
    } catch (e) {
      console.error('[Header] Failed to broadcast sign-out:', e);
    }

    // For satellite domains, redirect to primary domain's sign-out URL
    // This is the ONLY way to properly clear Clerk cookies set by the primary domain
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isSatellite = hostname.includes('mosc-temp.com');

    if (isSatellite) {
      console.log('[Header] Satellite domain detected, redirecting to primary domain sign-out...');

      // Redirect to primary domain's dedicated sign-out page
      // This page will call Clerk's signOut() and redirect back to satellite
      const primarySignOutUrl = 'https://www.adwiise.com/auth/signout-redirect';
      const returnUrl = encodeURIComponent(window.location.origin);

      console.log('[Header] Redirecting to:', `${primarySignOutUrl}?redirect_url=${returnUrl}`);

      // Redirect to primary domain for sign out
      window.location.href = `${primarySignOutUrl}?redirect_url=${returnUrl}`;
      return;
    }

    // For primary domain, use normal Clerk sign out
    try {
      console.log('[Header] Primary domain - using Clerk signOut()...');
      await signOut();
      console.log('[Header] Sign out successful');
      window.location.href = '/';
    } catch (error) {
      console.error('[Header] Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const headerHeight = 80;

    const scrollToHashWithOffset = (behavior: ScrollBehavior = 'smooth') => {
      const hash = window.location.hash;
      if (!hash || (window.location.pathname !== '/' && window.location.pathname !== '/charity-theme')) return;
      const targetId = hash.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      window.scrollTo({ top: Math.max(0, targetPosition), behavior });
    };

    if ((window.location.pathname === '/' || window.location.pathname === '/charity-theme') && window.location.hash) {
      requestAnimationFrame(() => scrollToHashWithOffset('auto'));
      const timeout = setTimeout(() => scrollToHashWithOffset('auto'), 300);
      return () => clearTimeout(timeout);
    }

    const onHashChange = () => scrollToHashWithOffset('smooth');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [pathname]);

  // Update active state based on current route
  const updatedNavItems = navItems.map(item => ({
    ...item,
    active: item.href === pathname || (item.href === '/' && (pathname === '/charity-theme' || pathname === '/'))
  }));

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Unite India Text Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="text-left">
                  <div className="text-xl font-bold text-purple-600 leading-snug">
                    Unite India
                  </div>
                  <div className="text-[10px] font-medium text-purple-500 uppercase tracking-wider">
                    A NONPROFIT CORPORATION
                  </div>
                </div>
              </Link>
            </div>

            {/* Center - Desktop Navigation and Right Side Combined */}
            <div className="hidden lg:flex items-center space-x-1 ml-4">
              {/* Navigation Menu Items */}
              {!hideMenuItems && (
                <nav className="flex items-center space-x-1" role="navigation" aria-label="Main navigation">
                  {updatedNavItems.map((item) => (
                    <div key={item.name} className="relative group">
                      <Link
                        href={item.href}
                        className={`
                          relative flex items-center space-x-1 font-inter
                          text-base lg:text-base font-medium tracking-wide
                          px-3 py-2 mx-1
                          transition-all duration-300 ease-in-out
                          focus:outline-none
                          ${item.active
                            ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                            : 'text-blue-400 font-medium hover:text-blue-500 hover:font-semibold border-b-2 border-transparent hover:border-blue-400'
                          }
                        `}
                        onClick={(e) => handleSmoothScroll(e, item.href)}
                        aria-label={`Navigate to ${item.name}`}
                        aria-current={item.active ? 'page' : undefined}
                      >
                        <span className="tracking-[0.025em]">{item.name}</span>
                      </Link>
                    </div>
                  ))}
                </nav>
              )}

              {/* Auth and Admin Menu Items */}
              <div className="flex items-center space-x-1">
                {!userId ? (
                  <>
                    <Link
                      href="/sign-in"
                      className={`
                        relative flex items-center font-inter
                        text-base font-medium tracking-wide
                        px-3 py-2 mx-1
                        transition-all duration-300 ease-in-out
                        focus:outline-none
                        text-blue-400 font-medium hover:text-blue-500 hover:font-semibold border-b-2 border-transparent hover:border-blue-400
                      `}
                    >
                      <span className="tracking-[0.025em]">Sign In</span>
                    </Link>
                    <Link
                      href="/sign-up"
                      className={`
                        relative flex items-center font-inter
                        text-base font-medium tracking-wide
                        px-3 py-2 mx-1
                        transition-all duration-300 ease-in-out
                        focus:outline-none
                        text-blue-400 font-medium hover:text-blue-500 hover:font-semibold border-b-2 border-transparent hover:border-blue-400
                      `}
                    >
                      <span className="tracking-[0.025em]">Sign Up</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      className={`
                        relative flex items-center font-inter
                        text-base font-medium tracking-wide
                        px-3 py-2 mx-1
                        transition-all duration-300 ease-in-out
                        focus:outline-none
                        ${pathname === "/profile"
                          ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                          : 'text-blue-400 font-medium hover:text-blue-500 hover:font-semibold border-b-2 border-transparent hover:border-blue-400'
                        }
                      `}
                    >
                      <span className="tracking-[0.025em]">Profile</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className={`
                        relative flex items-center space-x-1 font-inter
                        text-base font-medium tracking-wide
                        px-3 py-2 mx-1
                        transition-all duration-300 ease-in-out
                        focus:outline-none
                        ${isSigningOut
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-400 font-medium hover:text-blue-500 hover:font-semibold border-b-2 border-transparent hover:border-blue-400'
                        }
                      `}
                      aria-label="Sign out"
                    >
                      <LogOut size={16} aria-hidden="true" />
                      <span className="tracking-[0.025em]">
                        {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                      </span>
                    </button>

                    {/* Admin Menu with Submenu */}
                    {isAdmin && (
                      <div className="relative group">
                        <Link
                          href="/admin"
                          className={`
                            relative flex items-center space-x-1 font-inter
                            text-base font-medium tracking-wide
                            px-3 py-2 mx-1
                            transition-all duration-300 ease-in-out
                            focus:outline-none
                            ${pathname?.startsWith("/admin")
                              ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                              : 'text-blue-400 font-medium hover:text-blue-500 hover:font-semibold border-b-2 border-transparent hover:border-blue-400'
                            }
                          `}
                        >
                          <span className="tracking-[0.025em]">Admin</span>
                          <ChevronDown
                            size={16}
                            className="text-blue-400 transition-transform duration-300 group-hover:rotate-180"
                            aria-hidden="true"
                          />
                        </Link>

                        {/* Admin Submenu */}
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                          <div className="py-3">
                            {adminSubmenuItems.map(subItem => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="
                                  block px-4 py-2 mx-1 rounded-lg
                                  text-sm font-medium text-blue-400 tracking-[0.025em]
                                  hover:text-blue-500 hover:font-semibold hover:bg-blue-50
                                  focus:outline-none
                                  transition-all duration-300 ease-in-out
                                "
                                role="menuitem"
                                aria-label={`Navigate to ${subItem.name}`}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UserButton removed with Clerk; consider adding profile avatar here */}
                  </>
                )}
              </div>
            </div>

            {/* Right side - Search and Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <button
                aria-label="Search"
                className="
                  hidden sm:flex items-center justify-center
                  w-11 h-11 min-w-[44px] min-h-[44px]
                  font-inter font-medium
                  text-gray-600 hover:text-gray-900 active:text-blue-600
                  bg-transparent hover:bg-gray-50 active:bg-gray-100
                  border-2 border-transparent hover:border-gray-200 active:border-blue-300
                  rounded-xl
                  focus:outline-none
                  transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-98
                  hover:shadow-sm active:shadow-md
                "
              >
                <Search
                  size={20}
                  className="transition-all duration-300 ease-in-out"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>

              {/* Mobile menu button */}
              <button
                className="
                  lg:hidden flex items-center justify-center
                  w-11 h-11 min-w-[44px] min-h-[44px]
                  text-gray-800 hover:text-gray-900 active:text-blue-600
                  bg-white hover:bg-gray-50 active:bg-gray-100
                  border border-gray-300 hover:border-gray-400
                  rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-colors duration-200
                  touch-manipulation
                  relative z-50
                "
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                type="button"
              >
                {!isMobileMenuOpen ? (
                  <div className="flex flex-col justify-center items-center w-6 h-6">
                    {/* Top bar - medium length (12px) */}
                    <div className="w-3 h-0.5 bg-gray-800 rounded-sm mb-1"></div>
                    {/* Middle bar - full length (16px) */}
                    <div className="w-4 h-0.5 bg-gray-800 rounded-sm mb-1"></div>
                    {/* Bottom bar - short length (8px) */}
                    <div className="w-2 h-0.5 bg-gray-800 rounded-sm"></div>
                  </div>
                ) : (
                  <X size={20} className="text-gray-800" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6">
            <Link href="/" className="text-left">
              <div className="text-lg font-bold text-purple-600 leading-tight">
                Unite India
              </div>
              <div className="text-[10px] font-medium text-purple-500 uppercase tracking-wider">
                A NONPROFIT CORPORATION
              </div>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="
                flex items-center justify-center
                w-11 h-11 min-w-[44px] min-h-[44px]
                font-inter font-medium
                text-gray-500 hover:text-gray-800 active:text-red-600
                bg-transparent hover:bg-gray-50 active:bg-gray-100
                border-2 border-transparent hover:border-gray-200 active:border-red-300
                rounded-xl
                focus:outline-none
                transition-all duration-300 ease-in-out
                hover:scale-105 active:scale-98
                hover:shadow-sm active:shadow-md
                touch-manipulation
              "
              aria-label="Close navigation menu"
            >
              <X
                size={22}
                className="transition-all duration-300 ease-in-out"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Mobile Menu Navigation */}
          <nav className="flex-1 overflow-y-auto py-6" role="navigation" aria-label="Mobile navigation">
            <ul className="space-y-1 px-6">
              {!hideMenuItems && updatedNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      block py-4 px-4 min-h-[44px] rounded-xl
                      font-inter text-base font-medium tracking-[0.025em]
                      focus:outline-none
                      transition-all duration-300 ease-in-out
                      ${item.active
                        ? 'text-blue-400 font-semibold border-l-4 border-blue-400'
                        : 'text-blue-400 font-medium hover:text-blue-500 hover:font-semibold border-l-4 border-transparent hover:border-blue-400'
                      }
                    `}
                    onClick={(e) => {
                      closeMobileMenu();
                      handleSmoothScroll(e, item.href);
                    }}
                    aria-label={`Navigate to ${item.name}`}
                    aria-current={item.active ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Auth Section */}
            <div className="px-6 mt-8 space-y-3">
              {!userId ? (
                <>
                  <Link
                    href="/sign-in"
                    className="
                      block w-full py-4 px-6 min-h-[44px] rounded-xl
                      font-inter font-medium text-base tracking-[0.025em]
                      text-center border-2 border-blue-200 text-blue-600 hover:text-blue-700
                      hover:bg-blue-50 hover:border-blue-300 hover:font-semibold
                      focus:outline-none
                      transition-all duration-300 ease-in-out
                      active:scale-98
                    "
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="
                      block w-full py-4 px-6 min-h-[44px] rounded-xl
                      font-inter font-medium text-base tracking-[0.025em]
                      text-center bg-blue-400 text-white hover:bg-blue-500
                      hover:font-semibold focus:outline-none
                      transition-all duration-300 ease-in-out
                      active:scale-98
                    "
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    className={`
                      block w-full py-4 px-6 min-h-[44px] rounded-xl
                      font-inter font-medium text-base tracking-[0.025em]
                      text-center border-2 border-blue-200 text-blue-600 hover:text-blue-700
                      hover:bg-blue-50 hover:border-blue-300 hover:font-semibold
                      focus:outline-none
                      transition-all duration-300 ease-in-out
                      active:scale-98
                      ${pathname === "/profile" ? "border-blue-400 bg-blue-50 font-semibold" : ""}
                    `}
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      closeMobileMenu();
                      handleSignOut();
                    }}
                    disabled={isSigningOut}
                    className={`
                      flex items-center justify-center space-x-2
                      w-full py-4 px-6 min-h-[44px] rounded-xl
                      font-inter font-medium text-base tracking-[0.025em]
                      border-2
                      focus:outline-none
                      transition-all duration-300 ease-in-out
                      active:scale-98
                      ${isSigningOut
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 hover:font-semibold'
                      }
                    `}
                    aria-label="Sign out"
                  >
                    <LogOut size={18} aria-hidden="true" />
                    <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
                  </button>

                  {/* Mobile Admin Menu */}
                  {isAdmin && (
                    <>
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">
                          Admin Panel
                        </div>
                        {adminSubmenuItems.map(subItem => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="
                              block py-3 px-4 min-h-[44px] rounded-lg
                              font-inter text-sm font-medium text-blue-400 tracking-[0.025em]
                              hover:text-blue-500 hover:font-semibold hover:bg-blue-50
                              focus:outline-none
                              transition-all duration-300 ease-in-out
                            "
                            onClick={closeMobileMenu}
                            role="menuitem"
                            aria-label={`Navigate to ${subItem.name}`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}

                  {/* UserButton removed with Clerk; consider adding profile avatar here */}
                </>
              )}
            </div>

            {/* Mobile Menu Actions */}
            <div className="px-6 mt-8 space-y-3">
              <button
                className="
                  w-full py-4 px-6 min-h-[44px] rounded-xl
                  font-inter font-medium text-base tracking-[0.025em]
                  border-2 border-gray-200 text-gray-600 hover:text-gray-900
                  hover:bg-gray-50 hover:border-gray-300 hover:font-semibold
                  focus:outline-none
                  transition-all duration-300 ease-in-out
                  active:scale-98 flex items-center justify-center space-x-2
                "
                aria-label="Search"
              >
                <Search size={20} aria-hidden="true" />
                <span>Search</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}