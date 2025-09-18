import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getAppUrl } from '@/lib/env';
import { withTenantId } from '@/lib/withTenantId';
import type { EventSponsorsDTO, EventSponsorsJoinDTO } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseUrl = getAppUrl();

export async function fetchEventSponsorsServer() {
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event sponsors: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchEventSponsorServer(id: number) {
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event sponsor: ${response.statusText}`);
  }

  return await response.json();
}

export async function createEventSponsorServer(sponsor: Omit<EventSponsorsDTO, 'id' | 'createdAt' | 'updatedAt'>) {
  const payload = withTenantId(sponsor);

  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create event sponsor: ${errorText}`);
  }

  return await response.json();
}

export async function updateEventSponsorServer(id: number, sponsor: Partial<EventSponsorsDTO>) {
  const payload = withTenantId({ ...sponsor, id });

  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/merge-patch+json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update event sponsor: ${errorText}`);
  }

  return await response.json();
}

export async function deleteEventSponsorServer(id: number) {
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete event sponsor: ${errorText}`);
  }

  return true;
}

// Event Sponsors Join (Many-to-Many Relationship) functions
export async function fetchEventSponsorsJoinServer(eventId?: number) {
  const params = new URLSearchParams();
  if (eventId) {
    params.append('eventId.equals', eventId.toString());
  }

  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors-join${params.toString() ? `?${params.toString()}` : ''}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event sponsors join: ${response.statusText}`);
  }

  return await response.json();
}

export async function createEventSponsorJoinServer(sponsorJoin: Omit<EventSponsorsJoinDTO, 'id' | 'createdAt' | 'updatedAt'>) {
  const payload = withTenantId(sponsorJoin);

  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors-join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create event sponsor join: ${errorText}`);
  }

  return await response.json();
}

export async function updateEventSponsorJoinServer(id: number, sponsorJoin: Partial<EventSponsorsJoinDTO>) {
  const payload = withTenantId({ ...sponsorJoin, id });

  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors-join/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/merge-patch+json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update event sponsor join: ${errorText}`);
  }

  return await response.json();
}

export async function deleteEventSponsorJoinServer(id: number) {
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors-join/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete event sponsor join: ${errorText}`);
  }

  return true;
}
