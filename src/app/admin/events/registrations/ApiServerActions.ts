import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getAppUrl } from '@/lib/env';
import type { EventAttendeeDTO, EventAttendeeGuestDTO, EventDetailsDTO } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface RegistrationManagementData {
  attendees: EventAttendeeDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  events: EventDetailsDTO[];
  selectedEvent: EventDetailsDTO | null;
  searchTerm: string;
  searchType: string;
  statusFilter: string;
}

/**
 * Fetch registration management data with filtering and pagination
 */
export async function fetchRegistrationManagementData(
  eventId: number | null,
  search: string,
  searchType: string,
  status: string,
  page: number
): Promise<RegistrationManagementData | null> {
  try {
    const baseUrl = getAppUrl();
    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    // Build query parameters
    const params = new URLSearchParams();
    params.append('size', pageSize.toString());
    params.append('page', (offset / pageSize).toString());
    params.append('sort', 'registrationDate,desc');

    if (eventId) {
      params.append('eventId.equals', eventId.toString());
    }

    if (search) {
      if (searchType === 'name') {
        params.append('firstName.contains', search);
        params.append('lastName.contains', search);
      } else if (searchType === 'email') {
        params.append('email.contains', search);
      } else if (searchType === 'eventId') {
        params.append('eventId.equals', search);
      }
    }

    if (status) {
      params.append('registrationStatus.equals', status);
    }

    // Fetch attendees
    const attendeesResponse = await fetch(`${baseUrl}/api/proxy/event-attendees?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!attendeesResponse.ok) {
      throw new Error(`Failed to fetch attendees: ${attendeesResponse.status}`);
    }

    const attendees = await attendeesResponse.json();
    const attendeesArray = Array.isArray(attendees) ? attendees : [];

    // Get total count for pagination
    const countParams = new URLSearchParams(params);
    countParams.delete('size');
    countParams.delete('page');
    countParams.append('size', '1');

    const countResponse = await fetch(`${baseUrl}/api/proxy/event-attendees?${countParams.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    let totalCount = 0;
    if (countResponse.ok) {
      const countData = await countResponse.json();
      totalCount = countData.totalElements || attendeesArray.length;
    }

    // Fetch events for filter dropdown
    const eventsResponse = await fetch(`${baseUrl}/api/proxy/event-details?sort=startDate,desc&size=100`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    let events: EventDetailsDTO[] = [];
    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json();
      events = Array.isArray(eventsData) ? eventsData : [];
    }

    // Fetch selected event details if eventId is provided
    let selectedEvent: EventDetailsDTO | null = null;
    if (eventId) {
      const eventResponse = await fetch(`${baseUrl}/api/proxy/event-details/${eventId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (eventResponse.ok) {
        selectedEvent = await eventResponse.json();
      }
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      attendees: attendeesArray,
      totalCount,
      currentPage: page,
      totalPages,
      events,
      selectedEvent,
      searchTerm: search,
      searchType: searchType,
      statusFilter: status,
    };
  } catch (error) {
    console.error('Error fetching registration management data:', error);
    return null;
  }
}

/**
 * Export registrations to CSV
 */
export async function exportRegistrationsToCSV(
  eventId: number | null,
  search: string,
  searchType: string,
  status: string
): Promise<string | null> {
  try {
    const baseUrl = getAppUrl();

    // Build query parameters for export
    const params = new URLSearchParams();
    params.append('size', '10000'); // Large number to get all records
    params.append('sort', 'registrationDate,desc');

    if (eventId) {
      params.append('eventId.equals', eventId.toString());
    }

    if (search) {
      if (searchType === 'name') {
        params.append('firstName.contains', search);
        params.append('lastName.contains', search);
      } else if (searchType === 'email') {
        params.append('email.contains', search);
      } else if (searchType === 'eventId') {
        params.append('eventId.equals', search);
      }
    }

    if (status) {
      params.append('registrationStatus.equals', status);
    }

    // Fetch all attendees for export
    const attendeesResponse = await fetch(`${baseUrl}/api/proxy/event-attendees?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!attendeesResponse.ok) {
      throw new Error(`Failed to fetch attendees for export: ${attendeesResponse.status}`);
    }

    const attendees = await attendeesResponse.json();
    const attendeesArray = Array.isArray(attendees) ? attendees : [];

    // Generate CSV content
    const csvHeaders = [
      'Registration ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Event ID',
      'Event Title',
      'Registration Date',
      'Status',
      'Total Guests',
      'Special Requirements',
      'Dietary Restrictions',
      'Accessibility Needs',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Emergency Contact Relationship'
    ];

    const csvRows = attendeesArray.map(attendee => [
      attendee.id || '',
      attendee.firstName || '',
      attendee.lastName || '',
      attendee.email || '',
      attendee.phone || '',
      attendee.eventId || '',
      '', // Event title would need to be fetched separately
      attendee.registrationDate ? new Date(attendee.registrationDate).toLocaleDateString() : '',
      attendee.registrationStatus || '',
      attendee.totalNumberOfGuests || 0,
      attendee.specialRequirements || '',
      attendee.dietaryRestrictions || '',
      attendee.accessibilityNeeds || '',
      attendee.emergencyContactName || '',
      attendee.emergencyContactPhone || '',
      attendee.emergencyContactRelationship || ''
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return csvContent;
  } catch (error) {
    console.error('Error exporting registrations to CSV:', error);
    return null;
  }
}

/**
 * Update attendee registration status
 */
export async function updateAttendeeStatus(
  attendeeId: number,
  status: string
): Promise<boolean> {
  try {
    const { fetchWithJwtRetry } = await import('@/lib/proxyHandler');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not configured');
      return false;
    }

    // Include the id field in the payload as required by backend for PATCH operations
    const payload = {
      id: attendeeId,
      registrationStatus: status
    };

    const response = await fetchWithJwtRetry(
      `${API_BASE_URL}/api/event-attendees/${attendeeId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify(payload),
      },
      'updateAttendeeStatus'
    );

    return response.ok;
  } catch (error) {
    console.error('Error updating attendee status:', error);
    return false;
  }
}

/**
 * Update attendee registration details
 */
export async function updateAttendeeRegistration(
  attendeeId: number,
  updateData: any
): Promise<boolean> {
  try {
    const { fetchWithJwtRetry } = await import('@/lib/proxyHandler');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not configured');
      return false;
    }

    // Include the id field in the payload as required by backend for PATCH operations
    const payload = {
      ...updateData,
      id: attendeeId
    };

    const response = await fetchWithJwtRetry(
      `${API_BASE_URL}/api/event-attendees/${attendeeId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify(payload),
      },
      'updateAttendeeRegistration'
    );

    return response.ok;
  } catch (error) {
    console.error('Error updating attendee registration:', error);
    return false;
  }
}

/**
 * Delete attendee registration
 */
export async function deleteAttendeeRegistration(attendeeId: number): Promise<boolean> {
  try {
    const { fetchWithJwtRetry } = await import('@/lib/proxyHandler');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not configured');
      return false;
    }

    const response = await fetchWithJwtRetry(
      `${API_BASE_URL}/api/event-attendees/${attendeeId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
      'deleteAttendeeRegistration'
    );

    return response.ok;
  } catch (error) {
    console.error('Error deleting attendee registration:', error);
    return false;
  }
}
