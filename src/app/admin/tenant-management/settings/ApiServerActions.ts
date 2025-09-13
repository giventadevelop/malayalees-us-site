import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { withTenantId } from '@/lib/withTenantId';
import type {
  TenantSettingsDTO,
  TenantSettingsFormDTO,
  TenantSettingsFilters,
  PaginationParams,
  PaginatedResponse
} from '@/app/admin/tenant-management/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetch paginated list of tenant settings
 */
export async function fetchTenantSettings(
  pagination: PaginationParams,
  filters: TenantSettingsFilters = {}
): Promise<PaginatedResponse<TenantSettingsDTO>> {
  try {
    const params = new URLSearchParams();

    // Add pagination parameters
    params.append('page', pagination.page.toString());
    params.append('size', pagination.pageSize.toString());

    // Add filters
    if (filters.search) {
      params.append('tenantId.contains', filters.search);
    }
    if (filters.tenantId) {
      params.append('tenantId.equals', filters.tenantId);
    }

    // Add sorting
    if (filters.sortBy) {
      const sortDirection = filters.sortOrder || 'asc';
      params.append('sort', `${filters.sortBy},${sortDirection}`);
    }

    const response = await fetchWithJwtRetry(
      `${API_BASE_URL}/api/tenant-settings?${params.toString()}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant settings: ${response.statusText}`);
    }

    const data = await response.json();
    const totalCount = parseInt(response.headers.get('x-total-count') || '0');

    return {
      data: Array.isArray(data) ? data : [],
      totalCount,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(totalCount / pagination.pageSize)
    };
  } catch (error) {
    console.error('Error fetching tenant settings:', error);
    throw new Error('Failed to fetch tenant settings');
  }
}

/**
 * Fetch a single tenant setting by ID
 */
export async function fetchTenantSetting(id: number): Promise<TenantSettingsDTO | null> {
  try {
    const response = await fetchWithJwtRetry(
      `${API_BASE_URL}/api/tenant-settings/${id}`,
      { cache: 'no-store' }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant setting: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tenant setting:', error);
    throw new Error('Failed to fetch tenant setting');
  }
}

/**
 * Fetch tenant settings by tenant ID
 */
export async function fetchTenantSettingsByTenantId(tenantId: string): Promise<TenantSettingsDTO | null> {
  try {
    const params = new URLSearchParams();
    params.append('tenantId.equals', tenantId);

    const response = await fetchWithJwtRetry(
      `${API_BASE_URL}/api/tenant-settings?${params.toString()}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant settings by tenant ID: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching tenant settings by tenant ID:', error);
    throw new Error('Failed to fetch tenant settings by tenant ID');
  }
}

/**
 * Create a new tenant setting
 */
export async function createTenantSetting(data: TenantSettingsFormDTO): Promise<TenantSettingsDTO> {
  try {
    const payload = withTenantId({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/tenant-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create tenant setting: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating tenant setting:', error);
    throw new Error('Failed to create tenant setting');
  }
}

/**
 * Update an existing tenant setting
 */
export async function updateTenantSetting(
  id: number,
  data: Partial<TenantSettingsFormDTO>
): Promise<TenantSettingsDTO> {
  try {
    // First fetch the existing tenant setting to get the original createdAt
    const existingSetting = await fetchTenantSetting(id);

    const payload = withTenantId({
      ...data,
      id,
      createdAt: existingSetting.createdAt, // Preserve original createdAt
      updatedAt: new Date().toISOString(),
    });

    const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/tenant-settings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update tenant setting: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating tenant setting:', error);
    throw new Error('Failed to update tenant setting');
  }
}

/**
 * Partially update an existing tenant setting
 */
export async function patchTenantSetting(
  id: number,
  data: Partial<TenantSettingsFormDTO>
): Promise<TenantSettingsDTO> {
  try {
    const payload = withTenantId({
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    });

    const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/tenant-settings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update tenant setting: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error patching tenant setting:', error);
    throw new Error('Failed to update tenant setting');
  }
}

/**
 * Delete a tenant setting
 */
export async function deleteTenantSetting(id: number): Promise<void> {
  try {
    const response = await fetchWithJwtRetry(`${API_BASE_URL}/api/tenant-settings/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete tenant setting: ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting tenant setting:', error);
    throw new Error('Failed to delete tenant setting');
  }
}
