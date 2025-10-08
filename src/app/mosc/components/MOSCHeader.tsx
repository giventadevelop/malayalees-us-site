'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './ui/Icon';

const MOSCHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { name: 'THE CATHOLICATE', href: '/mosc/catholicate' },
    { name: 'ADMINISTRATION', href: '/mosc/administration' },
    { name: 'THE CHURCH', href: '/mosc/the-church' },
    { name: 'HOLY SYNOD', href: '/mosc/holy-synod' },
    { name: 'ECUMENICAL', href: '/mosc/ecumenical' },
    { name: 'DIOCESES', href: '/mosc/dioceses' },
    { name: 'SAINTS', href: '/mosc/saints' },
  ];

  const quickLinks = [
    { name: 'Spiritual Organisations', href: '/mosc/spiritual-organizations' },
    { name: 'Publications', href: '/mosc/publications' },
    { name: 'Institutions', href: '/mosc/institutions' },
    { name: 'Directory', href: 'http://directory.mosc.in/', external: true },
    { name: 'Training', href: '/mosc/training' },
    { name: 'Theological Seminaries', href: '/mosc/theological-seminaries' },
    { name: 'Lectionary', href: '/mosc/lectionary' },
    { name: 'Downloads', href: '/mosc/downloads' },
    { name: 'Calendar', href: 'http://calendar.mosc.in/', external: true },
    { name: 'Gallery', href: '/mosc/photo-gallery' },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-card border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-heading">Malankara Orthodox Syrian Church</span>
              <span className="hidden sm:inline text-primary-foreground/80">Saint Thomas Christian Community</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="https://www.facebook.com/catholicatenews.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground/80 reverent-transition"
                aria-label="Follow us on Facebook"
              >
                <Icon name="people" size={16} className="text-primary-foreground" />
              </Link>
              <Link
                href="/mosc/sitemap"
                className="hover:text-primary-foreground/80 reverent-transition"
              >
                SITEMAP
              </Link>
              <Link
                href="/mosc/app"
                className="hover:text-primary-foreground/80 reverent-transition"
              >
                APPS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/mosc" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center sacred-shadow group-hover:reverent-hover reverent-transition">
                <Icon name="cross" size={24} className="text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading font-semibold text-lg text-foreground">MOSC</h1>
                <p className="text-sm text-muted-foreground">Malankara Orthodox Syrian Church</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg reverent-transition ${isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted reverent-transition"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Icon name="menu" size={20} className="text-foreground" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg reverent-transition ${isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Quick Links Bar */}
      <div className="bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium text-foreground">Quick Links:</span>
            {quickLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary reverent-transition"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary reverent-transition"
                  >
                    {link.name}
                  </Link>
                )}
                {index < quickLinks.length - 1 && (
                  <span className="text-muted-foreground/50">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MOSCHeader;
