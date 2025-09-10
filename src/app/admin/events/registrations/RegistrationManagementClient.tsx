'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { RegistrationManagementData } from './ApiServerActions';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaUserFriends,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaUser,
  FaUsers,
  FaExclamationTriangle,
  FaStickyNote
} from 'react-icons/fa';
import Link from 'next/link';

interface RegistrationManagementClientProps {
  data: RegistrationManagementData;
}

export default function RegistrationManagementClient({ data }: RegistrationManagementClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([]);
  const [viewingAttendee, setViewingAttendee] = useState<any>(null);
  const [editingAttendee, setEditingAttendee] = useState<any>(null);
  const [deletingAttendee, setDeletingAttendee] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const {
    attendees,
    totalCount,
    currentPage,
    totalPages,
    events,
    selectedEvent,
    searchTerm,
    searchType: dataSearchType,
    statusFilter
  } = data;

  const [searchType, setSearchType] = useState<'name' | 'email' | 'eventId'>(dataSearchType as 'name' | 'email' | 'eventId' || 'name');
  const [searchValue, setSearchValue] = useState(searchTerm);

  const handleSearch = (search: string, type: 'name' | 'email' | 'eventId' = searchType) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
      params.set('searchType', type);
    } else {
      params.delete('search');
      params.delete('searchType');
    }
    params.delete('page'); // Reset to first page
    router.push(`/admin/events/registrations?${params.toString()}`);
  };

  const handleSearchTypeChange = (type: 'name' | 'email' | 'eventId') => {
    setSearchType(type);
    if (searchValue) {
      handleSearch(searchValue, type);
    }
  };

  const handleEventFilter = (eventId: string) => {
    const params = new URLSearchParams(searchParams);
    if (eventId) {
      params.set('eventId', eventId);
    } else {
      params.delete('eventId');
    }
    params.delete('page'); // Reset to first page
    router.push(`/admin/events/registrations?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.delete('page'); // Reset to first page
    router.push(`/admin/events/registrations?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/admin/events/registrations?${params.toString()}`);
  };

  const handleExportCSV = async () => {
    try {
      const eventId = searchParams.get('eventId');
      const search = searchParams.get('search') || '';
      const searchType = searchParams.get('searchType') || 'name';
      const status = searchParams.get('status') || '';

      const { exportRegistrationsToCSV } = await import('./ApiServerActions');
      const csvContent = await exportRegistrationsToCSV(
        eventId ? parseInt(eventId) : null,
        search,
        searchType,
        status
      );

      if (csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  const handleSelectAll = () => {
    if (selectedAttendees.length === attendees.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(attendees.map(a => a.id).filter(id => id !== null) as number[]);
    }
  };

  const handleSelectAttendee = (attendeeId: number) => {
    setSelectedAttendees(prev =>
      prev.includes(attendeeId)
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REGISTERED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'WAITLISTED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewAttendee = (attendee: any) => {
    setViewingAttendee(attendee);
  };

  const handleEditAttendee = (attendee: any) => {
    setEditingAttendee(attendee);
    setEditForm({
      firstName: attendee.firstName || '',
      lastName: attendee.lastName || '',
      email: attendee.email || '',
      phone: attendee.phone || '',
      registrationStatus: attendee.registrationStatus || 'REGISTERED',
      specialRequirements: attendee.specialRequirements || '',
      dietaryRestrictions: attendee.dietaryRestrictions || '',
      accessibilityNeeds: attendee.accessibilityNeeds || '',
      emergencyContactName: attendee.emergencyContactName || '',
      emergencyContactPhone: attendee.emergencyContactPhone || '',
      emergencyContactRelationship: attendee.emergencyContactRelationship || '',
      totalNumberOfGuests: attendee.totalNumberOfGuests || 0,
      numberOfGuestsCheckedIn: attendee.numberOfGuestsCheckedIn || 0,
      notes: attendee.notes || ''
    });
  };

  const handleDeleteAttendee = (attendee: any) => {
    setDeletingAttendee(attendee);
  };

  const confirmDeleteAttendee = async () => {
    if (!deletingAttendee) return;

    setIsDeleting(true);
    try {
      const { deleteAttendeeRegistration } = await import('./ApiServerActions');
      const success = await deleteAttendeeRegistration(deletingAttendee.id);

      if (success) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert('Failed to delete attendee registration. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting attendee:', error);
      alert('An error occurred while deleting the attendee registration.');
    } finally {
      setIsDeleting(false);
      setDeletingAttendee(null);
    }
  };

  const closeViewModal = () => {
    setViewingAttendee(null);
  };

  const closeDeleteModal = () => {
    setDeletingAttendee(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAttendee = async () => {
    if (!editingAttendee) return;

    setIsSaving(true);
    try {
      const { updateAttendeeRegistration } = await import('./ApiServerActions');
      const success = await updateAttendeeRegistration(editingAttendee.id, editForm);

      if (success) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert('Failed to update attendee registration. Please try again.');
      }
    } catch (error) {
      console.error('Error updating attendee:', error);
      alert('An error occurred while updating the attendee registration.');
    } finally {
      setIsSaving(false);
      setEditingAttendee(null);
      setEditForm({});
    }
  };

  const closeEditModal = () => {
    setEditingAttendee(null);
    setEditForm({});
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Registration Management
        </h1>
        <p className="text-gray-600">
          {selectedEvent
            ? `Manage registrations for ${selectedEvent.title}`
            : 'Manage all event registrations'
          }
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {/* Search Type Dropdown */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={searchType}
              onChange={(e) => handleSearchTypeChange(e.target.value as 'name' | 'email' | 'eventId')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="name">Search by Name</option>
              <option value="email">Search by Email</option>
              <option value="eventId">Search by Event ID</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={searchType === 'eventId' ? 'number' : 'text'}
              placeholder={
                searchType === 'name'
                  ? 'Enter name to search...'
                  : searchType === 'email'
                    ? 'Enter email to search...'
                    : 'Enter Event ID...'
              }
              value={searchValue}
              onChange={(e) => {
                const value = e.target.value;
                setSearchValue(value);
                const timeoutId = setTimeout(() => handleSearch(value), 500);
                return () => clearTimeout(timeoutId);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Event Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedEvent?.id || ''}
              onChange={(e) => handleEventFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="REGISTERED">Registered</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="WAITLISTED">Waitlisted</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {attendees.length} of {totalCount} registrations
          </span>
          {selectedAttendees.length > 0 && (
            <span className="text-blue-600">
              {selectedAttendees.length} selected
            </span>
          )}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.length === attendees.length && attendees.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.includes(attendee.id!)}
                      onChange={() => handleSelectAttendee(attendee.id!)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <FaUserFriends className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {attendee.firstName} {attendee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {attendee.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FaEnvelope className="h-4 w-4 text-gray-400 mr-2" />
                      {attendee.email}
                    </div>
                    {attendee.phone && (
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <FaPhone className="h-4 w-4 text-gray-400 mr-2" />
                        {attendee.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {selectedEvent?.title || `Event ${attendee.eventId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400 mr-2" />
                    {attendee.registrationDate
                      ? new Date(attendee.registrationDate).toLocaleDateString()
                      : 'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(attendee.registrationStatus || '')}`}>
                      {attendee.registrationStatus || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendee.totalNumberOfGuests || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewAttendee(attendee)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEditAttendee(attendee)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAttendee(attendee)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <Link
          href="/admin/events/dashboard"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/admin/events"
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-semibold"
        >
          Manage Events
        </Link>
      </div>

      {/* View Attendee Modal */}
      {viewingAttendee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Attendee Details
              </h3>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <FaUser className="mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">First Name</label>
                    <p className="text-sm text-gray-900">{viewingAttendee.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Name</label>
                    <p className="text-sm text-gray-900">{viewingAttendee.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{viewingAttendee.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{viewingAttendee.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Event Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Event ID</label>
                    <p className="text-sm text-gray-900">{viewingAttendee.eventId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-sm text-gray-900">
                      {viewingAttendee.registrationDate
                        ? new Date(viewingAttendee.registrationDate).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewingAttendee.registrationStatus || '')}`}>
                      {viewingAttendee.registrationStatus || 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Total Guests</label>
                    <p className="text-sm text-gray-900">{viewingAttendee.totalNumberOfGuests || 0}</p>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {(viewingAttendee.specialRequirements || viewingAttendee.dietaryRestrictions || viewingAttendee.accessibilityNeeds) && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    Special Requirements
                  </h4>
                  <div className="space-y-3">
                    {viewingAttendee.specialRequirements && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Special Requirements</label>
                        <p className="text-sm text-gray-900">{viewingAttendee.specialRequirements}</p>
                      </div>
                    )}
                    {viewingAttendee.dietaryRestrictions && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Dietary Restrictions</label>
                        <p className="text-sm text-gray-900">{viewingAttendee.dietaryRestrictions}</p>
                      </div>
                    )}
                    {viewingAttendee.accessibilityNeeds && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Accessibility Needs</label>
                        <p className="text-sm text-gray-900">{viewingAttendee.accessibilityNeeds}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              {(viewingAttendee.emergencyContactName || viewingAttendee.emergencyContactPhone) && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Contact Name</label>
                      <p className="text-sm text-gray-900">{viewingAttendee.emergencyContactName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Contact Phone</label>
                      <p className="text-sm text-gray-900">{viewingAttendee.emergencyContactPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Relationship</label>
                      <p className="text-sm text-gray-900">{viewingAttendee.emergencyContactRelationship || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Attendee Modal */}
      {editingAttendee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Attendee Registration
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={editForm.firstName || ''}
                      onChange={(e) => handleFormChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={editForm.lastName || ''}
                      onChange={(e) => handleFormChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Registration Status */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCalendarAlt className="mr-2 text-green-600" />
                  Registration Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editForm.registrationStatus || 'REGISTERED'}
                      onChange={(e) => handleFormChange('registrationStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="REGISTERED">Registered</option>
                      <option value="PENDING">Pending</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="WAITLISTED">Waitlisted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guest Management */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUsers className="mr-2 text-purple-600" />
                  Guest Management
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Number of Guests</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.totalNumberOfGuests || 0}
                      onChange={(e) => handleFormChange('totalNumberOfGuests', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests Checked In</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.numberOfGuestsCheckedIn || 0}
                      onChange={(e) => handleFormChange('numberOfGuestsCheckedIn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <FaExclamationTriangle className="mr-2 text-orange-600" />
                  Special Requirements
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                    <textarea
                      value={editForm.specialRequirements || ''}
                      onChange={(e) => handleFormChange('specialRequirements', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                    <textarea
                      value={editForm.dietaryRestrictions || ''}
                      onChange={(e) => handleFormChange('dietaryRestrictions', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any dietary restrictions or allergies..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accessibility Needs</label>
                    <textarea
                      value={editForm.accessibilityNeeds || ''}
                      onChange={(e) => handleFormChange('accessibilityNeeds', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any accessibility needs or accommodations..."
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <FaStickyNote className="mr-2 text-yellow-600" />
                  Additional Notes
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional notes or comments about this attendee..."
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <FaPhone className="mr-2 text-red-600" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={editForm.emergencyContactName || ''}
                      onChange={(e) => handleFormChange('emergencyContactName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={editForm.emergencyContactPhone || ''}
                      onChange={(e) => handleFormChange('emergencyContactPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={editForm.emergencyContactRelationship || ''}
                      onChange={(e) => handleFormChange('emergencyContactRelationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Spouse, Parent, Friend"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={closeEditModal}
                disabled={isSaving}
                className="px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <FaTimes />
                Cancel
              </button>
              <button
                onClick={handleSaveAttendee}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaEdit />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAttendee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Registration
                  </h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the registration for{' '}
                  <span className="font-semibold text-gray-900">
                    {deletingAttendee.firstName} {deletingAttendee.lastName}
                  </span>?
                </p>
                <p className="text-sm text-red-600 mt-2">
                  This action cannot be undone and will permanently remove the registration data.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAttendee}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Registration'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
