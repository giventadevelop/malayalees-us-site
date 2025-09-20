'use client';

import { useState } from 'react';
import { PollVotingCard } from '@/components/polls/PollVotingCard';
import { RealTimePollResults } from '@/components/polls/RealTimePollResults';
import { PollComments } from '@/components/polls/PollComments';
import { PollStatusIndicator } from '@/components/polls/PollStatusIndicator';
import { PollAnalyticsDashboard } from '@/components/polls/PollAnalyticsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BarChart3, MessageSquare, Settings } from 'lucide-react';
import type { EventPollDTO, EventPollOptionDTO } from '@/types';

interface PollDetailsPageProps {
  poll: EventPollDTO;
  options: EventPollOptionDTO[];
  userId?: number;
}

export function PollDetailsPage({ poll, options, userId }: PollDetailsPageProps) {
  const [activeTab, setActiveTab] = useState('vote');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVoteSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCommentAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const isPollActive = () => {
    const now = new Date();
    const startDate = new Date(poll.startDate);
    const endDate = poll.endDate ? new Date(poll.endDate) : null;

    return poll.isActive && now >= startDate && (!endDate || now <= endDate);
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Polls
        </Button>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{poll.title}</h1>
          {poll.description && (
            <p className="text-gray-600 text-lg">{poll.description}</p>
          )}
          <PollStatusIndicator poll={poll} showCountdown showDetails />
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vote" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Vote
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Vote Tab */}
        <TabsContent value="vote" className="space-y-6">
          <PollVotingCard
            poll={poll}
            options={options}
            userId={userId}
            onVoteSubmitted={handleVoteSubmitted}
          />
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <RealTimePollResults
            key={refreshKey}
            poll={poll}
            options={options}
            refreshInterval={5000}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-6">
          <PollComments
            poll={poll}
            userId={userId}
            onCommentAdded={handleCommentAdded}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <PollAnalyticsDashboard
            poll={poll}
            options={options}
          />
        </TabsContent>
      </Tabs>

      {/* Poll Information Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Poll Information</CardTitle>
          <CardDescription>Details about this poll</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Start Date:</span>
              <p className="text-gray-600">
                {new Date(poll.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            
            {poll.endDate && (
              <div>
                <span className="font-medium text-gray-900">End Date:</span>
                <p className="text-gray-600">
                  {new Date(poll.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            <div>
              <span className="font-medium text-gray-900">Max Responses:</span>
              <p className="text-gray-600">{poll.maxResponsesPerUser || 1} per user</p>
            </div>

            <div>
              <span className="font-medium text-gray-900">Multiple Choice:</span>
              <p className="text-gray-600">{poll.allowMultipleChoices ? 'Yes' : 'No'}</p>
            </div>

            <div>
              <span className="font-medium text-gray-900">Anonymous:</span>
              <p className="text-gray-600">{poll.isAnonymous ? 'Yes' : 'No'}</p>
            </div>

            <div>
              <span className="font-medium text-gray-900">Results Visible:</span>
              <p className="text-gray-600">{poll.resultsVisibleTo || 'All'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




