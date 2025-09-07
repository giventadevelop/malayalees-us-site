'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our upcoming featured events in the next three months
          </p>
        </div>

        {/* Featured Events Grid */}
        <div className="space-y-6">
          {featuredEvents.map((featuredEvent, index) => (
            <div
              key={featuredEvent.event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
              style={{ height: '30vh', minHeight: '200px' }}
            >
              <div className="flex h-full">
                {/* Left Column - Event Details (30% width) */}
                <div className="w-[30%] p-6 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {featuredEvent.event.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {featuredEvent.event.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(featuredEvent.event.startDate).toLocaleDateString()}</span>
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

                    <div className="pt-4">
                      <Link
                        href={`/events/${featuredEvent.event.id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        View Details
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Column - Featured Event Image (70% width) */}
                <div className="w-[70%] relative">
                  {featuredEvent.media.fileUrl ? (
                    <Image
                      src={featuredEvent.media.fileUrl}
                      alt={featuredEvent.media.altText || featuredEvent.event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 70vw"
                      priority={index === 0} // Prioritize first image
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No image available</p>
                      </div>
                    </div>
                  )}

                  {/* Overlay for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Events Button */}
        <div className="text-center mt-8">
          <Link
            href="/events"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            View All Events
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEventsSection;
