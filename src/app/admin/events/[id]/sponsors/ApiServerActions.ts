import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getAppUrl } from '@/lib/env';
import { withTenantId } from '@/lib/withTenantId';
import type { EventSponsorsDTO, EventSponsorsJoinDTO } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseUrl = getAppUrl();

// Event Sponsors (available sponsors)
export async function fetchEventSponsorsServer() {
  try {
    console.log('🔍 Fetching available sponsors...');
    // Try to fetch all available sponsors without complex filters first
    const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn('❌ Failed to fetch event sponsors:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('✅ Fetched available sponsors:', data);
    return data;
  } catch (error) {
    console.warn('❌ Error fetching event sponsors:', error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
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
  console.log('🔍 Fetching event sponsors for event ID:', eventId);
  console.log('🔍 API Base URL:', API_BASE_URL);
  console.log('🔍 Full URL:', `${API_BASE_URL}/api/event-sponsors-join/event/${eventId}`);

  // Use the specific endpoint for getting sponsors by event ID
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors-join/event/${eventId}`, {
    cache: 'no-store',
  });

  console.log('🔍 Response status:', response.status);
  console.log('🔍 Response ok:', response.ok);

  if (!response.ok) {
    console.error('❌ Failed to fetch event sponsors join with specific endpoint:', response.status, response.statusText);
    const errorText = await response.text();
    console.error('❌ Error response body:', errorText);

    // Try fallback with generic endpoint and query parameters
    console.log('🔄 Trying fallback with generic endpoint...');
    const params = new URLSearchParams();
    params.append('eventId.equals', eventId.toString());

    const fallbackResponse = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-sponsors-join?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!fallbackResponse.ok) {
      console.error('❌ Fallback also failed:', fallbackResponse.status, fallbackResponse.statusText);
      throw new Error(`Failed to fetch event sponsors join: ${response.statusText}`);
    }

    const fallbackData = await fallbackResponse.json();
    console.log('✅ Fallback data received:', fallbackData);

    // Handle fallback data structure
    if (!Array.isArray(fallbackData)) {
      if (fallbackData && Array.isArray(fallbackData.content)) {
        return fallbackData.content;
      } else if (fallbackData && Array.isArray(fallbackData.data)) {
        return fallbackData.data;
      } else if (fallbackData && Array.isArray(fallbackData.results)) {
        return fallbackData.results;
      }
    }

    return fallbackData;
  }

  const data = await response.json();
  console.log('✅ Fetched event sponsors:', data);
  console.log('✅ Data is array:', Array.isArray(data));
  console.log('✅ Data length:', Array.isArray(data) ? data.length : 'Not an array');

  // If data is not an array, try to extract the array from it
  if (!Array.isArray(data)) {
    console.log('⚠️ Data is not an array, checking for embedded array...');
    if (data && Array.isArray(data.content)) {
      console.log('✅ Found content array with length:', data.content.length);
      return data.content;
    } else if (data && Array.isArray(data.data)) {
      console.log('✅ Found data array with length:', data.data.length);
      return data.data;
    } else if (data && Array.isArray(data.results)) {
      console.log('✅ Found results array with length:', data.results.length);
      return data.results;
    }
  }

  return data;
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
