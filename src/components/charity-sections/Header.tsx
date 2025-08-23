'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Grid, Search, ChevronDown, X, Menu } from 'lucide-react';

const navItems = [
  {
    name: 'Home',
    href: '/charity-theme',
    active: false
  },
  {
    name: 'About',
    href: '#about',
    dropdown: [
      { name: 'Our Story', href: '#story' },
      { name: 'Mission & Vision', href: '#mission' },
      { name: 'Team', href: '#team' }
    ]
  },
  {
    name: 'Causes',
    href: '#causes',
    dropdown: [
      { name: 'Education', href: '#education' },
      { name: 'Healthcare', href: '#healthcare' },
      { name: 'Environment', href: '#environment' },
      { name: 'Poverty', href: '#poverty' }
    ]
  },
  {
    name: 'Events',
    href: '#events'
  },
  {
    name: 'Gallery',
    href: '#gallery'
  },
  {
    name: 'Contact',
    href: '#contact'
  }
];

type HeaderProps = {
  hideMenuItems?: boolean;
  variant?: 'charity' | 'default';
};

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith('#')) return;

  const isOnCharityTheme = typeof window !== 'undefined' && window.location.pathname === '/charity-theme';
  if (!isOnCharityTheme) return;

  e.preventDefault();
  const targetId = href.substring(1);
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const headerHeight = 80;
    const targetPosition = targetElement.offsetTop - headerHeight - 20;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

