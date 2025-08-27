import { getAppUrl, getTenantId } from '@/lib/env';
import type { ExecutiveCommitteeTeamMemberDTO } from '@/types/executiveCommitteeTeamMember';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchExecutiveCommitteeMembers(): Promise<ExecutiveCommitteeTeamMemberDTO[]> {
  try {
    const baseUrl = getAppUrl();
    const response = await fetch(`${baseUrl}/api/proxy/executive-committee-team-members`);

    if (!response.ok) {
      throw new Error(`Failed to fetch executive committee members: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching executive committee members:', error);
    return [];
  }
}

export async function createExecutiveCommitteeMember(
  memberData: Omit<ExecutiveCommitteeTeamMemberDTO, 'id'>
): Promise<ExecutiveCommitteeTeamMemberDTO | null> {
  try {
    const baseUrl = getAppUrl();
    const response = await fetch(`${baseUrl}/api/proxy/executive-committee-team-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create executive committee member: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating executive committee member:', error);
    return null;
  }
}

export async function updateExecutiveCommitteeMember(
  id: number,
  memberData: Partial<ExecutiveCommitteeTeamMemberDTO>
): Promise<ExecutiveCommitteeTeamMemberDTO | null> {
  try {
    const baseUrl = getAppUrl();
    const response = await fetch(`${baseUrl}/api/proxy/executive-committee-team-members/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify({ ...memberData, id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update executive committee member: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating executive committee member:', error);
    return null;
  }
}

export async function deleteExecutiveCommitteeMember(id: number): Promise<boolean> {
  try {
    const baseUrl = getAppUrl();
    const response = await fetch(`${baseUrl}/api/proxy/executive-committee-team-members/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete executive committee member: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting executive committee member:', error);
    return false;
  }
}

export async function updateProfileImage(
  memberId: number,
  imageUrl: string
): Promise<ExecutiveCommitteeTeamMemberDTO | null> {
  try {
    const baseUrl = getAppUrl();
    const response = await fetch(`${baseUrl}/api/proxy/executive-committee-team-members/${memberId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify({
        id: memberId,
        profileImageUrl: imageUrl
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile image: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating profile image:', error);
    return null;
  }
}

export async function uploadTeamMemberProfileImage(
  memberId: number,
  file: File,
  userProfileId?: number
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file); // Changed from 'files' to 'file' per new API schema

    const params = new URLSearchParams();
    params.append('eventId', '0'); // Use 0 for team member profile images (not event-specific)
    params.append('executiveTeamMemberID', String(memberId)); // Add the team member ID as required by backend
    params.append('eventFlyer', 'false');
    params.append('isEventManagementOfficialDocument', 'false');
    params.append('isHeroImage', 'false');
    params.append('isActiveHeroImage', 'false');
    params.append('isFeaturedImage', 'false');
    params.append('isPublic', 'true');
    params.append('isTeamMemberProfileImage', 'true'); // Set to true for team member profile images
    params.append('title', `Team Member Profile Image - ${memberId}`); // Required parameter
    params.append('description', 'Profile image uploaded for executive committee team member');
    params.append('tenantId', getTenantId()); // Required parameter

    const baseUrl = getAppUrl();
    const url = `${baseUrl}/api/proxy/event-medias/upload?${params.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const result = await response.json();

    // Extract the image URL from the response
    // The response structure may vary, so we need to handle different possible formats
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      return result.data[0].fileUrl || result.data[0].url;
    } else if (result.fileUrl) {
      return result.fileUrl;
    } else if (result.url) {
      return result.url;
    } else {
      throw new Error('No image URL found in upload response');
    }
  } catch (error) {
    console.error('Error uploading team member profile image:', error);
    return null;
  }
}

