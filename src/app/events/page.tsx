"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { EventWithMedia, EventDetailsDTO } from "@/types";
import { formatInTimeZone } from 'date-fns-tz';
import LocationDisplay from '@/components/LocationDisplay';
// import { formatInTimeZone } from 'date-fns-tz';

const EVENTS_PAGE_SIZE = 10;

// Component for handling long descriptions with expand/collapse
function DescriptionDisplay({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200; // characters

  if (description.length <= maxLength) {
    return (
      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {description}
      </div>
    );
  }

  const truncatedText = description.substring(0, maxLength).trim();

  return (
    <div className="text-sm text-gray-700 leading-relaxed">
      <div className="whitespace-pre-wrap">
        {isExpanded ? description : `${truncatedText}...`}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="mt-3 inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm"
      >
        {isExpanded ? 'Show less' : 'See Event Details →'}
      </button>
    </div>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventWithMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [heroImageUrl, setHeroImageUrl] = useState<string>("/images/default_placeholder_hero_image.jpeg");
  const [fetchError, setFetchError] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Array of modern background colors inspired by the Dribbble design
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

  // Function to get random background color for each event
  const getRandomBackground = (index: number) => {
    return cardBackgrounds[index % cardBackgrounds.length];
  };

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setFetchError(false);
      try {
        // Build query parameters based on date filter
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const queryParams = new URLSearchParams({
          sort: showPastEvents ? 'startDate,desc' : 'startDate,asc',
          page: page.toString(),
          size: EVENTS_PAGE_SIZE.toString()
        });

        // Add search filters
        if (searchTitle.trim()) {
          queryParams.append('title.contains', searchTitle.trim());
        }

        // Handle date filtering - prioritize search date range over toggle
        if (searchDateFrom || searchDateTo) {
          // If user has specified date range, use that instead of toggle logic
          if (searchDateFrom) {
            queryParams.append('startDate.greaterThanOrEqual', searchDateFrom);
          }
          if (searchDateTo) {
            queryParams.append('startDate.lessThanOrEqual', searchDateTo);
          }
        } else {
          // No search date range specified, use toggle logic
          if (showPastEvents) {
            // Show events that ended before today
            queryParams.append('endDate.lessThan', today);
          } else {
            // Show events that start today or later (future events including today)
            queryParams.append('startDate.greaterThanOrEqual', today);
          }
        }

        // Fetch paginated events with date filtering
        const eventsRes = await fetch(`/api/proxy/event-details?${queryParams.toString()}`);
        if (!eventsRes.ok) throw new Error('Failed to fetch events');
        const events: EventDetailsDTO[] = await eventsRes.json();
        let eventList = Array.isArray(events) ? events : [events];
        // For each event, fetch its flyer
        const eventsWithMedia = await Promise.all(
          eventList.map(async (event: EventDetailsDTO) => {
            try {
              const mediaRes = await fetch(`/api/proxy/event-medias?eventId.equals=${event.id}&eventFlyer.equals=true`);
              const mediaData = await mediaRes.json();
              if (mediaData && mediaData.length > 0) {
                return { ...event, thumbnailUrl: mediaData[0].fileUrl };
              }
              return { ...event, thumbnailUrl: undefined };
            } catch {
              return { ...event, thumbnailUrl: undefined };
            }
          })
        );
        setEvents(eventsWithMedia);
        // Remove totalPages logic, since not present in array response
        setTotalPages(1);

        // Hero image logic: earliest upcoming event within 3 months
        const currentDate = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);
        const upcoming = eventsWithMedia
          .filter(e => e.startDate && new Date(e.startDate) >= currentDate && e.thumbnailUrl)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        if (upcoming.length > 0) {
          const nextEvent = upcoming[0];
          const eventDate = nextEvent.startDate ? new Date(nextEvent.startDate) : null;
          if (eventDate && eventDate <= threeMonthsFromNow && nextEvent.thumbnailUrl) {
            setHeroImageUrl(nextEvent.thumbnailUrl);
            return;
          }
        }
        setHeroImageUrl("/images/default_placeholder_hero_image.jpeg");
      } catch (err) {
        setFetchError(true);
        setEvents([]);
        setHeroImageUrl("/images/default_placeholder_hero_image.jpeg");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [page, showPastEvents, searchTitle, searchDateFrom, searchDateTo]);

  // Helper to generate Google Calendar URL
  function toGoogleCalendarDate(date: string, time: string) {
    if (!date || !time) return '';
    const [year, month, day] = date.split('-');
    let [hour, minute] = time.split(':');
    let ampm = '';
    if (minute && minute.includes(' ')) {
      [minute, ampm] = minute.split(' ');
    }
    let h = parseInt(hour, 10);
    if (ampm && ampm.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (ampm && ampm.toUpperCase() === 'AM' && h === 12) h = 0;
    return `${year}${month}${day}T${String(h).padStart(2, '0')}${minute}00`;
  }

  // Helper to format time with AM/PM
  function formatTime(time: string): string {
    if (!time) return '';
    // Accepts 'HH:mm' or 'hh:mm AM/PM' and returns 'hh:mm AM/PM'
    if (time.match(/AM|PM/i)) return time;
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  }

  // Helper to format date
  function formatDate(dateString: string, timezone: string = 'America/New_York'): string {
    if (!dateString) return '';
    // Use formatInTimeZone to display the date in the event's timezone
    return formatInTimeZone(dateString, timezone, 'EEEE, MMMM d, yyyy');
  }

  // Search functionality
  const handleSearch = async () => {
    setIsSearching(true);
    setPage(0); // Reset to first page when searching
    // The useEffect will trigger automatically due to dependency changes
  };

  const clearSearch = () => {
    setSearchTitle("");
    setSearchDateFrom("");
    setSearchDateTo("");
    setPage(0);
    setIsSearching(false);
    // Reset to future events when clearing search
    setShowPastEvents(false);
  };

  return (
    <div className="w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Line clamp utilities */
          .line-clamp-1 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          .line-clamp-2 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          /* Mobile-specific hero adjustments */
          @media (max-width: 767px) {
            .hero-section {
              min-height: 180px !important;
              height: 180px !important;
              padding-top: 80px !important;
              background-color: #000 !important;
              margin: 0 !important;
              padding: 80px 0 0 0 !important;
            }
            /* Prevent horizontal overflow */
            body {
              overflow-x: hidden !important;
            }
            /* Prevent image cutoff */
            .event-image-container {
              overflow: hidden !important;
              max-width: 100% !important;
              padding: 0 10px !important;
            }
            .event-image-container img {
              max-width: 100% !important;
              height: auto !important;
              object-fit: contain !important;
            }
            /* Ensure content fits mobile viewport */
            .container {
              max-width: 100vw !important;
              padding-left: 15px !important;
              padding-right: 15px !important;
            }
            /* Ensure mobile text doesn't duplicate */
            .hero-title {
              display: none !important;
            }
            /* Ensure mobile text stays within hero bounds */
            .hero-section h1 {
              margin-bottom: 0 !important;
              padding-bottom: 0 !important;
            }
            /* Mobile feature box spacing - increased significantly */
            .feature-boxes-container {
              margin-top: 180px !important;
            }
            /* Ensure mobile hero has solid black background */
            .flex.md\\:hidden {
              background-color: #000 !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              outline: none !important;
            }
            /* Force all mobile hero elements to have black background */
            .flex.md\\:hidden * {
              background-color: #000 !important;
            }
            /* Ensure no white spaces in mobile hero */
            .flex.md\\:hidden img {
              margin: 0 !important;
              padding: 0 !important;
            }
            .flex.md\\:hidden div {
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
            }
            .flex.md\\:hidden h1 {
              margin: 0 !important;
              padding: 0 !important;
              background-color: #000 !important;
            }
          }
          /* Desktop-specific adjustments */
          @media (min-width: 768px) {
            .hero-section {
              min-height: 320px !important;
              height: 320px !important;
              padding-top: 100px !important;
            }
            .feature-boxes-container {
              margin-top: 120px !important;
            }
            /* Ensure desktop doesn't show mobile elements */
            .flex.md\\:hidden {
              display: none !important;
            }
          }
        `
      }} />
      <section className="hero-section events-hero-section" style={{
        height: '320px',
        minHeight: '320px',
        position: 'relative',
        overflow: 'visible',
        backgroundColor: '#000',
        marginBottom: 0,
        paddingBottom: 0,
        paddingTop: '100px',
        marginTop: 0
      }}>
        {/* Desktop Layout */}
        <div className="hidden md:flex hero-content" style={{
          position: 'relative',
          zIndex: 3,
          padding: '0 20px',
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: '100%',
          minHeight: 200,
          gap: '40px',
          paddingTop: '50px',
          paddingBottom: '70px'
        }}>
          <img src="/images/mcefee_logo_black_border_transparent.png" className="hero-mcafee-logo" alt="MCEFEE Logo" style={{ width: 240, height: 'auto', opacity: 0.6, marginLeft: -200 }} />
          <h1 className="hero-title" style={{
            fontSize: 26,
            lineHeight: 1.4,
            color: 'white',
            maxWidth: 450,
            fontFamily: 'Sora, sans-serif',
            marginLeft: -20,
            marginRight: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <span>Connecting Cultures,</span>
            <span>Empowering Generations –</span>
            <span style={{ color: '#ffce59', fontSize: 26 }}>Celebrating Malayali Roots in the USA</span>
          </h1>
        </div>
        {/* Mobile Layout */}
        <div className="flex md:hidden" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0px',
          minHeight: '160px',
          backgroundColor: '#000',
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '100vw',
          height: '100%',
          margin: '0px',
          border: 'none',
          outline: 'none'
        }}>
          {/* Mobile Logo */}
          <img src="/images/mcefee_logo_black_border_transparent.png" alt="MCEFEE Logo" style={{
            width: '200px',
            height: 'auto',
            opacity: 0.9,
            display: 'block',
            margin: '20px auto 10px auto',
            padding: '0px'
          }} />

          {/* Mobile Main Text - Single instance only */}
          <div style={{
            backgroundColor: '#000',
            padding: '0px',
            margin: '0px',
            width: '100%',
            border: 'none',
            outline: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h1 style={{
              fontSize: '18px',
              lineHeight: 1.3,
              color: 'white',
              maxWidth: '300px',
              fontFamily: 'Sora, sans-serif',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              textAlign: 'center',
              margin: '0px auto',
              padding: '0px',
              fontWeight: '500',
              backgroundColor: '#000',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <span>Connecting Cultures,</span>
              <span>Empowering Generations –</span>
              <span style={{ color: '#ffce59', fontSize: '18px', fontWeight: '600' }}>Celebrating Malayali Roots in the USA</span>
            </h1>
          </div>
        </div>
        {/* Desktop Background */}
        <div className="hidden md:block hero-background" style={{
          position: 'absolute',
          top: '25%',
          right: '10px',
          left: 'auto',
          width: '30%',
          height: '75%',
          backgroundImage: "url('/images/kathakali_with_back_light_hero_ai.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8,
          filter: 'blur(0.5px)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          {/* Top gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '15%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 100%)',
            zIndex: 1,
            filter: 'blur(1px)'
          }}></div>
          {/* Bottom gradient overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '15%',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 100%)',
            zIndex: 1,
            filter: 'blur(1px)'
          }}></div>
          {/* Left gradient overlay - enhanced for better fade */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '20%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)',
            zIndex: 1,
            filter: 'blur(1px)'
          }}></div>

          {/* Additional left fade gradient for smoother transition */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '35%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.05) 80%, rgba(0,0,0,0) 100%)',
            zIndex: 1,
            filter: 'blur(1.5px)'
          }}></div>
          {/* Right gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '25%',
            height: '100%',
            background: 'linear-gradient(270deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 100%)',
            zIndex: 1,
            filter: 'blur(1px)'
          }}></div>
          {/* Corner gradient overlays for smoother blending */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '20%',
            height: '20%',
            background: 'radial-gradient(ellipse at top left, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
            zIndex: 2
          }}></div>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '30%',
            height: '30%',
            background: 'radial-gradient(ellipse at top right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
            zIndex: 2
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '30%',
            height: '30%',
            background: 'radial-gradient(ellipse at bottom left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
            zIndex: 2
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '30%',
            height: '30%',
            background: 'radial-gradient(ellipse at bottom right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
            zIndex: 2
          }}></div>
        </div>
        {/* Hero overlay removed to match events page brightness */}
      </section>

      {/* Mobile Spacer Div - Creates space between hero and events list on mobile only */}
      <div className="block md:hidden" style={{ height: '150px', width: '100%', backgroundColor: 'transparent' }}></div>

      {/* Event List */}
      <div className="max-w-6xl mx-auto px-8 py-12 md:px-16 lg:px-24" style={{ paddingTop: '60px' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-6">All Events</h1>

          {/* Event Filter Toggle */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className={`text-lg font-medium ${!showPastEvents ? 'text-blue-600' : 'text-gray-500'}`}>
              Future Events
            </span>
            <button
              onClick={() => {
                setShowPastEvents(!showPastEvents);
                setPage(0); // Reset to first page when switching
              }}
              className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ backgroundColor: showPastEvents ? '#3b82f6' : '#d1d5db' }}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${showPastEvents ? 'translate-x-7' : 'translate-x-1'
                  }`}
              />
            </button>
            <span className={`text-lg font-medium ${showPastEvents ? 'text-blue-600' : 'text-gray-500'}`}>
              Past Events
            </span>
          </div>

          {/* Filter Description */}
          <p className="text-gray-600 text-sm">
            {showPastEvents
              ? 'Showing past events (events that have already ended)'
              : 'Showing future events (including events happening today)'
            }
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Search Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Title Search */}
              <div className="space-y-2">
                <label htmlFor="searchTitle" className="block text-sm font-medium text-gray-700">
                  Search by Title
                </label>
                <input
                  type="text"
                  id="searchTitle"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Enter event title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Date Range - Grouped Together */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="searchDateFrom" className="block text-xs text-gray-600 mb-1">
                      From
                    </label>
                    <input
                      type="date"
                      id="searchDateFrom"
                      value={searchDateFrom}
                      onChange={(e) => setSearchDateFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="searchDateTo" className="block text-xs text-gray-600 mb-1">
                      To
                    </label>
                    <input
                      type="date"
                      id="searchDateTo"
                      value={searchDateTo}
                      onChange={(e) => setSearchDateTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Search Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSearch}
                  disabled={loading || isSearching}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading || isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      Search Events
                    </>
                  )}
                </button>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Clear Search
                </button>
              </div>
            </div>

            {/* Search Results Info */}
            {(searchTitle || searchDateFrom || searchDateTo) && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Search Active:</span>
                  {searchTitle && ` Title contains "${searchTitle}"`}
                  {searchTitle && (searchDateFrom || searchDateTo) && ' and'}
                  {searchDateFrom && searchDateTo && ` Date between "${searchDateFrom}" and "${searchDateTo}"`}
                  {searchDateFrom && !searchDateTo && ` Date from "${searchDateFrom}" onwards`}
                  {!searchDateFrom && searchDateTo && ` Date until "${searchDateTo}"`}
                  {(searchDateFrom || searchDateTo) && (
                    <span className="block mt-1 text-xs text-blue-600">
                      (Date range search overrides Future/Past Events toggle)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative">
              <Image
                src="/images/loading_events.jpg"
                alt="Loading events..."
                width={300}
                height={300}
                className="rounded-lg shadow-2xl animate-pulse"
                priority
              />
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="wavy-animation"></div>
              </div>
            </div>
          </div>
        ) : fetchError ? (
          <div className="text-center text-red-600 font-bold py-8">
            Sorry, we couldn't load events at this time. Please try again later.
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No events found.
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`${getRandomBackground(index)} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden group`}
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Image Section - Top on all screen sizes */}
                    <div className="relative w-full h-auto rounded-t-2xl overflow-hidden">
                      {event.thumbnailUrl ? (
                        <Image
                          src={event.thumbnailUrl}
                          alt={event.title}
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
                          <span className="text-gray-400 text-4xl">📅</span>
                        </div>
                      )}
                      {/* Past Event Badge */}
                      {showPastEvents && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                            Past Event
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section - Bottom on all screen sizes */}
                    <div className="p-6 border-t border-white/20">
                      {/* Title */}
                      <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        {event.title}
                      </h2>

                      {/* Caption */}
                      {event.caption && (
                        <p className="text-gray-600 text-lg mb-4">
                          {event.caption}
                        </p>
                      )}

                      {/* Event Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-700">
                          <span className="text-2xl">📅</span>
                          <span className="text-lg font-semibold">
                            {formatDate(event.startDate, event.timezone)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <span className="text-2xl">🕐</span>
                          <span className="text-lg font-semibold">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)} (EDT)
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <span className="text-2xl">📍</span>
                            <span className="text-lg font-semibold">
                              {event.location}
                            </span>
                            {/* Copy and Navigate Icons - moved closer to location text */}
                            <div className="flex gap-1 ml-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(event.location || '');
                                  alert('Address copied to clipboard!');
                                }}
                                className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                                title="Copy Address"
                              >
                                <span className="text-sm">📋</span>
                              </button>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                                title="Open in Google Maps"
                              >
                                <span className="text-sm">🗺️</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description with modern button */}
                      {event.description && (
                        <div className="mb-6">
                          <DescriptionDisplay description={event.description} />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Buy Tickets Image - Only for future events */}
                        {(() => {
                          if (showPastEvents) return null;

                          const currentDate = new Date();
                          const eventDate = event.startDate ? new Date(event.startDate) : null;
                          const isUpcoming = eventDate && eventDate >= currentDate;

                          if (!isUpcoming) return null;

                          return (
                            <Link
                              href={`/events/${event.id}/tickets`}
                              className="transition-transform hover:scale-105"
                            >
                              <img
                                src="/images/buy_tickets_click_here_red.webp"
                                alt="Buy Tickets"
                                className="object-contain"
                                style={{
                                  width: '200px',
                                  height: '70px'
                                }}
                              />
                            </Link>
                          );
                        })()}

                        {/* Calendar Link - Only for future events */}
                        {(() => {
                          if (showPastEvents) return null;

                          const currentDate = new Date();
                          const eventDate = event.startDate ? new Date(event.startDate) : null;
                          const isUpcoming = eventDate && eventDate >= currentDate;
                          if (!isUpcoming) return null;

                          const start = toGoogleCalendarDate(event.startDate, event.startTime);
                          const end = toGoogleCalendarDate(event.endDate, event.endTime);
                          const text = encodeURIComponent(event.title);
                          const details = encodeURIComponent(event.description || '');
                          const location = encodeURIComponent(event.location || '');
                          const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;

                          return (
                            <a
                              href={calendarLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-3"
                            >
                              <span className="text-2xl">📅</span>
                              <span className="text-lg">Add to Calendar</span>
                            </a>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination controls */}
            <div className="flex justify-center items-center mt-12 gap-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <span>←</span>
                <span>Previous</span>
              </button>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                disabled={page + 1 >= totalPages}
                className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}