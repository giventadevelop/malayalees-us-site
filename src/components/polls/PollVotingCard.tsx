'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, MessageSquare, BarChart3 } from 'lucide-react';
import type { EventPollDTO, EventPollOptionDTO, EventPollResponseDTO } from '@/types';
import { createEventPollResponseServer, fetchEventPollResponsesServer } from '@/app/admin/polls/ApiServerActions';

interface PollVotingCardProps {
  poll: EventPollDTO;
  options: EventPollOptionDTO[];
  userId?: number;
  onVoteSubmitted?: () => void;
}

export function PollVotingCard({ poll, options, userId, onVoteSubmitted }: PollVotingCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userResponses, setUserResponses] = useState<EventPollResponseDTO[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserResponses = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const responses = await fetchEventPollResponsesServer({
          'pollId.equals': poll.id,
          'userId.equals': userId
        });
        setUserResponses(responses);
        setHasVoted(responses.length > 0);
        
        // If user has voted, show results
        if (responses.length > 0) {
          setShowResults(true);
        }
      } catch (error) {
        console.error('Error loading user responses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserResponses();
  }, [poll.id, userId]);

  const isPollActive = () => {
    const now = new Date();
    const startDate = new Date(poll.startDate);
    const endDate = poll.endDate ? new Date(poll.endDate) : null;

    return poll.isActive && now >= startDate && (!endDate || now <= endDate);
  };

  const canVote = () => {
    return isPollActive() && !hasVoted && userId;
  };

  const handleOptionChange = (optionId: number) => {
    if (!poll.allowMultipleChoices) {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmitVote = async () => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one option');
      return;
    }

    if (!userId) {
      alert('You must be logged in to vote');
      return;
    }

    try {
      setIsSubmitting(true);

      // Submit responses for each selected option
      await Promise.all(
        selectedOptions.map(optionId =>
          createEventPollResponseServer({
            userId,
            pollId: poll.id!,
            pollOptionId: optionId,
            comment: comment.trim() || undefined,
          })
        )
      );

      setHasVoted(true);
      setShowResults(true);
      onVoteSubmitted?.();
      
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPollStatus = () => {
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

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = getPollStatus();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="mt-2">{poll.description}</CardDescription>
            )}
          </div>
          <Badge variant={status.variant}>{status.text}</Badge>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-4">
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
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Max: {poll.maxResponsesPerUser || 1} per user
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {canVote() ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOptions.includes(option.id!)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type={poll.allowMultipleChoices ? 'checkbox' : 'radio'}
                    name="poll-option"
                    checked={selectedOptions.includes(option.id!)}
                    onChange={() => handleOptionChange(option.id!)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="flex-1">{option.optionText}</span>
                  {selectedOptions.includes(option.id!) && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Add a comment (optional)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this poll..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmitVote}
              disabled={isSubmitting || selectedOptions.length === 0}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </div>
        ) : hasVoted ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium">You have already voted!</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowResults(!showResults)}
              className="w-full"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showResults ? 'Hide Results' : 'View Results'}
            </Button>
          </div>
        ) : !userId ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Please log in to vote on this poll.</p>
            <Button variant="outline" onClick={() => window.location.href = '/sign-in'}>
              Sign In
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              {status.text === 'Not Started' 
                ? 'This poll has not started yet.'
                : status.text === 'Ended'
                ? 'This poll has ended.'
                : 'This poll is currently inactive.'
              }
            </p>
            <Button
              variant="outline"
              onClick={() => setShowResults(!showResults)}
              className="w-full"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showResults ? 'Hide Results' : 'View Results'}
            </Button>
          </div>
        )}

        {showResults && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Poll Results
            </h3>
            <PollResultsDisplay poll={poll} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Poll Results Display Component
function PollResultsDisplay({ poll, options }: { poll: EventPollDTO; options: EventPollOptionDTO[] }) {
  const [responses, setResponses] = useState<EventPollResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResponses = async () => {
      try {
        const pollResponses = await fetchEventPollResponsesServer({
          'pollId.equals': poll.id
        });
        setResponses(pollResponses);
      } catch (error) {
        console.error('Error loading poll responses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResponses();
  }, [poll.id]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const getOptionStats = () => {
    const optionStats = options.map(option => {
      const optionResponses = responses.filter(response => response.pollOptionId === option.id);
      return {
        option,
        count: optionResponses.length,
        percentage: responses.length > 0 ? (optionResponses.length / responses.length) * 100 : 0,
      };
    });

    return optionStats.sort((a, b) => b.count - a.count);
  };

  const optionStats = getOptionStats();
  const totalResponses = responses.length;

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-gray-600">
        {totalResponses} total response{totalResponses !== 1 ? 's' : ''}
      </div>
      
      <div className="space-y-3">
        {optionStats.map((stat, index) => (
          <div key={stat.option.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{stat.option.optionText}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {stat.count} vote{stat.count !== 1 ? 's' : ''}
                </span>
                <Badge variant="outline">
                  {stat.percentage.toFixed(1)}%
                </Badge>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

