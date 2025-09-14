'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaArrowLeft, FaHandshake } from 'react-icons/fa';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DataTable, { Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/Modal';
import type { EventSponsorsDTO, EventSponsorsJoinDTO, EventDetailsDTO } from '@/types';
import {
  fetchEventSponsorsServer,
  fetchEventSponsorsJoinServer,
  createEventSponsorServer,
  updateEventSponsorServer,
  deleteEventSponsorServer,
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<EventSponsorsJoinDTO | null>(null);
  const [selectedAvailableSponsor, setSelectedAvailableSponsor] = useState<EventSponsorsDTO | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<EventSponsorsDTO>>({
    name: '',
    type: '',
    companyName: '',
    tagline: '',
    description: '',
    websiteUrl: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: '',
    heroImageUrl: '',
    bannerImageUrl: '',
    isActive: true,
    priorityRanking: 0,
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    event: { id: parseInt(eventId) } as EventDetailsDTO,
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

      // Load available sponsors and event sponsors
      const [availableSponsorsData, eventSponsorsData] = await Promise.all([
        fetchEventSponsorsServer(),
        fetchEventSponsorsJoinServer(parseInt(eventId))
      ]);

      setAvailableSponsors(availableSponsorsData);
      setEventSponsors(eventSponsorsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load event sponsors');
      setToastMessage({ type: 'error', message: err.message || 'Failed to load event sponsors' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSponsor = async () => {
    if (!selectedAvailableSponsor) return;

    try {
      setLoading(true);
      const sponsorJoinData = {
        ...formData,
        event: { id: parseInt(eventId) } as EventDetailsDTO,
        sponsor: selectedAvailableSponsor
      };
      const newSponsorJoin = await createEventSponsorJoinServer(sponsorJoinData as any);
      setEventSponsors(prev => [...prev, newSponsorJoin]);
      setIsAssignModalOpen(false);
      setSelectedAvailableSponsor(null);
      resetForm();
      setToastMessage({ type: 'success', message: 'Sponsor assigned to event successfully' });
    } catch (err: any) {
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
      setToastMessage({ type: 'success', message: 'Sponsor updated successfully' });
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Failed to update sponsor' });
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
      setToastMessage({ type: 'error', message: err.message || 'Failed to remove sponsor' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      companyName: '',
      tagline: '',
      description: '',
      websiteUrl: '',
      contactEmail: '',
      contactPhone: '',
      logoUrl: '',
      heroImageUrl: '',
      bannerImageUrl: '',
      isActive: true,
      priorityRanking: 0,
      facebookUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
      event: { id: parseInt(eventId) } as EventDetailsDTO,
    });
  };

  const openEditModal = (sponsor: EventSponsorsJoinDTO) => {
    setSelectedSponsor(sponsor);
    setFormData(sponsor);
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
      const aVal = a[key as keyof EventSponsorsJoinDTO];
      const bVal = b[key as keyof EventSponsorsJoinDTO];

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setEventSponsors(sorted);
  };

  const filteredEventSponsors = eventSponsors.filter(sponsor =>
    sponsor.sponsor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.sponsor?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.sponsor?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<EventSponsorsJoinDTO>[] = [
    {
      key: 'sponsor',
      label: 'Sponsor Name',
      sortable: true,
      render: (value) => value?.name || '-'
    },
    {
      key: 'sponsor',
      label: 'Type',
      sortable: true,
      render: (value) => value?.type || '-'
    },
    {
      key: 'sponsor',
      label: 'Company',
      sortable: true,
      render: (value) => value?.companyName || '-'
    },
    {
      key: 'sponsor',
      label: 'Active',
      sortable: true,
      render: (value) => value?.isActive ? 'Yes' : 'No'
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
      <div className="flex items-center mb-6">
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
          <p className="text-gray-600">Manage sponsors for this event</p>
        </div>
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
          <Link
            href="/admin/event-sponsors"
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow font-bold flex items-center gap-2 hover:bg-green-700 transition"
          >
            <FaHandshake />
            Manage All Sponsors
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Available Sponsors Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Sponsors</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSponsors.map((sponsor) => (
              <div key={sponsor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{sponsor.sponsorName}</h3>
                  <button
                    onClick={() => openAssignModal(sponsor)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                  >
                    Assign
                  </button>
                </div>
                <p className="text-sm text-gray-600">{sponsor.contactPerson || 'No contact person'}</p>
                <p className="text-sm text-gray-500">{sponsor.sponsorshipLevel || 'No level set'}</p>
              </div>
            ))}
          </div>
          {availableSponsors.length === 0 && (
            <p className="text-gray-500 text-center py-8">No available sponsors found. Create sponsors first.</p>
          )}
        </div>
      </div>

      {/* Event Sponsors Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Event Sponsors</h2>
        <DataTable
          data={filteredEventSponsors}
          columns={columns}
          loading={loading}
          onSort={handleSort}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          sortKey={sortKey}
          sortDirection={sortDirection}
          emptyMessage="No sponsors assigned to this event"
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
        title={`Assign Sponsor: ${selectedAvailableSponsor?.sponsorName}`}
        size="lg"
      >
        <SponsorJoinForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAssignSponsor}
          loading={loading}
          submitText="Assign Sponsor"
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
        title="Edit Event Sponsor"
        size="lg"
      >
        <SponsorJoinForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEdit}
          loading={loading}
          submitText="Update Sponsor"
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
        message={`Are you sure you want to remove "${selectedSponsor?.sponsor?.sponsorName}" from this event? This action cannot be undone.`}
        confirmText="Remove"
        variant="danger"
      />
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
}

function SponsorJoinForm({ formData, setFormData, onSubmit, loading, submitText }: SponsorJoinFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the sponsor and their contribution"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : submitText}
        </button>
      </div>
    </form>
  );
}
