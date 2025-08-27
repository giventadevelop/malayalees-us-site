'use client';

import { useState } from 'react';
import { FaPlus, FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import type { ExecutiveCommitteeTeamMemberDTO } from '@/types/executiveCommitteeTeamMember';
import ExecutiveCommitteeForm from './ExecutiveCommitteeForm';
import ExecutiveCommitteeList from './ExecutiveCommitteeList';
import ImageUploadDialog from './ImageUploadDialog';
import { Modal } from '@/components/Modal';
import { deleteExecutiveCommitteeMember } from './ApiServerActions';

interface ExecutiveCommitteeClientProps {
  initialMembers: ExecutiveCommitteeTeamMemberDTO[];
}

export default function ExecutiveCommitteeClient({ initialMembers }: ExecutiveCommitteeClientProps) {
  const [members, setMembers] = useState<ExecutiveCommitteeTeamMemberDTO[]>(initialMembers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ExecutiveCommitteeTeamMemberDTO | null>(null);
  const [viewingMember, setViewingMember] = useState<ExecutiveCommitteeTeamMemberDTO | null>(null);
  const [deletingMember, setDeletingMember] = useState<ExecutiveCommitteeTeamMemberDTO | null>(null);
  const [uploadingMember, setUploadingMember] = useState<ExecutiveCommitteeTeamMemberDTO | null>(null);

  const handleMemberCreated = (newMember: ExecutiveCommitteeTeamMemberDTO) => {
    setMembers(prev => [...prev, newMember]);
    setIsFormOpen(false);
  };

  const handleMemberUpdated = (updatedMember: ExecutiveCommitteeTeamMemberDTO) => {
    setMembers(prev => prev.map(member =>
      member.id === updatedMember.id ? updatedMember : member
    ));
    setEditingMember(null);
  };

  const handleMemberDeleted = (deletedId: number) => {
    setMembers(prev => prev.filter(member => member.id !== deletedId));
    setDeletingMember(null);
  };

  const handleImageUploadSuccess = (imageUrl: string) => {
    if (uploadingMember?.id) {
      // Update the member's profile image URL
      setMembers(prev => prev.map(member =>
        member.id === uploadingMember.id
          ? { ...member, profileImageUrl: imageUrl }
          : member
      ));
    }
    setUploadingMember(null);
  };

  const openEditForm = (member: ExecutiveCommitteeTeamMemberDTO) => {
    setEditingMember(member);
  };

  const openViewForm = (member: ExecutiveCommitteeTeamMemberDTO) => {
    setViewingMember(member);
  };

  const openDeleteModal = (member: ExecutiveCommitteeTeamMemberDTO) => {
    setDeletingMember(member);
  };

  const openUploadDialog = (member: ExecutiveCommitteeTeamMemberDTO) => {
    setUploadingMember(member);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Team Members ({members.length})
          </h2>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Add Member
        </button>
      </div>

      {/* Member List */}
      <ExecutiveCommitteeList
        members={members}
        onEdit={openEditForm}
        onView={openViewForm}
        onDelete={openDeleteModal}
        onUpload={openUploadDialog}
      />

      {/* Add/Edit Form Modal */}
      {(isFormOpen || editingMember) && (
        <Modal
          open={isFormOpen || !!editingMember}
          onClose={() => {
            setIsFormOpen(false);
            setEditingMember(null);
          }}
          title={editingMember ? 'Edit Team Member' : 'Add New Team Member'}
        >
          <ExecutiveCommitteeForm
            member={editingMember}
            onSuccess={editingMember ? handleMemberUpdated : handleMemberCreated}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingMember(null);
            }}
          />
        </Modal>
      )}

      {/* View Member Modal */}
      {viewingMember && (
        <Modal
          open={!!viewingMember}
          onClose={() => setViewingMember(null)}
          title="View Team Member"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {viewingMember.firstName} {viewingMember.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1 text-sm text-gray-900">{viewingMember.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <p className="mt-1 text-sm text-gray-900">{viewingMember.designation || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-sm text-gray-900">{viewingMember.department || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{viewingMember.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Join Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {viewingMember.joinDate ? new Date(viewingMember.joinDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {viewingMember.bio && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <p className="mt-1 text-sm text-gray-900">{viewingMember.bio}</p>
              </div>
            )}

            {viewingMember.expertise && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Expertise</label>
                <p className="mt-1 text-sm text-gray-900">{viewingMember.expertise}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  setViewingMember(null);
                  openEditForm(viewingMember);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => setViewingMember(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMember && (
        <Modal
          open={!!deletingMember}
          onClose={() => setDeletingMember(null)}
          title="Confirm Deletion"
        >
          <div className="text-center">
            <p className="text-lg">
              Are you sure you want to delete the team member: <strong>{deletingMember.firstName} {deletingMember.lastName}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setDeletingMember(null)}
                className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-4 py-2 rounded-md flex items-center gap-2"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deletingMember.id) {
                    const success = await deleteExecutiveCommitteeMember(deletingMember.id);
                    if (success) {
                      handleMemberDeleted(deletingMember.id);
                    } else {
                      alert('Failed to delete member. Please try again.');
                    }
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FaTrashAlt /> Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Image Upload Dialog */}
      {uploadingMember && (
        <ImageUploadDialog
          member={uploadingMember}
          isOpen={!!uploadingMember}
          onClose={() => setUploadingMember(null)}
          onUploadSuccess={handleImageUploadSuccess}
        />
      )}
    </div>
  );
}
