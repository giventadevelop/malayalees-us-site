'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BarChart3, Users, Clock, MessageSquare } from 'lucide-react';
import type { EventPollDTO, EventPollOptionDTO } from '@/types';
import { fetchEventPollsServer, fetchEventPollOptionsServer } from '@/app/admin/polls/ApiServerActions';

interface PollListProps {
  eventId?: number;
  userId?: number;
  onPollSelect?: (poll: EventPollDTO, options: EventPollOptionDTO[]) => void;
}

export function PollList({ eventId, userId, onPollSelect }: PollListProps) {
  const [polls, setPolls] = useState<EventPollDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoll, setSelectedPoll] = useState<EventPollDTO | null>(null);
  const [pollOptions, setPollOptions] = useState<EventPollOptionDTO[]>([]);

  useEffect(() => {
    const loadPolls = async () => {
      try {
        const filters: Record<string, any> = {
          'isActive.equals': true,
        };
        
        if (eventId) {
          filters['eventId.equals'] = eventId;
        }

        const pollsData = await fetchEventPollsServer(filters);
        setPolls(pollsData);
      } catch (error) {
        console.error('Error loading polls:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPolls();
  }, [eventId]);

  const filteredPolls = polls.filter(poll =>
    poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (poll.description && poll.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePollClick = async (poll: EventPollDTO) => {
    try {
      const options = await fetchEventPollOptionsServer({
        'pollId.equals': poll.id,
        'isActive.equals': true
      });
      
      setSelectedPoll(poll);
      setPollOptions(options);
      onPollSelect?.(poll, options);
    } catch (error) {
      console.error('Error loading poll options:', error);
    }
  };

  const getPollStatus = (poll: EventPollDTO) => {
    const now = new Date();
    const startDate = new Date(poll.startDate);
    const endDate = poll.endDate ? new Date(poll.endDate) : null;

    if (!poll.isActive) {
      return { text: 'Inactive', variant: 'secondary' as const };
    }

    if (now < startDate) {
      return { text: 'Not Started', variant: 'outline' as const };
    }

    if (endDate && now > endDate) {
      return { text: 'Ended', variant: 'destructive' as const };
    }

    return { text: 'Active', variant: 'default' as const };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isPollActive = (poll: EventPollDTO) => {
    const now = new Date();
    const startDate = new Date(poll.startDate);
    const endDate = poll.endDate ? new Date(poll.endDate) : null;

    return poll.isActive && now >= startDate && (!endDate || now <= endDate);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Available Polls</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (selectedPoll) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setSelectedPoll(null)}
          >
            ← Back to Polls
          </Button>
          <h2 className="text-xl font-bold">{selectedPoll.title}</h2>
        </div>
        <PollVotingCard
          poll={selectedPoll}
          options={pollOptions}
          userId={userId}
          onVoteSubmitted={() => {
            // Refresh poll data or show success message
            setSelectedPoll(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Available Polls</h2>
        {polls.length > 0 && (
          <Badge variant="outline">
            {polls.length} poll{polls.length !== 1 ? 's' : ''} available
          </Badge>
        )}
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
              {searchTerm ? 'No polls found matching your search.' : 'No polls available at the moment.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPolls.map((poll) => {
            const status = getPollStatus(poll);
            const active = isPollActive(poll);

            return (
              <Card 
                key={poll.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  active ? 'hover:border-blue-300' : 'opacity-75'
                }`}
                onClick={() => handlePollClick(poll)}
              >
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
                    <Badge variant={status.variant}>{status.text}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Starts: {formatDate(poll.startDate)}
                      </div>
                      {poll.endDate && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Ends: {formatDate(poll.endDate)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Max: {poll.maxResponsesPerUser || 1} per user
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {poll.allowMultipleChoices ? 'Multiple choice' : 'Single choice'}
                      </div>
                      {poll.isAnonymous && (
                        <div className="flex items-center">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Anonymous
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant={active ? "default" : "outline"}
                        size="sm"
                        disabled={!active}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        {active ? 'Vote Now' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Import PollVotingCard component
import { PollVotingCard } from './PollVotingCard';
