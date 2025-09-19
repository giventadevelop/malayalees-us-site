'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, Camera, Video, Eye } from 'lucide-react';
import { EventMediaSlideshow } from './EventMediaSlideshow';
import type { GalleryEventWithMedia } from '../ApiServerActions';

interface GalleryEventCardProps {
  eventWithMedia: GalleryEventWithMedia;
}

export function GalleryEventCard({ eventWithMedia }: GalleryEventCardProps) {
  const [showSlideshow, setShowSlideshow] = useState(false);
  const { event, media, totalMediaCount } = eventWithMedia;

  // Get preview images (first 4 media items)
  const previewMedia = media.slice(0, 4);
  const remainingCount = Math.max(0, totalMediaCount - 4);

  // Get hero image (prefer homepage hero, then regular hero, then first available)
  const heroImage = media.find(m => m.isHomePageHeroImage) || 
                   media.find(m => m.isHeroImage) || 
                   media.find(m => m.fileUrl);

  const formatEventDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Date TBD';
    }
  };

  const getMediaTypeIcon = (mediaType: string) => {
    if (mediaType.startsWith('video/')) {
      return <Video className="w-4 h-4" />;
    }
    return <Camera className="w-4 h-4" />;
  };

  const getMediaTypeColor = (mediaType: string) => {
    if (mediaType.startsWith('video/')) {
      return 'text-red-600 bg-red-100';
    }
    return 'text-blue-600 bg-blue-100';
  };

  // Generate a colorful background based on event ID for consistency
  const getCardBackground = (eventId: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-50 to-blue-100',
      'bg-gradient-to-br from-green-50 to-green-100', 
      'bg-gradient-to-br from-purple-50 to-purple-100',
      'bg-gradient-to-br from-pink-50 to-pink-100',
      'bg-gradient-to-br from-yellow-50 to-yellow-100',
      'bg-gradient-to-br from-indigo-50 to-indigo-100',
      'bg-gradient-to-br from-red-50 to-red-100',
      'bg-gradient-to-br from-teal-50 to-teal-100'
    ];
    return colors[eventId % colors.length];
  };

  return (
    <>
      <div className={`${getCardBackground(event.id!)} rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/50 flex flex-col`}>
        {/* Hero Image */}
        <div className="relative h-48 bg-gray-200">
          {heroImage?.fileUrl ? (
            <Image
              src={heroImage.fileUrl}
              alt={heroImage.altText || event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center text-gray-400">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">No image available</p>
              </div>
            </div>
          )}
          
          {/* Media count badge */}
          {totalMediaCount > 0 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-xs font-medium">
              {totalMediaCount} {totalMediaCount === 1 ? 'item' : 'items'}
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {event.title}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            {formatEventDate(event.startDate)}
          </div>

          {event.caption && (
            <p className="text-sm text-gray-600 mb-3 overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical'
            }}>
              {event.caption}
            </p>
          )}

          {/* Preview thumbnails */}
          {previewMedia.length > 0 && (
            <div className="mb-3">
              <div className="grid grid-cols-4 gap-1 h-16">
                {previewMedia.map((mediaItem, index) => (
                  <div key={mediaItem.id} className="relative bg-gray-100 rounded overflow-hidden">
                    {mediaItem.fileUrl ? (
                      <Image
                        src={mediaItem.fileUrl}
                        alt={mediaItem.altText || mediaItem.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        {getMediaTypeIcon(mediaItem.eventMediaType)}
                      </div>
                    )}
                    
                    {/* Media type indicator */}
                    <div className={`absolute bottom-0 right-0 ${getMediaTypeColor(mediaItem.eventMediaType)} p-1 rounded-tl`}>
                      {getMediaTypeIcon(mediaItem.eventMediaType)}
                    </div>
                  </div>
                ))}
                
                {/* Show remaining count */}
                {remainingCount > 0 && (
                  <div className="flex items-center justify-center bg-gray-100 rounded text-xs font-medium text-gray-600">
                    +{remainingCount}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Spacer to push buttons down */}
          <div className="flex-grow"></div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3 p-6 pt-0 mt-auto">
            <button
              onClick={() => {
                console.log('View Gallery clicked for event:', event.title, 'Media count:', media.length);
                setShowSlideshow(true);
              }}
              className="flex-1 flex items-center justify-center px-4 py-3 h-12 bg-gradient-to-b from-blue-500 to-blue-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/25 border border-blue-400/20 transform hover:-translate-y-0.5 transition-all duration-200"
              disabled={media.length === 0}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Gallery
            </button>
            
            <Link
              href={`/events/${event.id}`}
              className="flex-1 flex items-center justify-center px-4 py-3 h-12 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 border border-emerald-300/20 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Event Details
            </Link>
          </div>
      </div>

      {/* Slideshow Modal */}
      {showSlideshow && (
        <EventMediaSlideshow
          event={event}
          media={media}
          onClose={() => setShowSlideshow(false)}
        />
      )}
    </>
  );
}
