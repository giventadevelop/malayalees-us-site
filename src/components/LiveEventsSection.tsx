'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatInTimeZone } from 'date-fns-tz';
import type { EventDetailsDTO, EventMediaDTO } from '@/types';
import { getAppUrl } from '@/lib/env';

interface LiveEventWithMedia {
  event: EventDetailsDTO;
  media: EventMediaDTO;
}

const LiveEventsSection: React.FC = () => {
  const [liveEvents, setLiveEvents] = useState<LiveEventWithMedia[]>([]);
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

  // Filter for live events with isLiveEvent = true and isLiveEventImage = true
  const fetchLiveEvents = async (): Promise<LiveEventWithMedia[]> => {
    const baseUrl = getAppUrl();
    const liveEventsData: LiveEventWithMedia[] = [];

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
      console.log('Fetched events for live section:', events.length);

      // Apply the same filtering logic as HeroSection: events in next 3 months and active
      const upcomingEvents = events.filter(event =>
        event.startDate &&
        isEventInNextThreeMonths(event.startDate) &&
        event.isActive
      );

      console.log('Upcoming events in next 3 months:', upcomingEvents.length);

      // For each upcoming event, check if it has live event media (isLiveEventImage = true)
      const allLiveEvents: LiveEventWithMedia[] = [];

      for (const event of upcomingEvents) {
        try {
          // Use the same media fetch pattern as HeroSection but for isLiveEventImage
          const mediaResponse = await fetch(
            `${baseUrl}/api/proxy/event-medias?eventId.equals=${event.id}&isLiveEventImage.equals=true`,
            { cache: 'no-store' }
          );

          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json();
            const mediaArray = Array.isArray(mediaData) ? mediaData : (mediaData ? [mediaData] : []);

            // Client-side filter to ensure we only get items where isLiveEventImage is explicitly true
            const liveMedia = mediaArray.filter(media => media.isLiveEventImage === true);

            if (liveMedia.length > 0) {
              allLiveEvents.push({
                event,
                media: liveMedia[0] // Take the first live media
              });
              console.log(`Found live event: ${event.title} with priority: ${event.liveEventPriority} and media: ${liveMedia[0].fileUrl}`);
            }
          } else {
            console.log(`Event ${event.id}: Live event image fetch failed with status ${mediaResponse.status}`);
          }
        } catch (mediaError) {
          console.error(`Error fetching live media for event ${event.id}:`, mediaError);
        }
      }

      // Priority-based filtering logic (similar to featured events)
      if (allLiveEvents.length === 0) {
        console.log('No live events found');
        return [];
      }

      if (allLiveEvents.length === 1) {
        console.log('Only one live event found, selecting it');
        liveEventsData.push(allLiveEvents[0]);
        return liveEventsData;
      }

      // Group events by priority
      const eventsByPriority = new Map<number, LiveEventWithMedia[]>();

      allLiveEvents.forEach(liveEvent => {
        const priority = liveEvent.event.liveEventPriority || 0; // Default to 0 if not set
        if (!eventsByPriority.has(priority)) {
          eventsByPriority.set(priority, []);
        }
        eventsByPriority.get(priority)!.push(liveEvent);
      });

      // Find the highest priority (lowest number = highest priority)
      const priorities = Array.from(eventsByPriority.keys()).sort((a, b) => a - b);
      const highestPriority = priorities[0];
      const highestPriorityEvents = eventsByPriority.get(highestPriority) || [];

      console.log(`Found ${allLiveEvents.length} live events across ${priorities.length} priority levels`);
      console.log(`Highest priority: ${highestPriority} with ${highestPriorityEvents.length} events`);

      // Select from highest priority events
      if (highestPriorityEvents.length === 1) {
        console.log('Only one event with highest priority, selecting it');
        liveEventsData.push(highestPriorityEvents[0]);
      } else {
        // Multiple events with same highest priority - choose randomly
        const randomIndex = Math.floor(Math.random() * highestPriorityEvents.length);
        console.log(`Multiple events with same priority (${highestPriority}), randomly selecting index ${randomIndex}`);
        liveEventsData.push(highestPriorityEvents[randomIndex]);
      }

      console.log('Total live events selected:', liveEventsData.length);
      return liveEventsData;

    } catch (error) {
      console.error('Error fetching live events:', error);
      return [];
    }
  };

  // Load live events after hero section is loaded (same timing as HeroSection)
  useEffect(() => {
    const loadLiveEvents = async () => {
      try {
        setIsLoading(true);
        const events = await fetchLiveEvents();
        setLiveEvents(events);
        setIsLoading(false);

        // Show section after hero section is loaded (2 second delay)
        setTimeout(() => {
          setIsVisible(true);
        }, 2000);
      } catch (error) {
        console.error('Error loading live events:', error);
        setIsLoading(false);
      }
    };

    loadLiveEvents();
  }, []);

  // Don't render anything if loading or no events
  if (isLoading || !isVisible || liveEvents.length === 0) {
    return null;
  }

  return (
    <section className="pt-1 md:pt-1 pb-0 md:pb-0.5 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live Events Strip */}
        <div className="space-y-4 md:space-y-6">
          {liveEvents.map((liveEvent, index) => (
            <div
              key={liveEvent.event.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-auto md:h-[200px]"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Column - Event Image (60% width on desktop, full width on mobile) */}
                <div className="w-full md:w-[60%] h-48 md:h-full relative overflow-hidden rounded-t-2xl md:rounded-t-none md:rounded-l-2xl">
                  {liveEvent.media.fileUrl ? (
                    <Image
                      src={liveEvent.media.fileUrl}
                      alt={liveEvent.media.altText || liveEvent.event.title}
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No image available</p>
                      </div>
                    </div>
                  )}

                  {/* Live Event Badge Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Live Event
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Event Details (40% width on desktop, full width on mobile) */}
                <div className="w-full md:w-[40%] p-4 md:p-6 flex flex-col justify-center bg-gradient-to-br from-red-50 to-orange-100 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {liveEvent.event.title}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {liveEvent.event.timezone
                            ? formatInTimeZone(liveEvent.event.startDate, liveEvent.event.timezone, 'EEEE, MMMM d, yyyy (zzz)')
                            : new Date(liveEvent.event.startDate).toLocaleDateString()
                          }
                        </span>
                      </div>

                      {liveEvent.event.startTime && (
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{liveEvent.event.startTime}</span>
                        </div>
                      )}

                      {liveEvent.event.location && (
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{liveEvent.event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* See More Details Button - Only show if content might be cut off */}
                    <div className="pt-2">
                      <button
                        onClick={() => window.location.href = `/events/${liveEvent.event.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-full hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
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

export default LiveEventsSection;
