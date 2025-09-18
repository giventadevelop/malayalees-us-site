'use client';

import { useState, useEffect } from 'react';
import { PollList } from './components/PollList';
import { PollCreationForm } from './components/PollCreationForm';
import { PollDetailsModal } from './components/PollDetailsModal';
import { 
  createEventPollServer, 
  updateEventPollServer, 
  deleteEventPollServer,
  createEventPollOptionServer,
  fetchEventPollOptionsServer,
  deleteEventPollOptionServer
} from './ApiServerActions';
import type { EventPollDTO, EventPollOptionDTO } from '@/types';

interface PollManagementClientProps {
  initialPolls: EventPollDTO[];
}

export function PollManagementClient({ initialPolls }: PollManagementClientProps) {
  const [polls, setPolls] = useState<EventPollDTO[]>(initialPolls);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPoll, setEditingPoll] = useState<EventPollDTO | null>(null);
  const [viewingPoll, setViewingPoll] = useState<EventPollDTO | null>(null);
  const [pollOptions, setPollOptions] = useState<EventPollOptionDTO[]>([]);

  const handleCreatePoll = async (
    pollData: Omit<EventPollDTO, 'id' | 'createdAt' | 'updatedAt'>,
    options: Omit<EventPollOptionDTO, 'id' | 'createdAt' | 'updatedAt' | 'pollId'>[]
  ) => {
    try {
      setIsLoading(true);
      
      // Create the poll first
      const createdPoll = await createEventPollServer(pollData);
      
      // Create poll options
      const createdOptions = await Promise.all(
        options.map(option => 
          createEventPollOptionServer({
            ...option,
            pollId: createdPoll.id,
          })
        )
      );
      
      // Update local state
      setPolls(prev => [createdPoll, ...prev]);
      setShowCreateForm(false);
      
      // Show success message
      alert('Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePoll = async (
    pollData: Omit<EventPollDTO, 'id' | 'createdAt' | 'updatedAt'>,
    options: Omit<EventPollOptionDTO, 'id' | 'createdAt' | 'updatedAt' | 'pollId'>[]
  ) => {
    if (!editingPoll?.id) return;

    try {
      setIsLoading(true);
      
      // Update the poll
      const updatedPoll = await updateEventPollServer(editingPoll.id, pollData);
      
      // Get existing options
      const existingOptions = await fetchEventPollOptionsServer({ 
        'pollId.equals': editingPoll.id 
      });
      
      // Delete existing options
      await Promise.all(
        existingOptions.map(option => 
          option.id ? deleteEventPollOptionServer(option.id) : Promise.resolve()
        )
      );
      
      // Create new options
      const createdOptions = await Promise.all(
        options.map(option => 
          createEventPollOptionServer({
            ...option,
            pollId: editingPoll.id,
          })
        )
      );
      
      // Update local state
      setPolls(prev => prev.map(poll => 
        poll.id === editingPoll.id ? updatedPoll : poll
      ));
      setEditingPoll(null);
      
      // Show success message
      alert('Poll updated successfully!');
    } catch (error) {
      console.error('Error updating poll:', error);
      alert('Failed to update poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePoll = async (pollId: number) => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Get and delete poll options first
      const options = await fetchEventPollOptionsServer({ 
        'pollId.equals': pollId 
      });
      
      await Promise.all(
        options.map(option => 
          option.id ? deleteEventPollOptionServer(option.id) : Promise.resolve()
        )
      );
      
      // Delete the poll
      await deleteEventPollServer(pollId);
      
      // Update local state
      setPolls(prev => prev.filter(poll => poll.id !== pollId));
      
      // Show success message
      alert('Poll deleted successfully!');
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert('Failed to delete poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPoll = async (poll: EventPollDTO) => {
    try {
      // Fetch poll options
      const options = await fetchEventPollOptionsServer({ 
        'pollId.equals': poll.id 
      });
      setPollOptions(options);
      setViewingPoll(poll);
    } catch (error) {
      console.error('Error fetching poll options:', error);
      alert('Failed to load poll details.');
    }
  };

  const handleEditPoll = async (poll: EventPollDTO) => {
    try {
      // Fetch poll options
      const options = await fetchEventPollOptionsServer({ 
        'pollId.equals': poll.id 
      });
      setPollOptions(options);
      setEditingPoll(poll);
    } catch (error) {
      console.error('Error fetching poll options:', error);
      alert('Failed to load poll for editing.');
    }
  };

  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Create New Poll</h2>
          <p className="text-gray-600 mt-2">
            Configure your poll settings and options
          </p>
        </div>
        
        <PollCreationForm
          onSubmit={handleCreatePoll}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (editingPoll) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Edit Poll</h2>
          <p className="text-gray-600 mt-2">
            Update poll settings and options
          </p>
        </div>
        
        <PollCreationForm
          onSubmit={handleUpdatePoll}
          onCancel={() => setEditingPoll(null)}
          initialData={editingPoll}
          initialOptions={pollOptions}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (viewingPoll) {
    return (
      <PollDetailsModal
        poll={viewingPoll}
        options={pollOptions}
        onClose={() => setViewingPoll(null)}
      />
    );
  }

  return (
    <PollList
      polls={polls}
      onEdit={handleEditPoll}
      onDelete={handleDeletePoll}
      onView={handleViewPoll}
      onCreate={() => setShowCreateForm(true)}
      isLoading={isLoading}
    />
  );
}

