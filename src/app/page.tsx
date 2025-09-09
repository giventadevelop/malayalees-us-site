'use client';

import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import LiveEventsSection from '../components/LiveEventsSection';
import FeaturedEventsSection from '../components/FeaturedEventsSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import CausesSection from '../components/CausesSection';
import TeamSection from '../components/TeamSection';
import ProjectsSection from '../components/ProjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';

export default function HomePage() {
  // Handle hash navigation on page load and hash changes
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // Small delay to ensure the page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 100);
        }
      }
    };

    // Handle initial page load with hash
    handleHashNavigation();

    // Handle hash changes (back/forward navigation)
    window.addEventListener('hashchange', handleHashNavigation);

    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, []);

  return (
    <main>
      <HeroSection />
      <div className="mt-[100px]">
        <LiveEventsSection />
        <FeaturedEventsSection />
      </div>
      <ServicesSection />
      <AboutSection />
      <CausesSection />
      <TeamSection />
      <ProjectsSection />
      <TestimonialsSection />
      {/* Contact Section - Updated to match "What We Do" styling */}
      <div id="contact" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Matching "What We Do" style */}
          <div className="mb-16">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-5 h-2 bg-yellow-400 rounded"></div>
              <p className="text-gray-600">Contact</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Get in Touch
            </h2>
          </div>

          {/* Contact Description */}
          <p className="contact-description text-center max-w-2xl mx-auto mb-16 text-gray-600 text-lg">
            Connect with us to learn more about our community initiatives and how you can get involved in preserving and promoting Malayali culture across the United States. Join us in fostering cultural exchange and building stronger connections within our diverse communities.
          </p>

          {/* Contact Cards Grid - Matching "What We Do" card style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Location Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Location
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                    Unite India<br />
                    New Jersey, USA
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                    Phone
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                    <a href="tel:+16317088442" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors duration-300">
                      +1 (631) 708-8442
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    Email
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                    <a href="mailto:Contactus@malyalees.org" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors duration-300">
                      Contactus@malyalees.org
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4h6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    Social Media
                  </h3>
                  <div className="flex gap-3">
                    {/* Facebook - Traditional Blue Background */}
                    <a
                      href="https://www.facebook.com/profile.php?id=61573944338286"
                      className="
                        flex items-center justify-center w-10 h-10
                        text-white
                        bg-blue-600 hover:bg-blue-700
                        rounded-lg transition-all duration-300
                        hover:scale-110 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                        hover:animate-pulse hover:shadow-lg hover:shadow-blue-500/50
                      "
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>

                    {/* Twitter - Traditional Blue Background */}
                    <a
                      href="#"
                      className="
                        flex items-center justify-center w-10 h-10
                        text-white
                        bg-blue-400 hover:bg-blue-500
                        rounded-lg transition-all duration-300
                        hover:scale-110 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                        hover:animate-pulse hover:shadow-lg hover:shadow-blue-400/50
                      "
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Twitter"
                    >
                      <i className="fab fa-twitter"></i>
                    </a>

                    {/* LinkedIn - Traditional Blue Background */}
                    <a
                      href="#"
                      className="
                        flex items-center justify-center w-10 h-10
                        text-white
                        bg-blue-700 hover:bg-blue-800
                        rounded-lg transition-all duration-300
                        hover:scale-110 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2
                        hover:animate-pulse hover:shadow-lg hover:shadow-blue-700/50
                      "
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Connect with us on LinkedIn"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>

                    {/* YouTube - Traditional Red Background */}
                    <a
                      href="#"
                      className="
                        flex items-center justify-center w-10 h-10
                        text-white
                        bg-red-600 hover:bg-red-700
                        rounded-lg transition-all duration-300
                        hover:scale-110 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2
                        hover:animate-pulse hover:shadow-lg hover:shadow-red-500/50
                      "
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Subscribe to our YouTube channel"
                    >
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Matching "What We Do" style */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Ready to connect? Reach out and join our vibrant community</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
