'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, RefreshCw, TrendingUp } from 'lucide-react';
import type { EventPollDTO, EventPollOptionDTO, EventPollResponseDTO } from '@/types';
import { fetchEventPollResponsesServer } from '@/app/admin/polls/ApiServerActions';

interface RealTimePollResultsProps {
  poll: EventPollDTO;
  options: EventPollOptionDTO[];
  refreshInterval?: number; // in milliseconds, default 5000 (5 seconds)
  onRefresh?: () => void;
}

interface OptionStats {
  option: EventPollOptionDTO;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  previousCount: number;
}

export function RealTimePollResults({ 
  poll, 
  options, 
  refreshInterval = 5000,
  onRefresh 
}: RealTimePollResultsProps) {
  const [responses, setResponses] = useState<EventPollResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [previousCounts, setPreviousCounts] = useState<Record<number, number>>({});

  const loadResponses = useCallback(async () => {
    try {
      const pollResponses = await fetchEventPollResponsesServer({
        'pollId.equals': poll.id
      });
      
      // Calculate trends
      const newCounts: Record<number, number> = {};
      pollResponses.forEach(response => {
        if (response.pollOptionId) {
          newCounts[response.pollOptionId] = (newCounts[response.pollOptionId] || 0) + 1;
        }
      });

      setPreviousCounts(prev => {
        const trends: Record<number, 'up' | 'down' | 'stable'> = {};
        Object.keys(newCounts).forEach(optionId => {
          const id = parseInt(optionId);
          const current = newCounts[id];
          const previous = prev[id] || 0;
          
          if (current > previous) trends[id] = 'up';
          else if (current < previous) trends[id] = 'down';
          else trends[id] = 'stable';
        });
        
        return newCounts;
      });
      
      setResponses(pollResponses);
      setLastUpdated(new Date());
      onRefresh?.();
    } catch (error) {
      console.error('Error loading poll responses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [poll.id, onRefresh]);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(loadResponses, refreshInterval);
    return () => clearInterval(interval);
  }, [isAutoRefresh, refreshInterval, loadResponses]);

  const getOptionStats = (): OptionStats[] => {
    const optionStats = options.map(option => {
      const optionResponses = responses.filter(response => response.pollOptionId === option.id);
      const count = optionResponses.length;
      const percentage = responses.length > 0 ? (count / responses.length) * 100 : 0;
      const previousCount = previousCounts[option.id!] || 0;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (count > previousCount) trend = 'up';
      else if (count < previousCount) trend = 'down';

      return {
        option,
        count,
        percentage,
        trend,
        previousCount,
      };
    });

    return optionStats.sort((a, b) => b.count - a.count);
  };

  const optionStats = getOptionStats();
  const totalResponses = responses.length;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return <div className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Poll Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Live Poll Results
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={isAutoRefresh ? 'bg-green-50 border-green-200' : ''}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isAutoRefresh ? 'animate-spin' : ''}`} />
              {isAutoRefresh ? 'Auto' : 'Manual'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadResponses}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
        <CardDescription>
          Last updated: {formatTime(lastUpdated)} • {totalResponses} total response{totalResponses !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optionStats.map((stat, index) => (
            <div key={stat.option.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{stat.option.optionText}</span>
                  {getTrendIcon(stat.trend)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {stat.count} vote{stat.count !== 1 ? 's' : ''}
                  </span>
                  <Badge variant="outline">
                    {stat.percentage.toFixed(1)}%
                  </Badge>
                  {stat.trend !== 'stable' && (
                    <span className={`text-xs ${getTrendColor(stat.trend)}`}>
                      {stat.trend === 'up' ? '+' : ''}{stat.count - stat.previousCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {totalResponses === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No votes yet. Be the first to vote!</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              {isAutoRefresh ? 'Auto-refreshing every ' + (refreshInterval / 1000) + 's' : 'Manual refresh only'}
            </span>
            <span>
              Poll {poll.isActive ? 'is active' : 'is inactive'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

