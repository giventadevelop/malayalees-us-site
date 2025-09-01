import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import TicketTypeListClient from './TicketTypeListClient';
import type { EventDetailsDTO, EventTicketTypeDTO } from '@/types';
import Link from 'next/link';
import { FaUsers, FaPhotoVideo, FaCalendarAlt, FaTags, FaTicketAlt, FaPercent, FaHome } from 'react-icons/fa';
import { fetchEventDetailsForTicketListPage, fetchTicketTypesForTicketListPage } from './ApiServerActions';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function TicketTypeListPage({ params }: PageProps) {
  // Fix for Next.js 15+: await auth() before using
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Handle params for Next.js 15+ compatibility
  let eventId: string;
  if (typeof params.then === 'function') {
    const resolvedParams = await params;
    eventId = resolvedParams.id;
  } else {
    eventId = params.id;
  }

  return <TicketTypeListClient eventId={eventId} />;
}