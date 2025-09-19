'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ChevronDown, X, Menu } from 'lucide-react';
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

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
  { name: 'Promotion Emails', href: '/admin/promotion-emails' },
  { name: 'Test Stripe', href: '/admin/test-stripe' },
  { name: 'Media Management', href: '/admin/media' },
  { name: 'Executive Committee', href: '/admin/executive-committee' }
];

const ORG_NAME = "Adwiise";

type HeaderProps = {
  hideMenuItems?: boolean;
  variant?: 'charity' | 'default';
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

export default function Header({ hideMenuItems = false, variant = 'charity' }: HeaderProps) {
  const pathname = usePathname();
  const { userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check admin status
  useEffect(() => {
    async function checkAdminInOrg() {
      if (!userLoaded || !user) {
        setIsAdmin(false);
        return;
      }
      try {
        const memberships = await user.getOrganizationMemberships();
        const targetOrgMembership = memberships.find(
          (membership: any) => membership.organization.name === ORG_NAME
        );
        setIsAdmin(
          targetOrgMembership?.role === 'org:admin' ||
          targetOrgMembership?.role === 'admin'
        );
      } catch {
        setIsAdmin(false);
      }
    }
    checkAdminInOrg();
  }, [user, userLoaded]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
                  <div className="text-2xl font-bold text-purple-600 leading-tight">
                    Unite India
                  </div>
                  <div className="text-xs font-medium text-purple-500 uppercase tracking-wider">
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

                    <UserButton afterSignOutUrl="/" />
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

                  <div className="flex justify-center pt-4">
                    <UserButton afterSignOutUrl="/" />
                  </div>
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