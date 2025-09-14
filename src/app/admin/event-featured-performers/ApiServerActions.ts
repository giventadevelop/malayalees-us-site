import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getAppUrl } from '@/lib/env';
import { withTenantId } from '@/lib/withTenantId';
import type { EventFeaturedPerformersDTO } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseUrl = getAppUrl();

export async function fetchEventFeaturedPerformersServer(eventId?: number) {
  const params = new URLSearchParams();
  if (eventId) {
    params.append('eventId.equals', eventId.toString());
  }
  
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-featured-performers${params.toString() ? `?${params.toString()}` : ''}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch event featured performers: ${response.statusText}`);
  }
  
  return await response.json();
}

export async function fetchEventFeaturedPerformerServer(id: number) {
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-featured-performers/${id}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch event featured performer: ${response.statusText}`);
  }
  
  return await response.json();
}

export async function createEventFeaturedPerformerServer(performer: Omit<EventFeaturedPerformersDTO, 'id' | 'createdAt' | 'updatedAt'>) {
  const payload = withTenantId(performer);
  
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-featured-performers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create event featured performer: ${errorText}`);
  }
  
  return await response.json();
}

export async function updateEventFeaturedPerformerServer(id: number, performer: Partial<EventFeaturedPerformersDTO>) {
  const payload = withTenantId({ ...performer, id });
  
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-featured-performers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/merge-patch+json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update event featured performer: ${errorText}`);
  }
  
  return await response.json();
}

export async function deleteEventFeaturedPerformerServer(id: number) {
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-featured-performers/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete event featured performer: ${errorText}`);
  }
  
  return true;
}
