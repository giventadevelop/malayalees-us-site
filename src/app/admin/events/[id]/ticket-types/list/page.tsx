import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import TicketTypeListClient from './TicketTypeListClient';
import type { EventDetailsDTO, EventTicketTypeDTO } from '@/types';
import Link from 'next/link';
import { FaUsers, FaPhotoVideo, FaCalendarAlt, FaTags, FaTicketAlt, FaPercent, FaHome } from 'react-icons/fa';
import { fetchEventDetailsForTicketListPage, fetchTicketTypesForTicketListPage } from './ApiServerActions';
import { formatInTimeZone } from 'date-fns-tz';

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
  const resolvedParams = await Promise.resolve(params);
  const eventId = resolvedParams.id;

  // Fetch the required data
  try {
    const eventDetails = await fetchEventDetailsForTicketListPage(parseInt(eventId));
    const ticketTypes = await fetchTicketTypesForTicketListPage(parseInt(eventId));

    return (
      <div className="max-w-6xl mx-auto px-4 pb-8" style={{ paddingTop: '180px' }}>
        {/* Concise Event Summary */}
        {eventDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-700">
              <div><span className="font-semibold text-gray-600">Event ID:</span> {eventDetails.id}</div>
              <div className="sm:col-span-2"><span className="font-semibold text-gray-600">Title:</span> {eventDetails.title}</div>
              <div><span className="font-semibold text-gray-600">Start Date:</span> {formatInTimeZone(eventDetails.startDate, eventDetails.timezone, 'EEEE, MMMM d, yyyy')}</div>
              <div><span className="font-semibold text-gray-600">End Date:</span> {formatInTimeZone(eventDetails.endDate || eventDetails.startDate, eventDetails.timezone, 'EEEE, MMMM d, yyyy')}</div>
              <div><span className="font-semibold text-gray-600">Time:</span> {eventDetails.startTime} {eventDetails.endTime ? `- ${eventDetails.endTime}` : ''} ({formatInTimeZone(eventDetails.startDate, eventDetails.timezone, 'zzz')})</div>
            </div>
          </div>
        )}

        {/* Responsive Button Group */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2 mb-8 justify-items-stretch max-w-[280px] sm:max-w-4xl sm:mx-auto">
            <Link href="/admin" className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaHome className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Admin Home</span>
            </Link>
            <Link href="/admin/manage-usage" className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaUsers className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Usage<br />[Users]</span>
            </Link>
            <Link href={`/admin/events/${eventId}/media/list`} className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 text-yellow-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaPhotoVideo className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Media Files</span>
            </Link>
            <Link href="/admin" className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaCalendarAlt className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Events</span>
            </Link>
            <Link href={`/admin/events/${eventId}/ticket-types/list`} className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaTags className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Ticket Types</span>
            </Link>
            <Link href={`/admin/events/${eventId}/tickets/list`} className="flex flex-col items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaTicketAlt className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Tickets</span>
            </Link>
            <Link href={`/admin/events/${eventId}/discount-codes/list`} className="flex flex-col items-center justify-center bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaPercent className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Discount Codes</span>
            </Link>
          </div>
        </div>

        <TicketTypeListClient
          eventId={eventId}
          eventDetails={eventDetails}
          ticketTypes={ticketTypes || []}
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching data for ticket types list:', error);
    return (
      <div className="max-w-6xl mx-auto px-4 pb-8" style={{ paddingTop: '180px' }}>
        {/* Responsive Button Group */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2 mb-8 justify-items-stretch max-w-[280px] sm:max-w-4xl sm:mx-auto">
            <Link href="/admin" className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaHome className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Admin Home</span>
            </Link>
            <Link href="/admin/manage-usage" className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaUsers className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Usage<br />[Users]</span>
            </Link>
            <Link href={`/admin/events/${eventId}/media/list`} className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 text-yellow-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaPhotoVideo className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Media Files</span>
            </Link>
            <Link href="/admin" className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaCalendarAlt className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Events</span>
            </Link>
            <Link href={`/admin/events/${eventId}/ticket-types/list`} className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaTags className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Ticket Types</span>
            </Link>
            <Link href={`/admin/events/${eventId}/tickets/list`} className="flex flex-col items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaTicketAlt className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Tickets</span>
            </Link>
            <Link href={`/admin/events/${eventId}/discount-codes/list`} className="flex flex-col items-center justify-center bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-lg shadow-sm hover:shadow-md p-1.5 sm:p-3 text-xs transition-all duration-200 min-h-[60px] sm:min-h-[80px]">
              <FaPercent className="text-xs sm:text-base mb-0.5 sm:mb-1" />
              <span className="font-medium text-center leading-tight text-[8px] sm:text-xs">Manage Discount Codes</span>
            </Link>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading ticket types
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>There was an error loading the ticket types for this event. Please try refreshing the page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}