'use client';
import { EventDetailsDTO, EventTypeDetailsDTO, UserProfileDTO, EventCalendarEntryDTO } from '@/types';
import React, { useState, useEffect } from 'react';
import { EventList } from '@/components/EventList';
import { useAuth } from "@clerk/nextjs";
import { FaUsers, FaCalendarAlt, FaPlus, FaEnvelope, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';
import Image from 'next/image';
import {
  fetchEventsFilteredServer,
  fetchEventTypesServer,
  fetchCalendarEventsServer,
  cancelEventServer,
  deleteCalendarEventForEventServer,
} from '../ApiServerActions';

export default function ManageEventsPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventDetailsDTO[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypeDetailsDTO[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<EventCalendarEntryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  // Search/filter state
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCaption, setSearchCaption] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [searchAdmissionType, setSearchAdmissionType] = useState('');
  const [sort, setSort] = useState('startDate,asc');
  const [searchField, setSearchField] = useState<'title' | 'id' | 'caption'>('title');
  const [searchId, setSearchId] = useState('');
  const [showPastEvents, setShowPastEvents] = useState(false);

  async function loadAll(pageNum = 0) {
    setLoading(true);
    setError(null);
    try {
      // Build date filtering based on toggle
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      const filterParams: any = {
        admissionType: searchAdmissionType,
        sort,
        page: pageNum,
        size: pageSize
      };

      // Add search filters based on selected field
      if (searchField === 'title' && searchTitle.trim()) {
        filterParams.title = searchTitle.trim();
      } else if (searchField === 'id' && searchId.trim()) {
        filterParams.id = parseInt(searchId.trim());
      } else if (searchField === 'caption' && searchCaption.trim()) {
        filterParams.caption = searchCaption.trim();
      }

      // Add date filters
      if (searchStartDate) {
        filterParams.startDate = searchStartDate;
      }
      if (searchEndDate) {
        filterParams.endDate = searchEndDate;
      }

      // Add date filter based on toggle
      if (!searchStartDate && !searchEndDate) {
        if (showPastEvents) {
          filterParams.endDateBefore = today;
        } else {
          filterParams.startDateAfter = today;
        }
      }

      const eventsData = await fetchEventsFilteredServer(filterParams);
      setEvents(eventsData.events);
      setTotalCount(eventsData.totalCount);

      // Load event types
      const eventTypesData = await fetchEventTypesServer();
      setEventTypes(eventTypesData);

      // Load calendar events
      const calendarEventsData = await fetchCalendarEventsServer();
      setCalendarEvents(calendarEventsData);
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      loadAll(page);
    }
  }, [userId, page, searchTitle, searchCaption, searchId, searchStartDate, searchEndDate, searchAdmissionType, sort, searchField, showPastEvents]);

  async function handleCancelEvent(eventId: number) {
    try {
      setLoading(true);
      await cancelEventServer(eventId);
      await loadAll(page);
    } catch (e: any) {
      setError(e.message || 'Failed to cancel event');
    } finally {
      setLoading(false);
    }
  }

  // Pagination controls
  function handlePrevPage() {
    setPage((p) => Math.max(0, p - 1));
  }
  function handleNextPage() {
    setPage((p) => p + 1);
  }

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-8" style={{ paddingTop: '180px' }}>
      {/* Header with back button */}
      <div className="flex items-center mb-8">
        <Link
          href="/admin"
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Admin
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Events</h1>
          <p className="text-gray-600">
            Create, edit, and manage all events in the system.
          </p>
        </div>
      </div>

      {/* Admin Navigation */}
      <AdminNavigation currentPage="manage-events" />

      {/* Quick Action Buttons */}
      <div className="w-full overflow-x-auto mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-center mx-auto">
          <Link href="/admin/events/new" className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
            <FaPlus className="text-base sm:text-lg mb-1 mx-auto" />
            <span className="font-semibold text-center leading-tight">Create New<br />Event</span>
          </Link>
          <Link href="/admin/events" className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
            <FaCalendarAlt className="text-base sm:text-lg mb-1 mx-auto" />
            <span className="font-semibold text-center leading-tight">Event Analytics<br />Dashboard</span>
          </Link>
          <Link href="/admin/manage-usage" className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
            <FaUsers className="text-base sm:text-lg mb-1 mx-auto" />
            <span className="font-semibold text-center leading-tight">Manage Usage<br />[Users]</span>
          </Link>
          <Link href="/admin/communication" className="w-48 max-w-xs mx-auto flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-800 rounded-md shadow p-1 sm:p-2 text-xs sm:text-xs transition-all">
            <FaEnvelope className="text-base sm:text-lg mb-1 mx-auto" />
            <span className="font-semibold text-center leading-tight">Communication<br />Center</span>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="text-lg font-semibold text-blue-800 mb-4">Search Events</div>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold mb-1">Search By</label>
              <select className="border px-3 py-2 rounded w-40" value={searchField} onChange={e => setSearchField(e.target.value as 'title' | 'id' | 'caption')}>
                <option value="title">Title</option>
                <option value="id">ID</option>
                <option value="caption">Caption</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">{searchField === 'id' ? 'Event ID' : searchField.charAt(0).toUpperCase() + searchField.slice(1)}</label>
              <input
                type={searchField === 'id' ? 'number' : 'text'}
                className="border px-3 py-2 rounded w-48"
                value={searchField === 'title' ? searchTitle : searchField === 'id' ? searchId : searchCaption}
                onChange={e => {
                  if (searchField === 'title') setSearchTitle(e.target.value);
                  else if (searchField === 'id') setSearchId(e.target.value);
                  else setSearchCaption(e.target.value);
                }}
                placeholder={`Search by ${searchField}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Start Date</label>
              <input type="date" className="border px-3 py-2 rounded" value={searchStartDate} onChange={e => setSearchStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">End Date</label>
              <input type="date" className="border px-3 py-2 rounded" value={searchEndDate} onChange={e => setSearchEndDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Admission</label>
              <select className="border px-3 py-2 rounded w-32" value={searchAdmissionType} onChange={e => setSearchAdmissionType(e.target.value)}>
                <option value="">All</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Sort</label>
              <select className="border px-3 py-2 rounded w-40" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="startDate,asc">Date (Earliest)</option>
                <option value="startDate,desc">Date (Latest)</option>
                <option value="title,asc">Title (A-Z)</option>
                <option value="title,desc">Title (Z-A)</option>
                <option value="id,desc">ID (Newest)</option>
                <option value="id,asc">ID (Oldest)</option>
              </select>
            </div>
          </div>

          {/* Event Filter Toggle */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <span className={`text-lg font-medium ${!showPastEvents ? 'text-blue-600' : 'text-gray-500'}`}>
              Future Events
            </span>
            <button
              onClick={() => setShowPastEvents(!showPastEvents)}
              className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ backgroundColor: showPastEvents ? '#3b82f6' : '#d1d5db' }}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${showPastEvents ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-lg font-medium ${showPastEvents ? 'text-blue-600' : 'text-gray-500'}`}>
              Past Events
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <EventList
        events={events}
        eventTypes={eventTypes}
        calendarEvents={calendarEvents}
        loading={loading}
        onCancelEvent={handleCancelEvent}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        currentPage={page}
        totalCount={totalCount}
        pageSize={pageSize}
        showPastEvents={showPastEvents}
      />
    </div>
  );
}

