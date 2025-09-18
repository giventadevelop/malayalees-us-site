'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaEdit,
  FaImage,
  FaDollarSign,
  FaUsers,
  FaMicrophone,
  FaUserTie,
  FaHandshake,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt
} from 'react-icons/fa';
import type { EventDetailsDTO } from '@/types';

export default function EventOverviewPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<EventDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId && eventId) {
      loadEvent();
    }
  }, [userId, eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/proxy/event-details/${eventId}`);
      if (response.ok) {
        const eventData = await response.json();
        setEvent(eventData);
      } else {
        throw new Error('Failed to load event details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString;
  };

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!eventId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Event ID not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8" style={{ paddingTop: '180px' }}>
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/manage-events"
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Manage Events
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Event Overview
              {event && <span className="text-lg font-normal text-gray-600 ml-2">- {event.title}</span>}
            </h1>
            <p className="text-gray-600">Manage all aspects of this event</p>
          </div>
        </div>
        {event && (
          <Link
            href={`/admin/events/${eventId}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow font-bold flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <FaEdit />
            Edit Event
          </Link>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : event ? (
        <>
          {/* Event Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-blue-500 text-xl" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Start Date</p>
                  <p className="text-gray-900">{formatDate(event.startDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaClock className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Time</p>
                  <p className="text-gray-900">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-500 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-gray-900">{event.location}</p>
                  </div>
                </div>
              )}

              {event.capacity && (
                <div className="flex items-center gap-3">
                  <FaUsers className="text-purple-500 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Capacity</p>
                    <p className="text-gray-900">{event.capacity} attendees</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <FaTicketAlt className="text-orange-500 text-xl" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Admission</p>
                  <p className="text-gray-900">{event.admissionType || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${event.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-gray-900">{event.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                <p className="text-gray-900 leading-relaxed">{event.description}</p>
              </div>
            )}
          </div>

          {/* Management Options */}
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6 justify-items-center mx-auto">
              <Link href={`/admin/events/${eventId}/edit`} className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
                <FaEdit className="text-base sm:text-lg mb-1 mx-auto" />
                <span className="font-semibold text-center leading-tight">Edit Event<br />Details</span>
              </Link>

              <Link href={`/admin/events/${eventId}/media`} className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
                <FaImage className="text-base sm:text-lg mb-1 mx-auto" />
                <span className="font-semibold text-center leading-tight">Event Media<br />[Images/Videos]</span>
              </Link>

              <Link href={`/admin/events/${eventId}/ticket-types/list`} className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
                <FaDollarSign className="text-base sm:text-lg mb-1 mx-auto" />
                <span className="font-semibold text-center leading-tight">Ticket Types<br />[Pricing]</span>
              </Link>

              <Link href={`/admin/events/${eventId}/sponsors`} className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 text-yellow-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
                <FaHandshake className="text-base sm:text-lg mb-1 mx-auto" />
                <span className="font-semibold text-center leading-tight">Event Sponsors<br />[Partnerships]</span>
              </Link>

              <Link href={`/admin/events/${eventId}/performers`} className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
                <FaMicrophone className="text-base sm:text-lg mb-1 mx-auto" />
                <span className="font-semibold text-center leading-tight">Performers<br />[Artists]</span>
              </Link>

              <Link href={`/admin/events/${eventId}/program-directors`} className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
                <FaUserTie className="text-base sm:text-lg mb-1 mx-auto" />
                <span className="font-semibold text-center leading-tight">Program Directors<br />[Leadership]</span>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
            <p className="text-gray-500">The requested event could not be found or you don't have permission to view it.</p>
          </div>
        </div>
      )}
    </div>
  );
}

