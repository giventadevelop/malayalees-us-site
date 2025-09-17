'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { EventWithMedia, EventDetailsDTO } from "@/types";
import { formatInTimeZone } from 'date-fns-tz';

const UpcomingEventsSection: React.FC = () => {
  const [events, setEvents] = useState<EventWithMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isUpcomingEvents, setIsUpcomingEvents] = useState(true);

  // Cache key for sessionStorage
  const CACHE_KEY = 'homepage_events_cache';
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

  // Function to get random background color for each event
  const getRandomBackground = (index: number) => {
    return cardBackgrounds[index % cardBackgrounds.length];
  };

  useEffect(() => {
    async function fetchEvents() {
      // Check cache first
      try {
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp, isUpcoming } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log('✅ Using cached events data');
            setEvents(data);
            setIsUpcomingEvents(isUpcoming);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to read events cache:', error);
      }

      setLoading(true);
      setFetchError(false);
      try {
        // First try to get upcoming events (max 6)
        const today = new Date().toISOString().split('T')[0];
        const upcomingParams = new URLSearchParams({
          sort: 'startDate,asc',
          page: '0',
          size: '6',
          'startDate.greaterThanOrEqual': today
        });

        const upcomingRes = await fetch(`/api/proxy/event-details?${upcomingParams.toString()}`);
        if (!upcomingRes.ok) throw new Error('Failed to fetch upcoming events');
        const upcomingEvents: EventDetailsDTO[] = await upcomingRes.json();
        let upcomingEventList = Array.isArray(upcomingEvents) ? upcomingEvents : [upcomingEvents];

        // If we have upcoming events, use them
        if (upcomingEventList.length > 0) {
          const eventsWithMedia = await Promise.all(
            upcomingEventList.map(async (event: EventDetailsDTO) => {
              try {
                // First try to find homepage hero image
                let mediaRes = await fetch(`/api/proxy/event-medias?eventId.equals=${event.id}&isHomePageHeroImage.equals=true`);
                let mediaData = await mediaRes.json();

                // If no homepage hero image found, try regular hero image
                if (!mediaData || mediaData.length === 0) {
                  mediaRes = await fetch(`/api/proxy/event-medias?eventId.equals=${event.id}&isHeroImage.equals=true`);
                  mediaData = await mediaRes.json();
                }

                if (mediaData && mediaData.length > 0) {
                  return { ...event, thumbnailUrl: mediaData[0].fileUrl };
                }
                return { ...event, thumbnailUrl: undefined };
              } catch {
                return { ...event, thumbnailUrl: undefined };
              }
            })
          );

          // Cache the upcoming events data
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
              data: eventsWithMedia,
              timestamp: Date.now(),
              isUpcoming: true
            }));
          } catch (error) {
            console.warn('Failed to cache events data:', error);
          }

          setEvents(eventsWithMedia);
          setIsUpcomingEvents(true);
        } else {
          // No upcoming events, try to get past events (max 6)
          const pastParams = new URLSearchParams({
            sort: 'startDate,desc',
            page: '0',
            size: '6',
            'endDate.lessThan': today
          });

          const pastRes = await fetch(`/api/proxy/event-details?${pastParams.toString()}`);
          if (!pastRes.ok) throw new Error('Failed to fetch past events');
          const pastEvents: EventDetailsDTO[] = await pastRes.json();
          let pastEventList = Array.isArray(pastEvents) ? pastEvents : [pastEvents];

          const eventsWithMedia = await Promise.all(
            pastEventList.map(async (event: EventDetailsDTO) => {
              try {
                // First try to find homepage hero image
                let mediaRes = await fetch(`/api/proxy/event-medias?eventId.equals=${event.id}&isHomePageHeroImage.equals=true`);
                let mediaData = await mediaRes.json();

                // If no homepage hero image found, try regular hero image
                if (!mediaData || mediaData.length === 0) {
                  mediaRes = await fetch(`/api/proxy/event-medias?eventId.equals=${event.id}&isHeroImage.equals=true`);
                  mediaData = await mediaRes.json();
                }

                if (mediaData && mediaData.length > 0) {
                  return { ...event, thumbnailUrl: mediaData[0].fileUrl };
                }
                return { ...event, thumbnailUrl: undefined };
              } catch {
                return { ...event, thumbnailUrl: undefined };
              }
            })
          );

          // Cache the past events data
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
              data: eventsWithMedia,
              timestamp: Date.now(),
              isUpcoming: false
            }));
          } catch (error) {
            console.warn('Failed to cache events data:', error);
          }

          setEvents(eventsWithMedia);
          setIsUpcomingEvents(false);
        }
      } catch (err) {
        setFetchError(true);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Helper to format time with AM/PM
  function formatTime(time: string): string {
    if (!time) return '';
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
    return formatInTimeZone(dateString, timezone, 'EEEE, MMMM d, yyyy');
  }

  // isUpcomingEvents state is managed in useEffect based on which type of events were fetched

  // Don't render anything while loading - section will appear only when fully loaded
  if (loading) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-5 h-2 bg-yellow-400 rounded"></div>
            <p className="text-gray-600 font-medium">Events</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isUpcomingEvents ? 'Upcoming Events' : 'Recent Events'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isUpcomingEvents
              ? 'Join us for our upcoming cultural celebrations and community events (showing up to 6 events)'
              : 'Take a look at our recent events and community gatherings (showing up to 6 events)'
            }
          </p>
        </div>

        {fetchError ? (
          <div className="text-center text-red-600 font-bold py-8">
            Sorry, we couldn't load events at this time. Please try again later.
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Available</h3>
              <p className="text-gray-500">We're currently planning our next events. Check back soon for updates!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Events Grid - Centered layout like TeamSection */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 mx-auto events-grid" style={{
              // Responsive max-width calculations like TeamSection
              maxWidth: '100%'
            }}>
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`${getRandomBackground(index)} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    width: '300px',
                    maxWidth: '300px',
                    height: '400px', // Fixed height for consistent card sizes
                    flexShrink: 0
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Image Section - Reduced height */}
                    <div className="relative w-full h-32 rounded-t-xl overflow-hidden">
                      {event.thumbnailUrl ? (
                        <Image
                          src={event.thumbnailUrl}
                          alt={event.title}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-2xl">📅</span>
                        </div>
                      )}
                      {/* Event Type Badge */}
                      {!isUpcomingEvents && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                            Past Event
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section - Compact */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Title - Truncated */}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Caption - Truncated */}
                      {event.caption && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {event.caption}
                        </p>
                      )}

                      {/* Event Details - Compact */}
                      <div className="space-y-2 mb-4 flex-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-sm">📅</span>
                          <span className="text-sm font-medium">
                            {formatDate(event.startDate, event.timezone)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-sm">🕐</span>
                          <span className="text-sm font-medium">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="text-sm">📍</span>
                            <span className="text-sm font-medium line-clamp-1">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button - Only for upcoming events */}
                      {isUpcomingEvents && (
                        <div className="mt-auto">
                          <Link
                            href={`/events/${event.id}/tickets`}
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                          >
                            View Details
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Events Button */}
            <div className="text-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span>View All Events</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
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

        /* Events Grid with Perfect Centering like TeamSection */
        .events-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          width: 100%;
          justify-content: center;
          align-items: flex-start;
          margin: 0 auto;
        }

        /* Desktop: 3 columns with centered alignment (for up to 6 events) */
        @media (min-width: 1200px) {
          .events-grid {
            max-width: calc(3 * 300px + 2 * 1.5rem);
          }
        }

        /* Large tablet: 2 columns with centered alignment */
        @media (min-width: 900px) and (max-width: 1199px) {
          .events-grid {
            max-width: calc(2 * 300px + 1 * 1.5rem);
          }
        }

        /* Tablet: 2 columns with centered alignment */
        @media (min-width: 600px) and (max-width: 899px) {
          .events-grid {
            max-width: calc(2 * 300px + 1 * 1.5rem);
          }
        }

        /* Mobile: 1 column with centered alignment */
        @media (max-width: 599px) {
          .events-grid {
            max-width: 320px;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
};

export default UpcomingEventsSection;
