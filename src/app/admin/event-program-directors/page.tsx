'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/Modal';
import AdminNavigation from '@/components/AdminNavigation';
import type { EventProgramDirectorsDTO } from '@/types';
import {
  fetchEventProgramDirectorsServer,
  createEventProgramDirectorServer,
  updateEventProgramDirectorServer,
  deleteEventProgramDirectorServer,
} from './ApiServerActions';

export default function GlobalEventProgramDirectorsPage() {
  const { userId } = useAuth();
  const router = useRouter();

  const [directors, setDirectors] = useState<EventProgramDirectorsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<EventProgramDirectorsDTO | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<EventProgramDirectorsDTO>>({
    name: '',
    photoUrl: '',
    bio: '',
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (userId) {
      loadDirectors();
    }
  }, [userId]);

  const loadDirectors = async () => {
    try {
      setLoading(true);
      const directorsData = await fetchEventProgramDirectorsServer();
      setDirectors(directorsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load program directors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    console.log('🚀 Global handleCreate called!');
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.name?.trim()) {
        setToastMessage({ type: 'error', message: 'Name is required' });
        return;
      }
      
      const directorData = {
        name: formData.name.trim(),
        photoUrl: formData.photoUrl?.trim() || undefined,
        bio: formData.bio?.trim() || undefined,
      };
      
      // Debug logging
      console.log('🔍 Global Frontend Event Program Director Debug:');
      console.log('📝 Form data:', formData);
      console.log('📤 Director data being sent:', directorData);
      
      const newDirector = await createEventProgramDirectorServer(directorData);
      setDirectors(prev => [...prev, newDirector]);
      setIsCreateModalOpen(false);
      resetForm();
      setToastMessage({ type: 'success', message: 'Program director created successfully' });
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Failed to create program director' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedDirector) return;

    try {
      setLoading(true);
      const updatedDirector = await updateEventProgramDirectorServer(selectedDirector.id!, formData);
      setDirectors(prev => prev.map(d => d.id === selectedDirector.id ? updatedDirector : d));
      setIsEditModalOpen(false);
      setSelectedDirector(null);
      resetForm();
      setToastMessage({ type: 'success', message: 'Program director updated successfully' });
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Failed to update program director' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDirector) return;

    try {
      setLoading(true);
      await deleteEventProgramDirectorServer(selectedDirector.id!);
      setDirectors(prev => prev.filter(d => d.id !== selectedDirector.id));
      setIsDeleteModalOpen(false);
      setSelectedDirector(null);
      setToastMessage({ type: 'success', message: 'Program director deleted successfully' });
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Failed to delete program director' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      photoUrl: '',
      bio: '',
    });
  };

  const openEditModal = (director: EventProgramDirectorsDTO) => {
    setSelectedDirector(director);
    setFormData({
      name: director.name || '',
      photoUrl: director.photoUrl || '',
      bio: director.bio || '',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (director: EventProgramDirectorsDTO) => {
    setSelectedDirector(director);
    setIsDeleteModalOpen(true);
  };

  // Filter and sort directors
  const filteredDirectors = directors.filter(director =>
    director.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    director.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDirectors = [...filteredDirectors].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey as keyof EventProgramDirectorsDTO];
    const bValue = b[sortKey as keyof EventProgramDirectorsDTO];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const columns: Column<EventProgramDirectorsDTO>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'bio', label: 'Bio', sortable: true },
  ];

  if (loading && directors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminNavigation currentPage="event-program-directors" />
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading program directors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminNavigation currentPage="event-program-directors" />
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Global Event Program Directors</h1>
                <p className="text-gray-600 mt-1">Manage program directors across all events</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
              >
                <FaPlus className="text-sm" />
                <span>Add Director</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search directors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              data={sortedDirectors}
              columns={columns}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={(key, direction) => {
                setSortKey(key);
                setSortDirection(direction);
              }}
            />
          </div>
        </div>

        {/* Toast Message */}
        {toastMessage && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            toastMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toastMessage.message}
            <button
              onClick={() => setToastMessage(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Add Global Program Director"
        size="lg"
      >
        <DirectorForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          loading={loading}
          submitText="Create Director"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDirector(null);
          resetForm();
        }}
        title="Edit Global Program Director"
        size="lg"
      >
        <DirectorForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEdit}
          loading={loading}
          submitText="Update Director"
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDirector(null);
        }}
        onConfirm={handleDelete}
        title="Delete Program Director"
        message={`Are you sure you want to delete "${selectedDirector?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

// Director Form Component
interface DirectorFormProps {
  formData: Partial<EventProgramDirectorsDTO>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<EventProgramDirectorsDTO>>>;
  onSubmit: () => void;
  loading: boolean;
  submitText: string;
}

function DirectorForm({ formData, setFormData, onSubmit, loading, submitText }: DirectorFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter program director's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo URL
          </label>
          <input
            type="url"
            name="photoUrl"
            value={formData.photoUrl || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter photo URL"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter director's biography"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {/* Close modal logic handled by parent */}}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : submitText}
        </button>
      </div>
    </form>
  );
}
