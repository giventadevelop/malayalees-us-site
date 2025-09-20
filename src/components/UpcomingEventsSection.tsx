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
            {/* Events List - Single column layout exactly like sponsors section */}
            <div className="space-y-8 mb-8">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`${getRandomBackground(index)} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden group cursor-pointer`}
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                  }}
                  onClick={() => window.location.href = `/events/${event.id}`}
                >
                  <div className="flex flex-col h-full">
                    {/* Image Section - Top on all screen sizes, exactly like events page */}
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
                      {!isUpcomingEvents && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                            Past Event
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section - Bottom on all screen sizes, exactly like events page */}
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

                      {/* Event Details - 3-column layout with smart centering for last item */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-lg font-semibold">
                            {formatDate(event.startDate, event.timezone)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-lg font-semibold">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-3 text-gray-700 lg:justify-self-center lg:col-start-2">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="text-lg font-semibold">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Only for upcoming events with minimal spacing */}
                      {isUpcomingEvents && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-1">
                          {/* Buy Tickets Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/events/${event.id}/tickets`;
                            }}
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
                          </button>
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
