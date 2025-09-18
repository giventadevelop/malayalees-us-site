'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { EventSponsorsDTO } from "@/types";
import { getAppUrl } from '@/lib/env';

const OurSponsorsSection: React.FC = () => {
  const [sponsors, setSponsors] = useState<EventSponsorsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // Cache key for sessionStorage
  const CACHE_KEY = 'homepage_sponsors_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Array of modern background colors (same as events page)
  const cardBackgrounds = [
    'bg-gradient-to-br from-blue-50 to-blue-100',
    'bg-gradient-to-br from-green-50 to-green-100',
    'bg-gradient-to-br from-purple-50 to-purple-100',
    'bg-gradient-to-br from-pink-50 to-pink-100',
    'bg-gradient-to-br from-yellow-50 to-yellow-100',
    'bg-gradient-to-br from-indigo-50 to-indigo-100',
    'bg-gradient-to-br from-teal-50 to-teal-100',
    'bg-gradient-to-br from-orange-50 to-orange-100',
    'bg-gradient-to-br from-cyan-50 to-cyan-100',
    'bg-gradient-to-br from-rose-50 to-rose-100'
  ];

  // Function to get random background color for each sponsor
  const getRandomBackground = (index: number) => {
    return cardBackgrounds[index % cardBackgrounds.length];
  };

  useEffect(() => {
    async function fetchSponsors() {
      // Check cache first
      try {
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log('✅ Using cached sponsors data');
            setSponsors(data);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to read sponsors cache:', error);
      }

      setLoading(true);
      setFetchError(false);
      try {
        // Fetch sponsors sorted by priority ranking (ascending = highest priority first)
        const params = new URLSearchParams({
          sort: 'priorityRanking,asc',
          page: '0',
          size: '4', // Maximum 4 sponsors
          'isActive.equals': 'true' // Only active sponsors
        });

        const baseUrl = getAppUrl();
        const response = await fetch(`${baseUrl}/api/proxy/event-sponsors?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          const sponsorsList = Array.isArray(data) ? data : [];
          console.log('✅ Fetched sponsors for homepage:', sponsorsList.length);

          // Cache the data
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
              data: sponsorsList,
              timestamp: Date.now()
            }));
          } catch (error) {
            console.warn('Failed to cache sponsors data:', error);
          }

          setSponsors(sponsorsList);
        } else {
          console.warn('Failed to fetch sponsors:', response.status);
          setFetchError(true);
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSponsors();
  }, []);

  // Don't render anything while loading - section will appear only when fully loaded
  if (loading) {
    return null;
  }

  if (fetchError) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-5 h-2 bg-yellow-400 rounded"></div>
              <p className="text-gray-600 font-medium">Sponsors</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Sponsors
            </h2>
          </div>
          <div className="text-center text-gray-500 py-8">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sponsors Information Temporarily Unavailable</h3>
              <p className="text-gray-500">We're currently updating our sponsors information. Please check back later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (sponsors.length === 0) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-5 h-2 bg-yellow-400 rounded"></div>
              <p className="text-gray-600 font-medium">Sponsors</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Sponsors
            </h2>
          </div>
          <div className="text-center text-gray-500 py-8">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Sponsors Available</h3>
              <p className="text-gray-500">We're currently seeking sponsors for our events. Contact us to learn about sponsorship opportunities!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-5 h-2 bg-yellow-400 rounded"></div>
            <p className="text-gray-600 font-medium">Sponsors</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Sponsors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Grateful for the support of our amazing sponsors who make our events and community initiatives possible
          </p>
        </div>

        {/* Sponsors List - Single column layout with equal height cards */}
        <div className="space-y-8 mb-8">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.id}
              className={`${getRandomBackground(index)} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden group cursor-pointer`}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                height: '680px' // Adjusted for larger image section and compact 3-column info
              }}
              onClick={() => sponsor.websiteUrl && window.open(sponsor.websiteUrl, '_blank')}
            >
              <div className="flex flex-col h-full">
                {/* Image Section - Increased by another 10% (h-112 = 448px) for maximum image display */}
                <div className="relative w-full h-112 rounded-t-2xl overflow-hidden">
                  {sponsor.heroImageUrl ? (
                    <Image
                      src={sponsor.heroImageUrl}
                      alt={sponsor.name}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{
                        borderRadius: '1rem 1rem 0 0'
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center bg-gray-100"
                      style={{
                        borderRadius: '1rem 1rem 0 0'
                      }}
                    >
                      <span className="text-gray-400 text-5xl">🏢</span>
                    </div>
                  )}
                  {/* Sponsor Type Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      {sponsor.type}
                    </span>
                  </div>
                </div>

                {/* Content Section - Compact with 3-column layout */}
                <div className="p-4 border-t border-white/20">
                  {/* Sponsor Name */}
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {sponsor.name}
                  </h2>

                  {/* Sponsor Details - 3-column layout with smart centering for last item */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
                    {/* Company Name */}
                    {sponsor.companyName && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="text-lg font-semibold">
                          {sponsor.companyName}
                        </span>
                      </div>
                    )}

                    {/* Sponsor Type */}
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <span className="text-lg font-semibold">
                        {sponsor.type}
                      </span>
                    </div>

                    {/* Contact Email */}
                    {sponsor.contactEmail && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-lg font-semibold">
                          {sponsor.contactEmail}
                        </span>
                      </div>
                    )}

                    {/* Contact Phone */}
                    {sponsor.contactPhone && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="text-lg font-semibold">
                          {sponsor.contactPhone}
                        </span>
                      </div>
                    )}

                    {/* Website - Centers if it's the only item in the last row */}
                    {sponsor.websiteUrl && (
                      <div className="flex items-center gap-3 text-gray-700 lg:justify-self-center lg:col-start-2">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9a9 9 0 00-9-9m0 18a9 9 0 009-9M12 3a9 9 0 00-9 9" />
                          </svg>
                        </div>
                        <span className="text-lg font-semibold">
                          {sponsor.websiteUrl.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tagline/Description - Minimal bottom spacing */}
                  {sponsor.tagline && (
                    <div className="mb-1">
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {sponsor.tagline}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Sponsors Button */}
        <div className="text-center">
          <Link
            href="/sponsors"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span>See All Sponsors</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Custom CSS for text truncation */}
      <style jsx>{`
        /* Truncate text styles */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default OurSponsorsSection;
