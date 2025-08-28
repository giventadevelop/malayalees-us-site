'use client';

import React from 'react';
import HeroSection from '../../components/charity-sections/HeroSection';
import ServicesSection from '../../components/charity-sections/ServicesSection';
import AboutSection from '../../components/charity-sections/AboutSection';
import CausesSection from '../../components/charity-sections/CausesSection';
import TeamSection from '../../components/charity-sections/TeamSection';
import ProjectsSection from '../../components/charity-sections/ProjectsSection';
import TestimonialsSection from '../../components/charity-sections/TestimonialsSection';

export default function CharityWebsite() {
  return (
    <main className="charity-theme-layout">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <CausesSection />
      <TeamSection />
      <ProjectsSection />
      <TestimonialsSection />
      {/* Contact Section */}
      <section className="contact-section py-20 bg-gray-50" id="contact">
        <div className="container mx-auto px-4">
          <div className="section-title-wrapper mb-10">
            <span className="section-subtitle text-yellow-500 font-semibold mb-2 block">Contact</span>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Get in touch</h3>
          </div>
          <p className="contact-description text-center max-w-2xl mx-auto mb-10 text-gray-600">Connect with us to learn more about our community initiatives and how you can get involved in preserving and promoting Malayali culture across the United States. Join us in fostering cultural exchange and building stronger connections within our diverse communities.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="contact-item">
              <h6 className="text-lg font-semibold mb-2">Location</h6>
              <p>Unite India
                <br />New Jersey, USA</p>
            </div>
            <div className="contact-item">
              <h6 className="text-lg font-semibold mb-2">Phone</h6>
              <p><a href="tel:+16317088442" className="text-blue-600 hover:underline">+1 (631) 708-8442</a></p>
            </div>
            <div className="contact-item">
              <h6 className="text-lg font-semibold mb-2">Social</h6>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/profile.php?id=61573944338286" className="social-icon bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-yellow-400" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </div>
            </div>
            <div className="contact-item">
              <h6 className="text-lg font-semibold mb-2">Email</h6>
              <p><a href="mailto:Contactus@malyalees.org" className="text-blue-600 hover:underline">Contactus@malyalees.org</a></p>
            </div>
          </div>
        </div>
      </section>
      {/* Spacer section for clear separation before footer */}
      <div className="py-24 bg-white"></div>
    </main>
  );
}