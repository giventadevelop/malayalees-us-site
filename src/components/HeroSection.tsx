'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { EventDetailsDTO, EventWithMedia } from '@/types';
import { getAppUrl } from '@/lib/env';

// Add local extension for placeholder text
interface EventWithMediaExtended extends EventWithMedia {
  placeholderText?: string;
}

// Image rotation logic component with full event flyer implementation
const DynamicHeroImage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShowingDefault, setIsShowingDefault] = useState(true);
  const [dynamicImages, setDynamicImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<EventWithMediaExtended | null>(null);
  const [eventsData, setEventsData] = useState<EventWithMediaExtended[]>([]);
  const [hasTicketedEvents, setHasTicketedEvents] = useState(false);

  // Default image path
  const defaultImage = "/images/hero_section/default_hero_section_second_column_poster.webp";

  // Overlay logic based on current event - Implements priority system from documentation
  const getOverlayForEvent = (event: EventWithMediaExtended | null) => {
    if (!event) return null;

    // Priority 1: Buy Tickets (highest priority)
    if (event.admissionType?.toLowerCase().includes('ticket') ||
      event.admissionType?.toLowerCase().includes('paid') ||
      event.admissionType?.toLowerCase().includes('fee')) {
      return { type: 'tickets', image: '/images/buy_tickets_click_here_red.webp', action: `/events/${event.id}` };
    }

    // Priority 2: Registration Required
    if (event.isRegistrationRequired) {
      return { type: 'registration', image: '/images/register_here_button.png', action: `/events/${event.id}` };
    }

    // Priority 3: Live Event
    if (event.isLive) {
      return { type: 'live', image: '/images/watch_live_button.png', action: `/events/${event.id}` };
    }

    // Priority 4: Sports Event
    if (event.isSportsEvent) {
      return { type: 'sports', image: '/images/sports_event_button.png', action: `/events/${event.id}` };
    }

    return null; // No overlay
  };

  // Fetch events with media function
  const fetchEventsWithMedia = async (): Promise<EventWithMediaExtended[]> => {
    const baseUrl = getAppUrl();
    console.log('Fetching events from:', `${baseUrl}/api/proxy/event-details`);

    let eventsData: EventDetailsDTO[] = [];

    try {
      let eventsResponse = await fetch(
        `${baseUrl}/api/proxy/event-details?sort=startDate,asc`,
        { cache: 'no-store' }
      );

      console.log('Events response status:', eventsResponse.status);

      if (eventsResponse.ok) {
        try {
          eventsData = await eventsResponse.json();
          console.log('Successfully fetched events:', eventsData.length);
          console.log('Events list:', eventsData.map(e => ({ id: e.id, title: e.title, startDate: e.startDate })));
        } catch (err) {
          console.error('Failed to parse events JSON:', err);
          eventsData = [];
        }
      } else {
        console.log('Events fetch failed with status:', eventsResponse.status);
        // Try fallback
        try {
          eventsResponse = await fetch(
            `${baseUrl}/api/proxy/event-details?sort=startDate,desc`,
            { cache: 'no-store' }
          );
          if (eventsResponse.ok) {
            try {
              eventsData = await eventsResponse.json();
              console.log('Successfully fetched events (fallback):', eventsData.length);
            } catch (err) {
              console.error('Failed to parse events JSON (fallback):', err);
              eventsData = [];
            }
          } else {
            console.log('Fallback events fetch also failed with status:', eventsResponse.status);
          }
        } catch (fallbackErr) {
          console.error('Fallback events fetch error:', fallbackErr);
        }
      }
    } catch (fetchErr) {
      console.error('Events fetch error:', fetchErr);
      eventsData = [];
    }

    // Use Promise.allSettled instead of Promise.all to handle individual failures gracefully
    const eventsWithMediaResults = await Promise.allSettled(
      eventsData.map(async (event: EventDetailsDTO) => {
        try {
          console.log(`=== PROCESSING EVENT ===`);
          console.log(`Event ID: ${event.id}`);
          console.log(`Event Title: ${event.title}`);
          console.log(`Event Start Date: ${event.startDate}`);
          console.log(`Fetching media for event ID: ${event.id}, title: ${event.title}`);

          // Add timeout to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          try {
            const flyerRes = await fetch(
              `${baseUrl}/api/proxy/event-medias?eventId.equals=${event.id}&isHomePageHeroImage.equals=true`,
              {
                cache: 'no-store',
                signal: controller.signal
              }
            );
            clearTimeout(timeoutId);

            let mediaArray: any[] = [];

            if (flyerRes.ok) {
              try {
                const flyerData = await flyerRes.json();
                const rawMediaArray = Array.isArray(flyerData) ? flyerData : (flyerData ? [flyerData] : []);

                // Client-side filter to ensure we only get items where isHomePageHeroImage is explicitly true
                mediaArray = rawMediaArray.filter(media => media.isHomePageHeroImage === true);

                console.log(`Event ${event.id}: Found ${rawMediaArray.length} total media items, ${mediaArray.length} with isHomePageHeroImage=true`);
                if (mediaArray.length > 0) {
                  console.log(`Event ${event.id}: Media details:`, mediaArray[0]);
                } else if (rawMediaArray.length > 0) {
                  console.log(`Event ${event.id}: No media items have isHomePageHeroImage=true. Sample item:`, rawMediaArray[0]);
                }
              } catch (jsonErr) {
                console.error(`Event ${event.id}: Failed to parse home page hero image JSON:`, jsonErr);
                mediaArray = [];
              }
            } else {
              console.log(`Event ${event.id}: Home page hero image fetch failed with status ${flyerRes.status}`);
            }


            if (mediaArray.length > 0) {
              const fileUrl = mediaArray[0].fileUrl;
              if (fileUrl) {
                console.log(`Event ${event.id}: SUCCESS - Found hero image: ${fileUrl}`);
                return {
                  ...event,
                  thumbnailUrl: fileUrl,
                  placeholderText: mediaArray[0].altText || event.title
                };
              }
            }

            console.log(`Event ${event.id}: NO HERO IMAGE - No isHomePageHeroImage found`);
            return {
              ...event,
              thumbnailUrl: undefined,
              placeholderText: event.title
            };
          } catch (mediaErr) {
            console.error(`Event ${event.id}: Media fetch error:`, mediaErr);
            return {
              ...event,
              thumbnailUrl: undefined,
              placeholderText: event.title
            };
          }
        } catch (eventErr) {
          console.error(`Event ${event.id}: General error:`, eventErr);
          return {
            ...event,
            thumbnailUrl: undefined,
            placeholderText: event.title
          };
        }
      })
    );

    // Filter out failed promises and return successful results
    const eventsWithMedia: EventWithMediaExtended[] = eventsWithMediaResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<EventWithMediaExtended>).value);

    console.log(`Successfully processed ${eventsWithMedia.length} events with media`);
    return eventsWithMedia;
  };


  useEffect(() => {
    const initializeHeroImages = async () => {
      try {
        setIsLoading(true);

        // Fetch events with media
        const events = await fetchEventsWithMedia();

        if (events && events.length > 0) {
          // Determine hero image based on upcoming events
          const today = new Date();
          const threeMonthsFromNow = new Date();
          threeMonthsFromNow.setMonth(today.getMonth() + 3);

          console.log('=== HERO IMAGE SELECTION ===');
          console.log('Today:', today.toISOString());
          console.log('Three months from now:', threeMonthsFromNow.toISOString());

          let heroImageUrl = defaultImage;
          let nextEvent: EventWithMediaExtended | null = null;

          // Find events in the future with isHomePageHeroImage = true
          const upcomingEvents = events
            .filter(event => {
              // Check: 1) Event in future, 2) Within 3 months, 3) Is active, 4) Has thumbnailUrl (isHomePageHeroImage = true)
              const eventDate = event.startDate ? new Date(event.startDate) : null;
              return eventDate &&
                eventDate >= today &&
                eventDate <= threeMonthsFromNow &&
                event.isActive &&
                event.thumbnailUrl;
            })
            .sort((a, b) => {
              const aDate = a.startDate ? new Date(a.startDate).getTime() : Infinity;
              const bDate = b.startDate ? new Date(b.startDate).getTime() : Infinity;
              return aDate - bDate;
            });

          console.log(`Found ${upcomingEvents.length} upcoming events with isHomePageHeroImage = true`);

          if (upcomingEvents.length > 0) {
            const event = upcomingEvents[0];
            heroImageUrl = event.thumbnailUrl!;
            nextEvent = event;
            console.log(`Using hero image from event: ${event.title} (ID: ${event.id})`);
          }


          // Build dynamic images array with multiple events
          const imageUrls: string[] = [];
          const eventData: EventWithMediaExtended[] = [];

          // Add hero image if it's not the default
          if (heroImageUrl !== defaultImage) {
            imageUrls.push(heroImageUrl);
            if (nextEvent) {
              eventData.push(nextEvent);
            }
          }

          // Add more upcoming events with isHomePageHeroImage = true (up to 3 total)
          const additionalEvents = upcomingEvents
            .filter(event => event.id !== nextEvent?.id)
            .slice(0, 2); // Take up to 2 more events

          additionalEvents.forEach(event => {
            imageUrls.push(event.thumbnailUrl!);
            eventData.push(event);
          });

          // Add fallback to original image
          imageUrls.push("https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F67c8b636de774dd2bb5d7097f5fcc176?format=webp&width=800");

          setDynamicImages(imageUrls);
          setEventsData(eventData); // Store events data for overlay logic

          // Check if any events have tickets (infer from admissionType or other fields)
          const hasTickets = upcomingEvents.some(event =>
            event.admissionType &&
            (event.admissionType.toLowerCase().includes('ticket') ||
              event.admissionType.toLowerCase().includes('paid') ||
              event.admissionType.toLowerCase().includes('fee'))
          );
          setHasTicketedEvents(hasTickets);

          // Set current event for display - this will be updated during rotation
          if (eventData.length > 0) {
            setCurrentEvent(eventData[0]);
          } else {
            setCurrentEvent(null); // No current event for default/fallback images
          }
        }
      } catch (error) {
        console.error('Failed to initialize hero images:', error);
        // Fallback to original image
        setDynamicImages(["https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F67c8b636de774dd2bb5d7097f5fcc176?format=webp&width=800"]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeHeroImages();
  }, []);

  useEffect(() => {
    // Start with default image for 2 seconds (reduced from 4)
    const defaultTimer = setTimeout(() => {
      setIsShowingDefault(false);
    }, 2000);

    // If we have dynamic images, start rotating them
    if (dynamicImages.length > 0) {
      const dynamicTimer = setTimeout(() => {
        const interval = setInterval(() => {
          setCurrentImageIndex((prev) => {
            const newIndex = (prev + 1) % dynamicImages.length;

            // Update current event when image changes - key implementation for overlay sync
            if (newIndex < eventsData.length) {
              // Show event-specific overlay for event images
              setCurrentEvent(eventsData[newIndex]);
            } else {
              // No overlay for fallback/default images
              setCurrentEvent(null);
            }

            return newIndex;
          });
        }, 15000); // Change every 15 seconds

        return () => clearInterval(interval);
      }, 2000); // Start after 2 seconds

      return () => {
        clearTimeout(defaultTimer);
        clearTimeout(dynamicTimer);
      };
    }

    return () => clearTimeout(defaultTimer);
  }, [dynamicImages.length]);

  // Show default image for first 2 seconds
  if (isShowingDefault) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={defaultImage}
          alt="Default Hero Image"
          fill
          className="object-fill w-full h-full cursor-pointer"
          style={{
            filter: 'contrast(1.1) saturate(0.9)'
          }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          onClick={() => {
            // Route to events page for default image
            window.location.href = '/events';
          }}
        />
        {/* No Buy Tickets overlay for default image */}
      </div>
    );
  }

  // Show dynamic images after 2 seconds
  if (dynamicImages.length > 0) {
    const isShowingEventFlyer = currentImageIndex < dynamicImages.length - 1; // Skip the fallback image

    return (
      <div className="relative w-full h-full">
        <Image
          src={dynamicImages[currentImageIndex]}
          alt="Dynamic Hero Image"
          fill
          className="object-fill w-full h-full cursor-pointer"
          style={{
            filter: 'contrast(1.1) saturate(0.9)'
          }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          onClick={() => {
            // If showing event flyer and we have current event, route to specific event
            if (isShowingEventFlyer && currentEvent && currentEvent.id) {
              window.location.href = `/events/${currentEvent.id}`;
            } else {
              // Otherwise route to events page
              window.location.href = '/events';
            }
          }}
        />

        {/* Enhanced Overlay Logic - Priority-based system as per documentation */}
        {(() => {
          const overlay = getOverlayForEvent(currentEvent);
          return overlay && isShowingEventFlyer ? (
            <div className="absolute bottom-4 right-4 z-10">
              <Image
                src={overlay.image}
                alt={`${overlay.type} overlay`}
                width={180}
                height={90}
                className="cursor-pointer hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to buy tickets image if overlay image is missing
                  const img = e.target as HTMLImageElement;
                  img.src = '/images/buy_tickets_click_here_red.webp';
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click handler
                  window.location.href = overlay.action;
                }}
              />
            </div>
          ) : null;
        })()}

        {/* See All Events Overlay - Bottom Left */}
        {(() => {
          const shouldShowSeeAllEvents = currentEvent && (
            (currentEvent.admissionType?.toLowerCase().includes('ticket') ||
              currentEvent.admissionType?.toLowerCase().includes('paid') ||
              currentEvent.admissionType?.toLowerCase().includes('fee')) ||
            currentEvent.isRegistrationRequired
          );

          return shouldShowSeeAllEvents && isShowingEventFlyer ? (
            <div className="absolute left-4 z-10" style={{ bottom: '-36px' }}>
              <Image
                src="/images/hero_bottom_see_all_events-Photoroom.png"
                alt="See All Events"
                width={240}
                height={120}
                className="cursor-pointer hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.warn('See All Events overlay image not found');
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click handler
                  window.location.href = '/events';
                }}
              />
            </div>
          ) : null;
        })()}
      </div>
    );
  }

  // Fallback to default image
  return (
    <div className="relative w-full h-full">
      <Image
        src={defaultImage}
        alt="Default Hero Image"
        fill
        className="object-fill w-full h-full cursor-pointer"
        style={{
          filter: 'contrast(1.1) saturate(0.9)'
        }}
        sizes="(max-width: 1024px) 100vw, 50vw"
        onClick={() => {
          // Route to events page for default image
          window.location.href = '/events';
        }}
      />
      {/* No Buy Tickets overlay for fallback image */}
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <>
      <div className="min-h-[37.5vh] bg-white pt-20 pb-9 relative">
        {/* Donate Image - Top Right Corner - Positioned below header to avoid hamburger overlap */}
        <div className="absolute top-28 right-6 z-50 lg:top-28 lg:right-8">
          <div className="bg-transparent p-2 rounded-lg">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2Fee43fae6623544d193ab0c26deca1d95?format=webp&width=800"
              alt="Donate"
              width={120}
              height={60}
              className="cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-lg"
              onClick={() => {
                // Add donate functionality here
                console.log('Donate button clicked');
                // You can add a link to a donation page or open a modal
              }}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid Layout - Mobile: First column cells side by side, second column below; Desktop: custom columns */}
          <div className="grid gap-8 h-full min-h-[300px]">

            {/* Mobile layout: First column cells in same row */}
            <div className="grid grid-cols-2 gap-4 lg:hidden">
              {/* Cell 1: Logo - Simple image and text */}
              <div className="relative overflow-hidden group min-h-[187px] flex flex-col items-center justify-center p-4">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2Fd7543f582d4f477599d341da96d48e2b?format=webp&width=800"
                  alt="Malayalees Friends Logo"
                  width={180}
                  height={180}
                  className="mx-auto mb-3"
                  priority
                />
                <h2 className="text-lg font-bold text-gray-800 text-center">
                  Malayalees Friends
                </h2>
                <p className="text-sm text-gray-600 mt-1 text-center">
                  Cultural Events Federation
                </p>
              </div>

              {/* Cell 3: Unite India Image - No text overlay */}
              <div className="relative overflow-hidden group min-h-[187px] rounded-[2rem]">
                <div
                  className="absolute inset-0 rounded-[2rem]"
                  style={{
                    background: `url('https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F7e04d4cf965b47f9b58322797a9f4ba2?format=webp&width=800') center/cover`,
                    filter: 'brightness(0.9) contrast(1.1)'
                  }}
                ></div>
              </div>

            </div>

            {/* Cell 2: Large Modern Image - Mobile - Bleed to edges */}
            <div className="relative overflow-hidden group min-h-[300px] lg:hidden -mx-4 sm:-mx-6">
              <DynamicHeroImage />
            </div>

            {/* Desktop layout: Original grid with modifications */}
            <div className="hidden lg:grid lg:grid-cols-[3fr_7fr] gap-8 items-end">

              {/* Cell 1: Logo - Simple image and text */}
              <div className="relative overflow-hidden group h-[262px] flex flex-col items-center justify-center">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2Fd7543f582d4f477599d341da96d48e2b?format=webp&width=800"
                  alt="Malayalees Friends Logo"
                  width={240}
                  height={240}
                  className="mx-auto mb-4"
                  priority
                />
                <h2 className="text-xl font-bold text-gray-800 text-center">
                  Malayalees Friends
                </h2>
                <p className="text-base text-gray-600 mt-2 text-center">
                  Cultural Events Federation
                </p>
              </div>

              {/* Cell 2: Large Modern Image - Dynamic image rotation */}
              <div className="relative lg:row-span-2 group h-[531px]">
                <DynamicHeroImage />
              </div>

              {/* Cell 3: Unite India Image - No text overlay */}
              <div className="relative overflow-hidden group h-[262px] rounded-[2rem]">
                <div
                  className="absolute inset-0 rounded-[2rem]"
                  style={{
                    background: `url('https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F7e04d4cf965b47f9b58322797a9f4ba2?format=webp&width=800') center/contain`,
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0.9) contrast(1.1)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default HeroSection;