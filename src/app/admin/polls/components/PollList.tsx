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
      return <Badge variant="secondary">Inactive</Badge>;
    }

    if (now < startDate) {
      return <Badge variant="outline">Scheduled</Badge>;
    }

    if (endDate && now > endDate) {
      return <Badge variant="destructive">Ended</Badge>;
    }

    return <Badge variant="default">Active</Badge>;
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Polls</h2>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Poll
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search polls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
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
        <div className="grid gap-4">
          {filteredPolls.map((poll) => (
            <Card key={poll.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{poll.title}</CardTitle>
                    {poll.description && (
                      <CardDescription className="line-clamp-2">
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

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(poll)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(poll)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(poll.id!)}
                    className={deleteConfirm === poll.id ? 'text-red-600 border-red-600' : 'text-red-500 hover:text-red-700'}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
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

