import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getAppUrl } from '@/lib/env';
import { withTenantId } from '@/lib/withTenantId';
import type { EventSponsorsDTO, EventSponsorsJoinDTO } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseUrl = getAppUrl();

// Event Sponsors (available sponsors)
export async function fetchEventSponsorsServer() {
  const params = new URLSearchParams();
  params.append('tenantId.equals', process.env.NEXT_PUBLIC_TENANT_ID || '');
  // Add default range filter to prevent backend null filter error
  params.append('id.greaterThan', '0');

  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors?${params.toString()}`, {
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
  // Helper function to convert empty strings to null for URL fields
  const cleanUrlField = (value: string | undefined | null): string | null => {
    return (value && value.trim() !== '') ? value : null;
  };
  
  const currentTime = new Date().toISOString();
  const payload = withTenantId({
    ...sponsor,
    createdAt: currentTime,
    updatedAt: currentTime,
    // Convert empty URL fields to null to satisfy database constraints
    websiteUrl: cleanUrlField(sponsor.websiteUrl),
    logoUrl: cleanUrlField(sponsor.logoUrl),
    heroImageUrl: cleanUrlField(sponsor.heroImageUrl),
    bannerImageUrl: cleanUrlField(sponsor.bannerImageUrl),
    facebookUrl: cleanUrlField(sponsor.facebookUrl),
    twitterUrl: cleanUrlField(sponsor.twitterUrl),
    linkedinUrl: cleanUrlField(sponsor.linkedinUrl),
    instagramUrl: cleanUrlField(sponsor.instagramUrl),
  });
  
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
  // Helper function to convert empty strings to null for URL fields
  const cleanUrlField = (value: string | undefined | null): string | null => {
    return (value && value.trim() !== '') ? value : null;
  };

  const payload = withTenantId({
    ...sponsor,
    id,
    // Convert empty URL fields to null to satisfy database constraints
    websiteUrl: sponsor.websiteUrl ? cleanUrlField(sponsor.websiteUrl) : undefined,
    logoUrl: sponsor.logoUrl ? cleanUrlField(sponsor.logoUrl) : undefined,
    heroImageUrl: sponsor.heroImageUrl ? cleanUrlField(sponsor.heroImageUrl) : undefined,
    bannerImageUrl: sponsor.bannerImageUrl ? cleanUrlField(sponsor.bannerImageUrl) : undefined,
    facebookUrl: sponsor.facebookUrl ? cleanUrlField(sponsor.facebookUrl) : undefined,
    twitterUrl: sponsor.twitterUrl ? cleanUrlField(sponsor.twitterUrl) : undefined,
    linkedinUrl: sponsor.linkedinUrl ? cleanUrlField(sponsor.linkedinUrl) : undefined,
    instagramUrl: sponsor.instagramUrl ? cleanUrlField(sponsor.instagramUrl) : undefined,
  });

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

// Event Sponsors Join (sponsor assignments to events)
export async function fetchEventSponsorsJoinServer(eventId: number) {
  const params = new URLSearchParams();
  params.append('eventId.equals', eventId.toString());

  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors-join?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event sponsors join: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchEventSponsorJoinServer(id: number) {
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors-join/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event sponsor join: ${response.statusText}`);
  }

  return await response.json();
}

export async function createEventSponsorJoinServer(sponsorJoin: Omit<EventSponsorsJoinDTO, 'id' | 'createdAt' | 'updatedAt'>) {
  const currentTime = new Date().toISOString();
  const payload = withTenantId({
    ...sponsorJoin,
    createdAt: currentTime,
    updatedAt: currentTime,
  });
  
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
