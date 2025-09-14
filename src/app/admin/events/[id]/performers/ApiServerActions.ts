import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getAppUrl } from '@/lib/env';
import { withTenantId } from '@/lib/withTenantId';
import type { EventFeaturedPerformersDTO } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseUrl = getAppUrl();

// TODO: Replace with real API calls when backend endpoints are implemented
// Currently returning mock data since /api/event-featured-performers doesn't exist in backend

export async function fetchEventFeaturedPerformersServer(eventId: number) {
  // Mock data for development - remove when backend is implemented
  const mockPerformers: EventFeaturedPerformersDTO[] = [
    {
      id: 1,
      name: "John Doe",
      stageName: "Johnny Rock",
      role: "Lead Singer",
      bio: "Experienced performer with 10+ years in the industry",
      performanceDescription: "Acoustic guitar performance with original songs",
      socialMediaLinks: "https://instagram.com/johnnyrock, https://twitter.com/johnnyrock",
      website: "https://johnnyrock.com",
      contactEmail: "john@johnnyrock.com",
      contactPhone: "+1-555-0123",
      performanceOrder: 1,
      isHeadliner: true,
      performanceDuration: 45,
      specialRequirements: "Need acoustic guitar and microphone",
      event: { id: eventId } as any,
      tenantId: process.env.NEXT_PUBLIC_TENANT_ID || 'demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Jane Smith",
      stageName: "Jane Jazzy",
      role: "Jazz Vocalist",
      bio: "Award-winning jazz vocalist",
      performanceDescription: "Jazz standards and original compositions",
      socialMediaLinks: "https://instagram.com/janejazzy",
      website: "https://janejazzy.com",
      contactEmail: "jane@janejazzy.com",
      contactPhone: "+1-555-0456",
      performanceOrder: 2,
      isHeadliner: false,
      performanceDuration: 30,
      specialRequirements: "Piano accompaniment",
      event: { id: eventId } as any,
      tenantId: process.env.NEXT_PUBLIC_TENANT_ID || 'demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
  
  return mockPerformers;
  
  /* 
  // Real API call - uncomment when backend is implemented
  const params = new URLSearchParams();
  params.append('eventId.equals', eventId.toString());
  
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-featured-performers?${params.toString()}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch event featured performers: ${response.statusText}`);
  }
  
  return await response.json();
  */
}

export async function fetchEventFeaturedPerformerServer(id: number) {
  // Mock implementation - remove when backend is implemented
  const mockPerformers = await fetchEventFeaturedPerformersServer(1); // Get mock data
  const performer = mockPerformers.find(p => p.id === id);
  if (!performer) {
    throw new Error(`Event featured performer with id ${id} not found`);
  }
  return performer;
  
  /* 
  // Real API call - uncomment when backend is implemented
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-featured-performers/${id}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch event featured performer: ${response.statusText}`);
  }
  
  return await response.json();
  */
}

export async function createEventFeaturedPerformerServer(performer: Omit<EventFeaturedPerformersDTO, 'id' | 'createdAt' | 'updatedAt'>) {
  // Mock implementation - remove when backend is implemented
  const newPerformer: EventFeaturedPerformersDTO = {
    ...performer,
    id: Math.floor(Math.random() * 1000) + 100, // Generate random ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as EventFeaturedPerformersDTO;
  
  console.log('Mock: Created event featured performer:', newPerformer);
  return newPerformer;
  
  /* 
  // Real API call - uncomment when backend is implemented
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
  */
}

export async function updateEventFeaturedPerformerServer(id: number, performer: Partial<EventFeaturedPerformersDTO>) {
  // Mock implementation - remove when backend is implemented
  const updatedPerformer: EventFeaturedPerformersDTO = {
    ...performer,
    id,
    updatedAt: new Date().toISOString(),
  } as EventFeaturedPerformersDTO;
  
  console.log('Mock: Updated event featured performer:', updatedPerformer);
  return updatedPerformer;
  
  /* 
  // Real API call - uncomment when backend is implemented
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
  */
}

export async function deleteEventFeaturedPerformerServer(id: number) {
  // Mock implementation - remove when backend is implemented
  console.log('Mock: Deleted event featured performer with id:', id);
  return true;
  
  /* 
  // Real API call - uncomment when backend is implemented
  const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-featured-performers/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete event featured performer: ${errorText}`);
  }
  
  return true;
  */
}
