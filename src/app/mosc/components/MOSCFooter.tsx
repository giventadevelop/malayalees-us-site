import React from 'react';
import Link from 'next/link';
import Icon from './ui/Icon';

const MOSCFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'CATHOLICATE NEWS', href: 'https://www.facebook.com/catholicatenews.in', external: true },
    { name: 'DOWNLOADS', href: '/mosc/downloads' },
    { name: 'E-MAIL', href: 'https://accounts.google.com/ServiceLogin', external: true },
    { name: 'GALLERY', href: '/mosc/photo-gallery' },
    { name: 'CONTACT INFO', href: '/mosc/contact-info' },
  ];

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center sacred-shadow">
                <Icon name="cross" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground">Malankara Orthodox Syrian Church</h3>
                <p className="text-sm text-muted-foreground">Saint Thomas Christian Community</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Malankara Orthodox Syrian Church traces its origins to the apostolic mission of St. Thomas,
              one of the twelve apostles of Jesus Christ, who established Christianity in India in 52 AD.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">Quick Links</h3>
            <nav className="space-y-2" role="navigation" aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <div key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary reverent-transition"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary reverent-transition"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">Contact Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Headquarters:</span><br />
                Catholicate Palace<br />
                Devalokam, Kottayam<br />
                Kerala, India
              </p>
              <p>
                <span className="font-medium">Phone:</span> +91-481-2300-700<br />
                <span className="font-medium">Email:</span> info@mosc.in
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} The Malankara Orthodox Church. All rights reserved.
            </div>
            <div className="text-sm text-muted-foreground">
              Created by: Ipsr Solutions Ltd
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MOSCFooter;
