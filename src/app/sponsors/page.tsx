'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { EventSponsorsDTO } from "@/types";
import { getAppUrl } from '@/lib/env';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<EventSponsorsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSponsors, setFilteredSponsors] = useState<EventSponsorsDTO[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Standard page size

  // Array of modern background colors
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

  const getRandomBackground = (index: number) => {
    return cardBackgrounds[index % cardBackgrounds.length];
  };

  useEffect(() => {
    fetchSponsors();
  }, [currentPage, searchTerm]); // Refetch when page or search changes

  async function fetchSponsors() {
    setLoading(true);
    setFetchError(false);
    try {
      // Fetch sponsors with pagination and search
      const params = new URLSearchParams({
        sort: 'priorityRanking,asc',
        page: (currentPage - 1).toString(), // Convert to 0-based for backend
        size: pageSize.toString(),
        'isActive.equals': 'true'
      });

      // Add search filter if provided
      if (searchTerm.trim()) {
        params.append('name.contains', searchTerm.trim());
      }

      const baseUrl = getAppUrl();
      const response = await fetch(`${baseUrl}/api/proxy/event-sponsors?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        const sponsorsList = Array.isArray(data) ? data : [];

        // Get total count from x-total-count header as per UI style guide
        const totalCountHeader = response.headers.get('x-total-count');
        const count = totalCountHeader ? parseInt(totalCountHeader, 10) : sponsorsList.length;
        const pages = Math.ceil(count / pageSize);

        console.log('✅ Fetched sponsors:', {
          page: currentPage,
          count: sponsorsList.length,
          totalCount: count,
          totalPages: pages
        });

        setSponsors(sponsorsList);
        setFilteredSponsors(sponsorsList);
        setTotalCount(count);
        setTotalPages(pages);
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

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Calculate pagination info
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = (currentPage - 1) * pageSize + filteredSponsors.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Our Sponsors</h1>
              <p className="text-lg text-gray-600 mt-2">
                Meet the organizations that support our community initiatives
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search sponsors..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : fetchError ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Sponsors</h3>
              <p className="text-gray-500">Please try refreshing the page or contact us if the problem persists.</p>
            </div>
          </div>
        ) : filteredSponsors.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No Sponsors Found' : 'No Sponsors Available'}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `No sponsors match "${searchTerm}". Try a different search term.`
                  : 'We\'re currently seeking sponsors for our events. Contact us to learn about sponsorship opportunities!'
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                {searchTerm
                  ? `Found ${totalCount} sponsor${totalCount !== 1 ? 's' : ''} matching "${searchTerm}"`
                  : `Showing ${totalCount} sponsor${totalCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>

            {/* Sponsors List - Single column stacked layout exactly like events page */}
            <div className="space-y-8">
              {filteredSponsors.map((sponsor, index) => (
                <div
                  key={sponsor.id}
                  className={`${getRandomBackground(index)} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden group cursor-pointer`}
                  onClick={() => sponsor.websiteUrl && window.open(sponsor.websiteUrl, '_blank')}
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Image Section - Top on all screen sizes, exactly like events page */}
                    <div className="relative w-full h-auto rounded-t-2xl overflow-hidden">
                      {sponsor.heroImageUrl ? (
                        <Image
                          src={sponsor.heroImageUrl}
                          alt={sponsor.name}
                          width={800}
                          height={600}
                          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                          style={{
                            backgroundColor: 'transparent',
                            borderRadius: '1rem 1rem 0 0'
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-80 flex items-center justify-center"
                          style={{
                            backgroundColor: 'transparent',
                            borderRadius: '1rem 1rem 0 0'
                          }}
                        >
                          <span className="text-gray-400 text-4xl">🏢</span>
                        </div>
                      )}
                      {/* Sponsor Type Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                          {sponsor.type}
                        </span>
                      </div>
                    </div>

                    {/* Content Section - Bottom on all screen sizes, exactly like events page */}
                    <div className="p-6 border-t border-white/20">
                      {/* Sponsor Name */}
                      <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        {sponsor.name}
                      </h2>

                      {/* Company Name */}
                      {sponsor.companyName && (
                        <p className="text-gray-600 text-lg mb-4">
                          {sponsor.companyName}
                        </p>
                      )}

                      {/* Sponsor Details */}
                      <div className="space-y-3 mb-6">
                        {/* Contact Email */}
                        {sponsor.contactEmail && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <span className="text-2xl">📧</span>
                            <span className="text-lg font-semibold">
                              {sponsor.contactEmail}
                            </span>
                          </div>
                        )}

                        {/* Contact Phone */}
                        {sponsor.contactPhone && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <span className="text-2xl">📞</span>
                            <span className="text-lg font-semibold">
                              {sponsor.contactPhone}
                            </span>
                          </div>
                        )}

                        {/* Website */}
                        {sponsor.websiteUrl && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <span className="text-2xl">🌐</span>
                            <span className="text-lg font-semibold">
                              {sponsor.websiteUrl.replace(/^https?:\/\//, '')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tagline/Description */}
                      {sponsor.tagline && (
                        <div className="mb-6">
                          <p className="text-gray-600 text-lg">
                            {sponsor.tagline}
                          </p>
                        </div>
                      )}

                      {/* Action Button - Only for sponsors with website */}
                      {sponsor.websiteUrl && (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(sponsor.websiteUrl, '_blank');
                            }}
                            className="transition-transform hover:scale-105"
                          >
                            <img
                              src="/images/buy_tickets_click_here_red.webp"
                              alt="Visit Website"
                              className="object-contain"
                              style={{
                                width: '200px',
                                height: '70px'
                              }}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls - Always show, following UI Style Guide */}
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <button
                  disabled={!hasPrevPage}
                  onClick={handlePrevPage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${hasPrevPage
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <FaChevronLeft />
                  Previous
                </button>

                <div className="text-sm font-semibold text-gray-700">
                  Page {currentPage} of {Math.max(totalPages, 1)}
                </div>

                <button
                  disabled={!hasNextPage}
                  onClick={handleNextPage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${hasNextPage
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>

              <div className="text-center text-sm text-gray-600 mt-2">
                Showing {filteredSponsors.length > 0 ? startItem : 0} to {filteredSponsors.length > 0 ? endItem : 0} of {totalCount} sponsors
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
