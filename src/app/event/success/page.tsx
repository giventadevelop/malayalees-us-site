import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getAppUrl } from '@/lib/env';
import { formatInTimeZone } from 'date-fns-tz';
import type { EventDetailsDTO } from '@/types';

interface SuccessPageProps {
  searchParams: {
    eventId?: string;
  };
}

async function fetchEventDetails(eventId: number): Promise<EventDetailsDTO | null> {
  try {
    const baseUrl = getAppUrl();
    const response = await fetch(`${baseUrl}/api/proxy/event-details/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch event details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
}

function LoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse text-center">
          <div className="h-16 bg-gray-200 rounded-full w-16 mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const eventId = searchParams.eventId ? parseInt(searchParams.eventId) : null;

  if (!eventId || isNaN(eventId)) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SuccessPageContent eventId={eventId} />
    </Suspense>
  );
}

async function SuccessPageContent({ eventId }: { eventId: number }) {
  const eventDetails = await fetchEventDetails(eventId);

  if (!eventDetails) {
    notFound();
  }

  const eventDate = formatInTimeZone(
    eventDetails.startDate, 
    eventDetails.timezone, 
    'EEEE, MMMM d, yyyy (zzz)'
  );

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Confirmed!</h1>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              {eventDetails.title}
            </h2>
            <p className="text-green-700 mb-2">
              <strong>Date:</strong> {eventDate}
            </p>
            {eventDetails.startTime && eventDetails.endTime && (
              <p className="text-green-700 mb-2">
                <strong>Time:</strong> {eventDetails.startTime} - {eventDetails.endTime}
              </p>
            )}
            {eventDetails.location && (
              <p className="text-green-700">
                <strong>Location:</strong> {eventDetails.location}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">What's Next?</h3>
            <ul className="text-blue-700 text-left space-y-2">
              <li>• You will receive a confirmation email shortly</li>
              <li>• Your registration is subject to approval</li>
              <li>• You will be notified of the final status</li>
              <li>• Check your email for any additional instructions</li>
            </ul>
          </div>

          <div className="flex justify-center gap-4">
            <a
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
            >
              Return to Home
            </a>
            <a
              href="/events"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md"
            >
              View All Events
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}