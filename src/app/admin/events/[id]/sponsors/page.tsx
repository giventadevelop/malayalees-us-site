'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaArrowLeft, FaUserPlus, FaHandshake } from 'react-icons/fa';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DataTable, { Column } from '@/components/ui/DataTable';
import Modal, { ConfirmModal } from '@/components/ui/Modal';
import type { EventSponsorsDTO, EventSponsorsJoinDTO, EventDetailsDTO } from '@/types';
import {
  fetchEventSponsorsServer,
  fetchEventSponsorsJoinServer,
  createEventSponsorServer,
  createEventSponsorJoinServer,
  updateEventSponsorJoinServer,
  deleteEventSponsorJoinServer,
} from './ApiServerActions';

export default function EventSponsorsPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<EventDetailsDTO | null>(null);
  const [availableSponsors, setAvailableSponsors] = useState<EventSponsorsDTO[]>([]);
  const [eventSponsors, setEventSponsors] = useState<EventSponsorsJoinDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCreateSponsorModalOpen, setIsCreateSponsorModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<EventSponsorsJoinDTO | null>(null);
  const [selectedAvailableSponsor, setSelectedAvailableSponsor] = useState<EventSponsorsDTO | null>(null);

  // Form state for creating new sponsor join
  const [formData, setFormData] = useState<Partial<EventSponsorsJoinDTO>>({
    event: { id: parseInt(eventId) } as EventDetailsDTO,
    sponsor: undefined,
  });

  // Form state for creating new sponsor
  const [sponsorFormData, setSponsorFormData] = useState<Partial<EventSponsorsDTO>>({
    name: '',
    type: '',
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    isActive: true,
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (userId && eventId) {
      loadEventAndSponsors();
    }
  }, [userId, eventId]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const loadEventAndSponsors = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load event details
      const eventResponse = await fetch(`/api/proxy/event-details/${eventId}`);
      if (eventResponse.ok) {
        const eventData = await eventResponse.json();
        setEvent(eventData);
      }

      // Load event sponsors for this specific event
      console.log('🔍 Loading event sponsors for event ID:', eventId);
      const eventSponsorsData = await fetchEventSponsorsJoinServer(parseInt(eventId));
      console.log('✅ Loaded', eventSponsorsData.length, 'sponsors for event');
      setEventSponsors(eventSponsorsData);

      // Load available sponsors (global sponsors) for assignment
      try {
        const availableSponsorsData = await fetchEventSponsorsServer();
        setAvailableSponsors(availableSponsorsData);
      } catch (sponsorErr) {
        console.warn('Failed to load available sponsors:', sponsorErr);
        // Don't fail the whole page if available sponsors can't be loaded
        setAvailableSponsors([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load event sponsors');
      setToastMessage({ type: 'error', message: err.message || 'Failed to load event sponsors' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSponsor = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!sponsorFormData.name?.trim()) {
        setToastMessage({ type: 'error', message: 'Sponsor name is required' });
        return;
      }

      if (!sponsorFormData.type?.trim()) {
        setToastMessage({ type: 'error', message: 'Sponsor type is required' });
        return;
      }

      const sponsorData = {
        name: sponsorFormData.name.trim(),
        type: sponsorFormData.type.trim(),
        companyName: sponsorFormData.companyName?.trim() || undefined,
        contactEmail: sponsorFormData.contactEmail?.trim() || undefined,
        contactPhone: sponsorFormData.contactPhone?.trim() || undefined,
        isActive: sponsorFormData.isActive || true,
      };

      console.log('🔍 Creating new sponsor:', sponsorData);

      const newSponsor = await createEventSponsorServer(sponsorData);
      setAvailableSponsors(prev => [...prev, newSponsor]);
      setIsCreateSponsorModalOpen(false);
      resetSponsorForm();
      setToastMessage({ type: 'success', message: 'Sponsor created successfully' });
    } catch (err: any) {
      console.error('❌ Failed to create sponsor:', err);
      setToastMessage({ type: 'error', message: err.message || 'Failed to create sponsor' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSponsor = async () => {
    if (!selectedAvailableSponsor) return;

    try {
      setLoading(true);

      // Create sponsor join record
      const sponsorJoinData = {
        event: { id: parseInt(eventId) } as EventDetailsDTO,
        sponsor: selectedAvailableSponsor
      };

      console.log('🔍 Assigning sponsor to event:', {
        eventId: parseInt(eventId),
        sponsorId: selectedAvailableSponsor.id,
        sponsorName: selectedAvailableSponsor.name
      });

      const newSponsorJoin = await createEventSponsorJoinServer(sponsorJoinData);
      setEventSponsors(prev => [...prev, newSponsorJoin]);
      setIsAssignModalOpen(false);
      setSelectedAvailableSponsor(null);
      resetForm();
      setToastMessage({ type: 'success', message: 'Sponsor assigned to event successfully' });
    } catch (err: any) {
      console.error('❌ Failed to assign sponsor:', err);
      setToastMessage({ type: 'error', message: err.message || 'Failed to assign sponsor' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedSponsor) return;

    try {
      setLoading(true);
      const updatedSponsorJoin = await updateEventSponsorJoinServer(selectedSponsor.id!, formData);
      setEventSponsors(prev => prev.map(s => s.id === selectedSponsor.id ? updatedSponsorJoin : s));
      setIsEditModalOpen(false);
      setSelectedSponsor(null);
      resetForm();
      setToastMessage({ type: 'success', message: 'Sponsor assignment updated successfully' });
    } catch (err: any) {
      console.error('❌ Failed to update sponsor assignment:', err);
      setToastMessage({ type: 'error', message: err.message || 'Failed to update sponsor assignment' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSponsor) return;

    try {
      setLoading(true);
      await deleteEventSponsorJoinServer(selectedSponsor.id!);
      setEventSponsors(prev => prev.filter(s => s.id !== selectedSponsor.id));
      setIsDeleteModalOpen(false);
      setSelectedSponsor(null);
      setToastMessage({ type: 'success', message: 'Sponsor removed from event successfully' });
    } catch (err: any) {
      console.error('❌ Failed to remove sponsor from event:', err);
      setToastMessage({ type: 'error', message: err.message || 'Failed to remove sponsor from event' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      event: { id: parseInt(eventId) } as EventDetailsDTO,
      sponsor: undefined,
    });
  };

  const resetSponsorForm = () => {
    setSponsorFormData({
      name: '',
      type: '',
      companyName: '',
      contactEmail: '',
      contactPhone: '',
      isActive: true,
    });
  };

  const testApiCall = async () => {
    console.log('🧪 Testing API call for event ID:', eventId);
    try {
      const data = await fetchEventSponsorsJoinServer(parseInt(eventId));
      console.log('🧪 Test API result:', data);
      setToastMessage({ type: 'success', message: `API test successful. Found ${Array.isArray(data) ? data.length : 'unknown'} sponsors.` });
    } catch (error: any) {
      console.error('🧪 Test API error:', error);
      setToastMessage({ type: 'error', message: `API test failed: ${error.message}` });
    }
  };

  const openEditModal = (sponsor: EventSponsorsJoinDTO) => {
    setSelectedSponsor(sponsor);
    setFormData({
      event: sponsor.event,
      sponsor: sponsor.sponsor,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (sponsor: EventSponsorsJoinDTO) => {
    setSelectedSponsor(sponsor);
    setIsDeleteModalOpen(true);
  };

  const openAssignModal = (sponsor: EventSponsorsDTO) => {
    setSelectedAvailableSponsor(sponsor);
    setIsAssignModalOpen(true);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);

    const sorted = [...eventSponsors].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (key === 'sponsorName') {
        aVal = a.sponsor?.name;
        bVal = b.sponsor?.name;
      } else if (key === 'sponsorType') {
        aVal = a.sponsor?.type;
        bVal = b.sponsor?.type;
      } else if (key === 'sponsorCompany') {
        aVal = a.sponsor?.companyName;
        bVal = b.sponsor?.companyName;
      } else if (key === 'sponsorEmail') {
        aVal = a.sponsor?.contactEmail;
        bVal = b.sponsor?.contactEmail;
      } else if (key === 'sponsorActive') {
        aVal = a.sponsor?.isActive;
        bVal = b.sponsor?.isActive;
      } else if (key === 'createdAt') {
        aVal = a.createdAt;
        bVal = b.createdAt;
      } else {
        aVal = a[key as keyof EventSponsorsJoinDTO];
        bVal = b[key as keyof EventSponsorsJoinDTO];
      }

      // Handle undefined values
      if (aVal === undefined && bVal === undefined) return 0;
      if (aVal === undefined) return direction === 'asc' ? 1 : -1;
      if (bVal === undefined) return direction === 'asc' ? -1 : 1;

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setEventSponsors(sorted);
  };

  const filteredEventSponsors = eventSponsors.filter(sponsor => {
    // Add safety check for sponsor object
    if (!sponsor || !sponsor.sponsor) {
      return false;
    }

    return sponsor.sponsor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.sponsor?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.sponsor?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const columns: Column<EventSponsorsJoinDTO>[] = [
    {
      key: 'sponsorName',
      label: 'Sponsor Name',
      sortable: true,
      render: (value, row) => row?.sponsor?.name || '-'
    },
    {
      key: 'sponsorType',
      label: 'Type',
      sortable: true,
      render: (value, row) => row?.sponsor?.type || '-'
    },
    {
      key: 'sponsorCompany',
      label: 'Company',
      sortable: true,
      render: (value, row) => row?.sponsor?.companyName || '-'
    },
    {
      key: 'sponsorEmail',
      label: 'Contact Email',
      sortable: true,
      render: (value, row) => row?.sponsor?.contactEmail || '-'
    },
    {
      key: 'sponsorActive',
      label: 'Active',
      sortable: true,
      render: (value, row) => row?.sponsor?.isActive ? 'Yes' : 'No'
    },
    {
      key: 'createdAt',
      label: 'Assigned Date',
      sortable: true,
      render: (value, row) => row?.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'
    },
  ];

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
            href={`/admin/events/${eventId}/edit`}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Event
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Event Sponsors
              {event && <span className="text-lg font-normal text-gray-600 ml-2">- {event.title}</span>}
            </h1>
            <p className="text-gray-600">Manage sponsor assignments for this specific event only</p>
          </div>
        </div>
        <button
          onClick={testApiCall}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow font-medium flex items-center gap-2 hover:bg-purple-700 transition"
        >
          🧪 Test API
        </button>
      </div>

      {/* Toast Message */}
      {toastMessage && (
        <div className={`mb-4 p-4 rounded-lg ${toastMessage.type === 'success'
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
          {toastMessage.message}
        </div>
      )}


      {/* Search and Filter Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search event sponsors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Available Sponsors Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">Available Sponsors to Assign</h2>
            <p className="text-gray-600 text-sm mt-1">
              Select from existing sponsors to assign them to this event, or create a new sponsor.
            </p>
          </div>
          <button
            onClick={() => setIsCreateSponsorModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow font-bold flex items-center gap-2 hover:bg-green-700 transition"
          >
            <FaPlus />
            Create New Sponsor
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSponsors.map((sponsor) => (
              <div key={sponsor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{sponsor.name}</h3>
                  <button
                    onClick={() => openAssignModal(sponsor)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                  >
                    Assign
                  </button>
                </div>
                <p className="text-sm text-gray-600">{sponsor.type || 'No type set'}</p>
                <p className="text-sm text-gray-500">{sponsor.companyName || 'No company name'}</p>
                <p className="text-sm text-gray-500">{sponsor.contactEmail || 'No contact email'}</p>
              </div>
            ))}
          </div>
          {availableSponsors.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <FaUserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Sponsors</h3>
                <p className="text-gray-500 mb-4">
                  Create your first sponsor to get started with event sponsorships.
                </p>
                <button
                  onClick={() => setIsCreateSponsorModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create Your First Sponsor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Sponsors Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Event Sponsors ({filteredEventSponsors.length})</h2>

        {/* Debug Info */}
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <p><strong>Debug:</strong> filteredEventSponsors.length = {filteredEventSponsors.length}</p>
          <p><strong>Debug:</strong> eventSponsors.length = {eventSponsors.length}</p>
          {filteredEventSponsors.length > 0 && (
            <div>
              <p><strong>First sponsor name:</strong> {filteredEventSponsors[0]?.sponsor?.name || 'undefined'}</p>
              <p><strong>First sponsor type:</strong> {filteredEventSponsors[0]?.sponsor?.type || 'undefined'}</p>
            </div>
          )}
        </div>

        <DataTable
          data={filteredEventSponsors || []}
          columns={columns}
          loading={loading}
          onSort={handleSort}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          sortKey={sortKey}
          sortDirection={sortDirection}
          emptyMessage="No sponsors assigned to this event yet. Assign sponsors from the available sponsors above."
        />
      </div>

      {/* Assign Sponsor Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedAvailableSponsor(null);
          resetForm();
        }}
        title={`Assign Sponsor: ${selectedAvailableSponsor?.name}`}
        size="lg"
      >
        <SponsorJoinForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAssignSponsor}
          loading={loading}
          submitText="Assign Sponsor"
          selectedSponsor={selectedAvailableSponsor}
        />
      </Modal>

      {/* Edit Sponsor Join Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSponsor(null);
          resetForm();
        }}
        title="Edit Sponsor Assignment"
        size="lg"
      >
        <SponsorJoinForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEdit}
          loading={loading}
          submitText="Update Assignment"
          selectedSponsor={selectedSponsor?.sponsor}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSponsor(null);
        }}
        onConfirm={handleDelete}
        title="Remove Sponsor"
        message={`Are you sure you want to remove "${selectedSponsor?.sponsor?.name}" from this event? This action cannot be undone.`}
        confirmText="Remove"
        variant="danger"
      />

      {/* Create New Sponsor Modal */}
      <Modal
        isOpen={isCreateSponsorModalOpen}
        onClose={() => {
          setIsCreateSponsorModalOpen(false);
          resetSponsorForm();
        }}
        title="Create New Sponsor"
        size="lg"
      >
        <SponsorForm
          formData={sponsorFormData}
          setFormData={setSponsorFormData}
          onSubmit={handleCreateSponsor}
          loading={loading}
          submitText="Create Sponsor"
        />
      </Modal>
    </div>
  );
}

// Sponsor Join Form Component
interface SponsorJoinFormProps {
  formData: Partial<EventSponsorsJoinDTO>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<EventSponsorsJoinDTO>>>;
  onSubmit: () => void;
  loading: boolean;
  submitText: string;
  selectedSponsor?: EventSponsorsDTO | null;
}

function SponsorJoinForm({ formData, setFormData, onSubmit, loading, submitText, selectedSponsor }: SponsorJoinFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sponsor Information Display */}
      {selectedSponsor && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sponsor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="text-sm text-gray-900">{selectedSponsor.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <p className="text-sm text-gray-900">{selectedSponsor.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <p className="text-sm text-gray-900">{selectedSponsor.companyName || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <p className="text-sm text-gray-900">{selectedSponsor.contactEmail || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Confirmation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaHandshake className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              {selectedSponsor ? 'Assign Sponsor to Event' : 'Update Sponsor Assignment'}
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              {selectedSponsor ? (
                <p>This will assign <strong>{selectedSponsor.name}</strong> to the current event. The sponsor will be visible on the event page and can be managed from this event's sponsor list.</p>
              ) : (
                <p>This will update the sponsor assignment for the current event.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : submitText}
        </button>
      </div>
    </form>
  );
}

// Sponsor Form Component
interface SponsorFormProps {
  formData: Partial<EventSponsorsDTO>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<EventSponsorsDTO>>>;
  onSubmit: () => void;
  loading: boolean;
  submitText: string;
}

function SponsorForm({ formData, setFormData, onSubmit, loading, submitText }: SponsorFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const sponsorTypes = [
    'Platinum',
    'Gold',
    'Silver',
    'Bronze',
    'Community Partner',
    'Media Partner',
    'Food & Beverage',
    'Entertainment',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sponsor Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter sponsor name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            name="type"
            value={formData.type || ''}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select sponsor type</option>
            {sponsorTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter contact email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter contact phone"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive || false}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Active Sponsor
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : submitText}
        </button>
      </div>
    </form>
  );
}
