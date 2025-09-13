/**
 * DTO for tenant organization details.
 * Matches backend OpenAPI schema.
 */
export interface TenantOrganizationDTO {
  id?: number;
  tenantId: string;
  organizationName: string;
  domain?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  subscriptionStartDate?: string; // YYYY-MM-DD
  subscriptionEndDate?: string;   // YYYY-MM-DD
  monthlyFeeUsd?: number;
  stripeCustomerId?: string;
  isActive?: boolean;
  createdAt: string; // ISO date-time
  updatedAt: string; // ISO date-time
}

/**
 * DTO for tenant settings.
 * Matches backend OpenAPI schema.
 */
export interface TenantSettingsDTO {
  id?: number;
  tenantId: string;
  allowUserRegistration?: boolean;
  requireAdminApproval?: boolean;
  enableWhatsappIntegration?: boolean;
  enableEmailMarketing?: boolean;
  whatsappApiKey?: string;
  emailProviderConfig?: string;
  maxEventsPerMonth?: number;
  maxAttendeesPerEvent?: number;
  enableGuestRegistration?: boolean;
  maxGuestsPerAttendee?: number;
  defaultEventCapacity?: number;
  platformFeePercentage?: number;
  customCss?: string;
  customJs?: string;
  createdAt: string; // ISO date-time
  updatedAt: string; // ISO date-time
  tenantOrganization?: TenantOrganizationDTO;
}

/**
 * Form DTO for tenant organization creation/editing.
 * Omits fields that are auto-generated or supplied by the system.
 */
export type TenantOrganizationFormDTO = Omit<TenantOrganizationDTO, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Form DTO for tenant settings creation/editing.
 * Omits fields that are auto-generated or supplied by the system.
 */
export type TenantSettingsFormDTO = Omit<TenantSettingsDTO, 'id' | 'createdAt' | 'updatedAt' | 'tenantOrganization'>;

/**
 * Filter options for tenant organization list
 */
export interface TenantOrganizationFilters {
  search?: string;
  subscriptionStatus?: string;
  isActive?: boolean;
  sortBy?: 'organizationName' | 'createdAt' | 'subscriptionStatus';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter options for tenant settings list
 */
export interface TenantSettingsFilters {
  search?: string;
  tenantId?: string;
  sortBy?: 'tenantId' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * API response for paginated lists
 */
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

