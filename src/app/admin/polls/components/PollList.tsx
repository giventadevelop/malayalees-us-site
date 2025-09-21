'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Eye, Plus, Search } from 'lucide-react';
import type { EventPollDTO } from '@/types';

interface PollListProps {
  polls: EventPollDTO[];
  onEdit: (poll: EventPollDTO) => void;
  onDelete: (pollId: number) => void;
  onView: (poll: EventPollDTO) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

export function PollList({ 
  polls, 
  onEdit, 
  onDelete, 
  onView, 
  onCreate, 
  isLoading = false 
}: PollListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filteredPolls = polls.filter(poll =>
    poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (poll.description && poll.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (poll: EventPollDTO) => {
    const now = new Date();
    const startDate = new Date(poll.startDate);
    const endDate = poll.endDate ? new Date(poll.endDate) : null;

    if (!poll.isActive) {
      return <Badge className="bg-gray-100 text-gray-600 border-gray-200">Inactive</Badge>;
    }

    if (now < startDate) {
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Scheduled</Badge>;
    }

    if (endDate && now > endDate) {
      return <Badge className="bg-red-50 text-red-700 border-red-200">Ended</Badge>;
    }

    return <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (pollId: number) => {
    if (deleteConfirm === pollId) {
      onDelete(pollId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(pollId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Polls</h2>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
          Poll Management
        </h2>
        <Button 
          onClick={onCreate}
          className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Poll
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 h-5 w-5" />
        <Input
          placeholder="Search polls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 transition-all"
        />
      </div>

      {filteredPolls.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              {searchTerm ? 'No polls found matching your search.' : 'No polls created yet.'}
            </p>
            {!searchTerm && (
              <Button onClick={onCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Poll
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredPolls.map((poll) => (
            <Card key={poll.id} className="border-2 border-gray-100 hover:border-indigo-200 bg-gradient-to-br from-white to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-b border-indigo-100">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-gray-800">{poll.title}</CardTitle>
                    {poll.description && (
                      <CardDescription className="text-gray-600 text-base">
                        {poll.description}
                      </CardDescription>
                    )}
                  </div>
                  {getStatusBadge(poll)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span>{formatDate(poll.startDate)}</span>
                  </div>
                  {poll.endDate && (
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span>{formatDate(poll.endDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Max Responses:</span>
                    <span>{poll.maxResponsesPerUser || 1} per user</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multiple Choices:</span>
                    <span>{poll.allowMultipleChoices ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Anonymous:</span>
                    <span>{poll.isAnonymous ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    onClick={() => onView(poll)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    onClick={() => onEdit(poll)}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(poll.id!)}
                    className={`font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                      deleteConfirm === poll.id 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                    }`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteConfirm === poll.id ? 'Confirm Delete' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

