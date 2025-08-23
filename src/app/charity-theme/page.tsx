'use client';

import React from 'react';
import HeroSection from '../../components/charity-sections/HeroSection';
import MissionSection from '../../components/charity-sections/MissionSection';
import ServicesSection from '../../components/charity-sections/ServicesSection';
import StatsSection from '../../components/charity-sections/StatsSection';
import AboutSection from '../../components/charity-sections/AboutSection';
import CausesSection from '../../components/charity-sections/CausesSection';
import TeamSection from '../../components/charity-sections/TeamSection';
import ProjectsSection from '../../components/charity-sections/ProjectsSection';
import TestimonialsSection from '../../components/charity-sections/TestimonialsSection';
import EventsSection from '../../components/charity-sections/EventsSection';
import BrandSection from '../../components/charity-sections/BrandSection';

export default function CharityWebsite() {
  return (
    <main className="charity-theme-layout">
      <HeroSection />
      <MissionSection />
      <ServicesSection />
      <StatsSection />
      <AboutSection />
      <CausesSection />
      <TeamSection />
      <ProjectsSection />
      <TestimonialsSection />
      <EventsSection />
      <BrandSection />
    </main>
  );
}