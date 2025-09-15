import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { getAppUrl } from '@/lib/env';
import type { EventAttendeeDTO, EventAttendeeGuestDTO, EventDetailsDTO } from '@/types';
import RegistrationManagementClient from './RegistrationManagementClient';
import { fetchRegistrationManagementData } from './ApiServerActions';

interface RegistrationPageProps {
  searchParams: {
    eventId?: string;
    search?: string;
    searchType?: string;
    status?: string;
    page?: string;
  };
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function RegistrationManagementPage({ searchParams }: RegistrationPageProps) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const eventId = searchParams.eventId ? parseInt(searchParams.eventId) : null;
  const search = searchParams.search || '';
  const searchType = searchParams.searchType || 'name';
  const status = searchParams.status || '';
  const page = parseInt(searchParams.page || '1');

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RegistrationManagementContent
        eventId={eventId}
        search={search}
        searchType={searchType}
        status={status}
        page={page}
      />
    </Suspense>
  );
}

async function RegistrationManagementContent({
  eventId,
  search,
  searchType,
  status,
  page
}: {
  eventId: number | null;
  search: string;
  searchType: string;
  status: string;
  page: number;
}) {
  const data = await fetchRegistrationManagementData(eventId, search, searchType, status, page);

  if (!data) {
    notFound();
  }

  return <RegistrationManagementClient data={data} />;
}
