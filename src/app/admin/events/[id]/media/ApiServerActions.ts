"use server";
import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getTenantId } from '@/lib/env';
import type { EventMediaDTO } from '@/types';
import { withTenantId } from '@/lib/withTenantId';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchUserProfileServer(userId: string) {
  if (!userId) return null;
  const tenantId = getTenantId();
  const res = await fetchWithJwtRetry(`${API_BASE_URL}/api/user-profiles/by-user/${userId}?tenantId.equals=${tenantId}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function fetchMediaServer(eventId: string) {
  const url = `${API_BASE_URL}/api/event-medias?eventId.equals=${eventId}&isEventManagementOfficialDocument.equals=false&sort=updatedAt,desc&tenantId.equals=${getTenantId()}`;
  const res = await fetchWithJwtRetry(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}

export async function fetchMediaFilteredServer(
  eventId: string,
  page: number = 0,
  size: number = 10,
  searchTerm: string = '',
  eventFlyerOnly: boolean = false
) {
  const params = new URLSearchParams({
    'eventId.equals': eventId,
    'isEventManagementOfficialDocument.equals': 'false',
    sort: 'updatedAt,desc',
    'tenantId.equals': getTenantId(),
    page: page.toString(),
    size: size.toString(),
  });

  if (searchTerm) {
    params.append('title.contains', searchTerm);
  }

  if (eventFlyerOnly) {
    params.append('eventFlyer.equals', 'true');
  }

  const url = `${API_BASE_URL}/api/event-medias?${params.toString()}`;

  const response = await fetchWithJwtRetry(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    console.error(`Failed to fetch media for event ${eventId}: ${response.statusText}`);
    return { data: [], totalCount: 0 };
  }

  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
  const data = await response.json();

  return {
    data: Array.isArray(data) ? data : [],
    totalCount,
  };
}

export async function fetchOfficialDocsServer(eventId: string) {
  const url = `${API_BASE_URL}/api/event-medias?eventId.equals=${eventId}&isEventManagementOfficialDocument.equals=true&sort=updatedAt,desc&tenantId.equals=${getTenantId()}`;
  const res = await fetchWithJwtRetry(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}

export interface MediaUploadParams {
  title: string; // Required parameter
  description: string;
  eventMediaType?: string; // Optional in new schema
  storageType?: string; // Optional in new schema
  fileUrl?: string; // Optional in new schema
  isFeaturedImage: boolean;
  eventFlyer: boolean;
  isEventManagementOfficialDocument: boolean;
  isHeroImage: boolean;
  isActiveHeroImage: boolean;
  isPublic: boolean;
  altText?: string; // Optional in new schema
  displayOrder?: number; // Optional in new schema
  userProfileId?: number | null; // Optional in new schema
  files: File[];
  isTeamMemberProfileImage?: boolean; // Add optional parameter for team member profile images
}

export async function uploadMedia(eventId: number, {
  title,
  description,
  eventMediaType,
  storageType,
  fileUrl,
  isFeaturedImage,
  eventFlyer,
  isEventManagementOfficialDocument,
  isHeroImage,
  isActiveHeroImage,
  isPublic,
  altText,
  displayOrder,
  userProfileId,
  files,
  isTeamMemberProfileImage = false // Default to false for regular event media
}: MediaUploadParams) {
  const formData = new FormData();
  // For now, handle single file upload per new API schema
  if (files.length > 0) {
    formData.append('file', files[0]); // Changed from 'files' to 'file' per new API schema
  }

  const params = new URLSearchParams();
  params.append('eventId', String(eventId));
  params.append('eventFlyer', String(eventFlyer));
  params.append('isEventManagementOfficialDocument', String(isEventManagementOfficialDocument));
  params.append('isHeroImage', String(isHeroImage));
  params.append('isActiveHeroImage', String(isActiveHeroImage));
  params.append('isFeaturedImage', String(isFeaturedImage));
  params.append('isPublic', String(isPublic));
  params.append('isTeamMemberProfileImage', String(isTeamMemberProfileImage)); // Always include this parameter
  params.append('title', title); // Required parameter
  params.append('description', description);
  params.append('tenantId', getTenantId()); // Required parameter

  const url = `${API_BASE_URL}/api/proxy/event-medias/upload?${params.toString()}`;
  const res = await fetchWithJwtRetry(url, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return await res.json();
}

export async function deleteMediaServer(mediaId: number | string) {
  const url = `${API_BASE_URL}/api/event-medias/${mediaId}?tenantId.equals=${getTenantId()}`;
  const res = await fetchWithJwtRetry(url, {
    method: 'DELETE',
    });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return true;
}

export async function editMediaServer(mediaId: number | string, payload: Partial<EventMediaDTO>) {
  try {
    console.log('Starting direct-to-backend editMediaServer with payload:', payload);

    const url = `${API_BASE_URL}/api/event-medias/${mediaId}`;

    // Clean and prepare the payload according to rules
    const cleanedPayload = withTenantId({
      ...payload,
      id: Number(mediaId),
      updatedAt: new Date().toISOString(),
    });

    console.log(`Sending PATCH request directly to backend: ${url}`);

    const response = await fetchWithJwtRetry(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Direct backend media update failed:', errorText);
      throw new Error(errorText || 'Failed to update media');
    }

    const result = await response.json();
    console.log('Media update successful:', result);
    return result;
  } catch (error) {
    console.error('Error in editMediaServer:', error);
    throw error;
  }
}

export async function uploadMediaServer(params: {
  eventId: string;
  files: File[];
  title: string;
  description: string;
  eventFlyer: boolean;
  isEventManagementOfficialDocument: boolean;
  isHeroImage: boolean;
  isActiveHeroImage: boolean;
  isFeaturedImage: boolean;
  isPublic: boolean;
  altText: string;
  displayOrder?: number;
  userProfileId?: number | null;
  isTeamMemberProfileImage?: boolean; // Add optional parameter for team member profile images
}) {
  const { eventId, files, ...rest } = params;

  // Assuming a single file upload for simplicity of infering type,
  // the backend seems to handle multiple files.
  // A more robust solution might be needed if multiple file types are uploaded at once.
  const eventMediaType = files.length > 0 ? inferEventMediaType(files[0]) : 'other';

  const uploadParams: MediaUploadParams = {
    ...rest,
    files,
    eventMediaType: eventMediaType || 'gallery', // Default to gallery if not specified
    storageType: 's3', // Default storage type
    fileUrl: '', // This seems to be handled by the backend
    isTeamMemberProfileImage: params.isTeamMemberProfileImage || false, // Pass through the parameter
  };

  return await uploadMedia(Number(eventId), uploadParams);
}

function inferEventMediaType(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext) return 'other';
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "gallery";
  if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext)) return "video";
  if (["pdf"].includes(ext)) return "document";
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "document";
  if (["svg"].includes(ext)) return "image";
  return "other";
}

export async function fetchEventDetailsByIdServer(eventId: number) {
  if (!eventId) return null;
  const tenantId = getTenantId();
  const res = await fetchWithJwtRetry(`${API_BASE_URL}/api/event-details/${eventId}?tenantId.equals=${tenantId}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error(`Failed to fetch event details for event ${eventId}: ${res.statusText}`);
    return null;
  }
  return await res.json();
}

// Add upload and delete actions as needed