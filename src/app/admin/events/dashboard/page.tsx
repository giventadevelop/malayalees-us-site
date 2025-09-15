import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { getAppUrl } from '@/lib/env';
import type { EventDetailsDTO, EventAttendeeDTO, EventAttendeeGuestDTO } from '@/types';
import EventDashboardClient from './EventDashboardClient';
import { fetchEventDashboardData } from './ApiServerActions';

interface DashboardPageProps {
  searchParams: {
    eventId?: string;
  };
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function EventDashboardPage({ searchParams }: DashboardPageProps) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const eventId = searchParams.eventId ? parseInt(searchParams.eventId) : null;

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EventDashboardContent eventId={eventId} />
    </Suspense>
  );
}

async function EventDashboardContent({ eventId }: { eventId: number | null }) {
  const dashboardData = await fetchEventDashboardData(eventId);

  if (!dashboardData) {
    notFound();
  }

  return <EventDashboardClient data={dashboardData} />;
}