export default function Header({ hideMenuItems = false, variant = 'charity' }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setOpenDropdowns(new Set());
    }
  };

  const toggleDropdown = (itemName: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(itemName)) {
      newOpenDropdowns.delete(itemName);
    } else {
      newOpenDropdowns.add(itemName);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdowns(new Set());
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const headerHeight = 80;

    const scrollToHashWithOffset = (behavior: ScrollBehavior = 'smooth') => {
      const hash = window.location.hash;
      if (!hash || window.location.pathname !== '/charity-theme') return;
      const targetId = hash.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      window.scrollTo({ top: Math.max(0, targetPosition), behavior });
    };

    if (window.location.pathname === '/charity-theme' && window.location.hash) {
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
    active: item.href === pathname || (item.href === '/charity-theme' && pathname === '/charity-theme')
  }));

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Grid button and Logo */}
            <div className="flex items-center space-x-4">
              <button 
                aria-label="Open side panel" 
                className="
                  hidden lg:flex items-center justify-center
                  w-11 h-11 min-w-[44px] min-h-[44px]
                  font-inter font-medium
                  text-gray-600 hover:text-gray-900 active:text-blue-600
                  bg-transparent hover:bg-gray-50 active:bg-gray-100
                  border-2 border-transparent hover:border-gray-200 active:border-blue-300
                  rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                  transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-98
                  hover:shadow-sm active:shadow-md
                "
              >
                <Grid 
                  size={20} 
                  className="transition-all duration-300 ease-in-out"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
              
              <Link href="/charity-theme" className="flex items-center">
                <Image
                  src="/images/charity-theme/logo_black.png"
                  alt="Charity Logo"
                  width={140}
                  height={32}
                  priority
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Center - Desktop Navigation */}
            {!hideMenuItems && (
              <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
                {updatedNavItems.map((item) => (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={`
                        relative flex items-center space-x-1 font-inter
                        text-base lg:text-base font-medium tracking-wide
                        px-3 py-2 mx-1 rounded-lg
                        transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                        hover:scale-105 active:scale-98 active:transition-transform active:duration-150
                        ${
                          item.active
                            ? 'text-blue-600 font-semibold bg-blue-50 border-b-2 border-blue-600'
                            : 'text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50 hover:font-semibold'
                        }
                      `}
                      onClick={(e) => handleSmoothScroll(e, item.href)}
                      aria-label={`Navigate to ${item.name}`}
                      aria-current={item.active ? 'page' : undefined}
                    >
                      <span className="tracking-[0.025em]">{item.name}</span>
                      {item.dropdown && (
                        <ChevronDown 
                          size={16} 
                          className="text-gray-400 transition-transform duration-300 group-hover:rotate-180 group-hover:text-gray-600" 
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                    
                    {item.dropdown && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50"
                        role="menu"
                        aria-label={`${item.name} submenu`}
                      >
                        <div className="py-3">
                          {item.dropdown.map(subItem => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="
                                block px-4 py-2 mx-1 rounded-lg
                                text-sm font-medium text-gray-600 tracking-[0.025em]
                                hover:text-gray-900 hover:bg-gray-50 hover:font-semibold
                                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white
                                transition-all duration-300 ease-in-out
                                hover:scale-105 active:scale-98
                              "
                              onClick={(e) => handleSmoothScroll(e, subItem.href)}
                              role="menuitem"
                              aria-label={`Navigate to ${subItem.name}`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Right side - Search and Donate */}
            <div className="flex items-center space-x-4">
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
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
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
              
              <Link 
                href="#donate" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                Donate
              </Link>

              {/* Mobile menu button */}
              <button
                className="
                  lg:hidden flex items-center justify-center
                  w-11 h-11 min-w-[44px] min-h-[44px]
                  font-inter font-medium
                  text-gray-600 hover:text-gray-900 active:text-blue-600
                  bg-transparent hover:bg-gray-50 active:bg-gray-100
                  border-2 border-transparent hover:border-gray-200 active:border-blue-300
                  rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                  transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-98
                  hover:shadow-sm active:shadow-md
                  touch-manipulation icon-button
                "
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu 
                  size={22} 
                  className="transition-all duration-300 ease-in-out"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div 
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <Image
              src="/images/charity-theme/logo_black.png"
              alt="Charity Logo"
              width={120}
              height={24}
              priority
              className="h-6 w-auto"
            />
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
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
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
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="
                          flex items-center justify-between w-full text-left
                          font-inter text-base font-medium tracking-[0.025em]
                          py-4 px-4 min-h-[44px] rounded-xl
                          text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:font-semibold
                          focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                          transition-all duration-300 ease-in-out
                          active:scale-98 active:transition-transform active:duration-150
                        "
                        aria-expanded={openDropdowns.has(item.name)}
                        aria-label={`Toggle ${item.name} submenu`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          size={18}
                          className={`text-gray-400 transition-transform duration-300 ${
                            openDropdowns.has(item.name) ? 'rotate-180 text-gray-600' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openDropdowns.has(item.name) ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                        role="menu"
                        aria-label={`${item.name} submenu`}
                      >
                        <div className="pl-4 space-y-1 py-2">
                          {item.dropdown.map(subItem => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="
                                block py-3 px-4 min-h-[44px] rounded-lg
                                font-inter text-sm font-medium text-gray-600 tracking-[0.025em]
                                hover:text-gray-900 hover:bg-gray-50 hover:font-semibold
                                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                                transition-all duration-300 ease-in-out
                                active:scale-98 active:transition-transform active:duration-150
                              "
                              onClick={(e) => {
                                closeMobileMenu();
                                handleSmoothScroll(e, subItem.href);
                              }}
                              role="menuitem"
                              aria-label={`Navigate to ${subItem.name}`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`
                        block py-4 px-4 min-h-[44px] rounded-xl
                        font-inter text-base font-medium tracking-[0.025em]
                        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                        transition-all duration-300 ease-in-out
                        active:scale-98 active:transition-transform active:duration-150
                        ${
                          item.active
                            ? 'text-blue-600 font-semibold bg-blue-50 border-l-4 border-blue-600'
                            : 'text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50 hover:font-semibold'
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
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Menu Actions */}
            <div className="px-6 mt-8 space-y-3">
              <button 
                className="
                  w-full py-4 px-6 min-h-[44px] rounded-xl
                  font-inter font-semibold text-base tracking-[0.025em]
                  bg-blue-600 hover:bg-blue-700 text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                  transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-98 hover:shadow-lg
                "
                aria-label="Make a donation"
              >
                Donate
              </button>
              <button 
                className="
                  w-full py-4 px-6 min-h-[44px] rounded-xl
                  font-inter font-medium text-base tracking-[0.025em]
                  border-2 border-gray-200 text-gray-600 hover:text-gray-900
                  hover:bg-gray-50 hover:border-gray-300 hover:font-semibold
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
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