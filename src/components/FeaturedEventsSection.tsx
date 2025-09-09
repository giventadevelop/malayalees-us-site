'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatInTimeZone } from 'date-fns-tz';
import type { EventDetailsDTO, EventMediaDTO } from '@/types';
import { getAppUrl } from '@/lib/env';

interface FeaturedEventWithMedia {
  event: EventDetailsDTO;
  media: EventMediaDTO;
}

const FeaturedEventsSection: React.FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEventWithMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Reuse the same logic from HeroSection for filtering events in next 3 months
  const isEventInNextThreeMonths = (eventDate: string): boolean => {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    const eventStartDate = new Date(eventDate);
    return eventStartDate >= today && eventStartDate <= threeMonthsFromNow;
  };

  // Reuse the same fetch logic from HeroSection but filter for isFeaturedEventImage = true
  const fetchFeaturedEvents = async (): Promise<FeaturedEventWithMedia[]> => {
    const baseUrl = getAppUrl();
    const featuredEventsData: FeaturedEventWithMedia[] = [];

    try {
      // Use the same events fetch logic as HeroSection
      let eventsResponse = await fetch(
        `${baseUrl}/api/proxy/event-details?sort=startDate,asc`,
        { cache: 'no-store' }
      );

      if (!eventsResponse.ok) {
        console.log('Events fetch failed with status:', eventsResponse.status);
        // Try fallback like HeroSection does
        try {
          eventsResponse = await fetch(
            `${baseUrl}/api/proxy/event-details?sort=startDate,desc`,
            { cache: 'no-store' }
          );
          if (!eventsResponse.ok) {
            console.log('Fallback events fetch also failed with status:', eventsResponse.status);
            return [];
          }
        } catch (fallbackErr) {
          console.error('Fallback events fetch error:', fallbackErr);
          return [];
        }
      }

      const events: EventDetailsDTO[] = await eventsResponse.json();
      console.log('Fetched events for featured section:', events.length);

      // Apply the same filtering logic as HeroSection: events in next 3 months and active
      const upcomingEvents = events.filter(event =>
        event.startDate &&
        isEventInNextThreeMonths(event.startDate) &&
        event.isActive
      );

      console.log('Upcoming events in next 3 months:', upcomingEvents.length);

      // For each upcoming event, check if it has featured event media (isFeaturedEventImage = true)
      const allFeaturedEvents: FeaturedEventWithMedia[] = [];

      for (const event of upcomingEvents) {
        try {
          // Use the same media fetch pattern as HeroSection but for isFeaturedEventImage
          const mediaResponse = await fetch(
            `${baseUrl}/api/proxy/event-medias?eventId.equals=${event.id}&isFeaturedEventImage.equals=true`,
            { cache: 'no-store' }
          );

          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json();
            const mediaArray = Array.isArray(mediaData) ? mediaData : (mediaData ? [mediaData] : []);

            // Client-side filter to ensure we only get items where isFeaturedEventImage is explicitly true
            const featuredMedia = mediaArray.filter(media => media.isFeaturedEventImage === true);

            if (featuredMedia.length > 0) {
              allFeaturedEvents.push({
                event,
                media: featuredMedia[0] // Take the first featured media
              });
              console.log(`Found featured event: ${event.title} with priority: ${event.featuredEventPriority} and media: ${featuredMedia[0].fileUrl}`);
            }
          } else {
            console.log(`Event ${event.id}: Featured event image fetch failed with status ${mediaResponse.status}`);
          }
        } catch (mediaError) {
          console.error(`Error fetching featured media for event ${event.id}:`, mediaError);
        }
      }

      // Priority-based filtering logic
      if (allFeaturedEvents.length === 0) {
        console.log('No featured events found');
        return [];
      }

      if (allFeaturedEvents.length === 1) {
        console.log('Only one featured event found, selecting it');
        featuredEventsData.push(allFeaturedEvents[0]);
        return featuredEventsData;
      }

      // Group events by priority
      const eventsByPriority = new Map<number, FeaturedEventWithMedia[]>();

      allFeaturedEvents.forEach(featuredEvent => {
        const priority = featuredEvent.event.featuredEventPriority || 0; // Default to 0 if not set
        if (!eventsByPriority.has(priority)) {
          eventsByPriority.set(priority, []);
        }
        eventsByPriority.get(priority)!.push(featuredEvent);
      });

      // Find the highest priority (lowest number = highest priority)
      const priorities = Array.from(eventsByPriority.keys()).sort((a, b) => a - b);
      const highestPriority = priorities[0];
      const highestPriorityEvents = eventsByPriority.get(highestPriority) || [];

      console.log(`Found ${allFeaturedEvents.length} featured events across ${priorities.length} priority levels`);
      console.log(`Highest priority: ${highestPriority} with ${highestPriorityEvents.length} events`);

      // Select from highest priority events
      if (highestPriorityEvents.length === 1) {
        console.log('Only one event with highest priority, selecting it');
        featuredEventsData.push(highestPriorityEvents[0]);
      } else {
        // Multiple events with same highest priority - choose randomly
        const randomIndex = Math.floor(Math.random() * highestPriorityEvents.length);
        console.log(`Multiple events with same priority (${highestPriority}), randomly selecting index ${randomIndex}`);
        featuredEventsData.push(highestPriorityEvents[randomIndex]);
      }

      console.log('Total featured events selected:', featuredEventsData.length);
      return featuredEventsData;

    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  };

  // Load featured events after hero section is loaded (same timing as HeroSection)
  useEffect(() => {
    const loadFeaturedEvents = async () => {
      try {
        setIsLoading(true);
        const events = await fetchFeaturedEvents();
        setFeaturedEvents(events);

        // Only show the section if we have featured events
        if (events.length > 0) {
          // Add a delay to ensure hero section is fully loaded (same timing as HeroSection)
          setTimeout(() => {
            setIsVisible(true);
          }, 2000); // Same 2-second delay as HeroSection
        }
      } catch (error) {
        console.error('Failed to load featured events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load after a delay to ensure hero section is loaded
    const timer = setTimeout(loadFeaturedEvents, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything if loading or no featured events
  if (isLoading || featuredEvents.length === 0) {
    return null;
  }

  // Don't render if not visible yet
  if (!isVisible) {
    return null;
  }

  return (
    <section className="py-0 md:py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Featured Events
          </h2>
        </div>

        {/* Featured Events Strip */}
        <div className="space-y-4 md:space-y-6">
          {featuredEvents.map((featuredEvent, index) => (
            <div
              key={featuredEvent.event.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-auto md:h-[200px]"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Column - Featured Event Image (60% width on desktop, full width on mobile) */}
                <div className="w-full md:w-[60%] h-48 md:h-full relative overflow-hidden rounded-t-2xl md:rounded-t-none md:rounded-l-2xl">
                  {featuredEvent.media.fileUrl ? (
                    <Image
                      src={featuredEvent.media.fileUrl}
                      alt={featuredEvent.media.altText || featuredEvent.event.title}
                      fill
                      className="object-cover"
                      style={{
                        backgroundColor: 'transparent'
                      }}
                      priority={index === 0}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No image available</p>
                      </div>
                    </div>
                  )}

                  {/* Featured Event Badge Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Featured Event
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Event Details (40% width on desktop, full width on mobile) */}
                <div className="w-full md:w-[40%] p-4 md:p-6 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {featuredEvent.event.title}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {featuredEvent.event.timezone
                            ? formatInTimeZone(featuredEvent.event.startDate, featuredEvent.event.timezone, 'EEEE, MMMM d, yyyy (zzz)')
                            : new Date(featuredEvent.event.startDate).toLocaleDateString()
                          }
                        </span>
                      </div>

                      {featuredEvent.event.startTime && (
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{featuredEvent.event.startTime}</span>
                        </div>
                      )}

                      {featuredEvent.event.location && (
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{featuredEvent.event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* See More Details Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => window.location.href = `/events/${featuredEvent.event.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                      >
                        <span>See More Details</span>
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedEventsSection;
