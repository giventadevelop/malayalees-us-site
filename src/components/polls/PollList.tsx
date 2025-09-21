'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BarChart3, Users, Clock, MessageSquare, ExternalLink } from 'lucide-react';
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
      console.log('Fetching options for poll:', poll.id, poll.title);
      const options = await fetchEventPollOptionsServer({
        'pollId.equals': poll.id,
        'isActive.equals': true
      });
      
      console.log('Fetched poll options:', options);
      setSelectedPoll(poll);
      setPollOptions(options);
      onPollSelect?.(poll, options);
    } catch (error) {
      console.error('Error loading poll options:', error);
      // Still show the poll even if options fail to load
      setSelectedPoll(poll);
      setPollOptions([]);
      onPollSelect?.(poll, []);
    }
  };

  const getPollStatus = (poll: EventPollDTO) => {
    const now = new Date();
    const startDate = new Date(poll.startDate);
    const endDate = poll.endDate ? new Date(poll.endDate) : null;

    if (!poll.isActive) {
      return { 
        text: 'Inactive', 
        variant: 'secondary' as const,
        className: 'bg-gray-100 text-gray-600 border-gray-200'
      };
    }

    if (now < startDate) {
      return { 
        text: 'Not Started', 
        variant: 'outline' as const,
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
      };
    }

    if (endDate && now > endDate) {
      return { 
        text: 'Ended', 
        variant: 'destructive' as const,
        className: 'bg-red-50 text-red-700 border-red-200'
      };
    }

    return { 
      text: 'Active', 
      variant: 'default' as const,
      className: 'bg-green-50 text-green-700 border-green-200'
    };
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
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setSelectedPoll(null)}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            ← Back to Polls
          </Button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {selectedPoll.title}
          </h2>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Available Polls
        </h2>
        {polls.length > 0 && (
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2">
            {polls.length} poll{polls.length !== 1 ? 's' : ''} available
          </Badge>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
        <Input
          placeholder="Search polls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
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
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                  active 
                    ? 'hover:border-blue-400 bg-gradient-to-br from-white to-blue-50 hover:shadow-blue-100' 
                    : 'opacity-75 bg-gray-50'
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
                    <Badge className={status.className}>{status.text}</Badge>
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

                    <div className="flex justify-end space-x-2">
                      <Button
                        className={`${
                          active 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300' 
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                        size="sm"
                        disabled={!active}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePollClick(poll);
                        }}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        {active ? 'Vote Now' : 'View Details'}
                      </Button>
                      
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/polls/${poll.id}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Full Page
                        </Link>
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
