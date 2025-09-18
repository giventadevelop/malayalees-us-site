import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getAppUrl } from '@/lib/env';
import type { EventPollDTO, EventPollOptionDTO, EventPollResponseDTO } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseUrl = getAppUrl();

// Event Polls API calls
export async function fetchEventPollsServer(filters?: Record<string, any>) {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const qs = params.toString();
    const apiUrl = `${API_BASE_URL}/api/event-polls${qs ? `?${qs}` : ''}`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch polls: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching event polls:', error);
    return [];
  }
}

export async function fetchEventPollServer(pollId: number) {
  try {
    const apiUrl = `${API_BASE_URL}/api/event-polls/${pollId}`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch poll: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching event poll:', error);
    return null;
  }
}

export async function createEventPollServer(pollData: Omit<EventPollDTO, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const apiUrl = `${API_BASE_URL}/api/event-polls`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...pollData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });
    
    if (!res.ok) {
      throw new Error(`Failed to create poll: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating event poll:', error);
    throw error;
  }
}

export async function updateEventPollServer(pollId: number, pollData: Partial<EventPollDTO>) {
  try {
    const apiUrl = `${API_BASE_URL}/api/event-polls/${pollId}`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify({
        ...pollData,
        id: pollId,
        updatedAt: new Date().toISOString(),
      }),
    });
    
    if (!res.ok) {
      throw new Error(`Failed to update poll: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error updating event poll:', error);
    throw error;
  }
}

export async function deleteEventPollServer(pollId: number) {
  try {
    const apiUrl = `${API_BASE_URL}/api/event-polls/${pollId}`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to delete poll: ${res.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting event poll:', error);
    throw error;
  }
}

// Event Poll Options API calls
export async function fetchEventPollOptionsServer(filters?: Record<string, any>) {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const qs = params.toString();
    const apiUrl = `${API_BASE_URL}/api/event-poll-options${qs ? `?${qs}` : ''}`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch poll options: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching event poll options:', error);
    return [];
  }
}

export async function createEventPollOptionServer(optionData: Omit<EventPollOptionDTO, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const apiUrl = `${API_BASE_URL}/api/event-poll-options`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...optionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });
    
    if (!res.ok) {
      throw new Error(`Failed to create poll option: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating event poll option:', error);
    throw error;
  }
}

export async function updateEventPollOptionServer(optionId: number, optionData: Partial<EventPollOptionDTO>) {
  try {
    const apiUrl = `${API_BASE_URL}/api/event-poll-options/${optionId}`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify({
        ...optionData,
        id: optionId,
        updatedAt: new Date().toISOString(),
      }),
    });
    
    if (!res.ok) {
      throw new Error(`Failed to update poll option: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error updating event poll option:', error);
    throw error;
  }
}

export async function deleteEventPollOptionServer(optionId: number) {
  try {
    const apiUrl = `${API_BASE_URL}/api/event-poll-options/${optionId}`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to delete poll option: ${res.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting event poll option:', error);
    throw error;
  }
}

// Event Poll Responses API calls
export async function fetchEventPollResponsesServer(filters?: Record<string, any>) {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const qs = params.toString();
    const apiUrl = `${API_BASE_URL}/api/event-poll-responses${qs ? `?${qs}` : ''}`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch poll responses: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching event poll responses:', error);
    return [];
  }
}

export async function createEventPollResponseServer(responseData: Omit<EventPollResponseDTO, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const apiUrl = `${API_BASE_URL}/api/event-poll-responses`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...responseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });
    
    if (!res.ok) {
      throw new Error(`Failed to create poll response: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating event poll response:', error);
    throw error;
  }
}

export async function deleteEventPollResponseServer(responseId: number) {
  try {
    const apiUrl = `${API_BASE_URL}/api/event-poll-responses/${responseId}`;
    
    const res = await fetchWithJwtRetry(apiUrl, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to delete poll response: ${res.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting event poll response:', error);
    throw error;
  }
}

