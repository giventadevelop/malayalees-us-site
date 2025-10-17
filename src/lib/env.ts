/**
 * Lazily loads API JWT user from environment variables, prioritizing AMPLIFY_ prefix for AWS Amplify.
 */
export function getApiJwtUser() {
  return (
    process.env.AMPLIFY_API_JWT_USER ||
    process.env.API_JWT_USER ||
    process.env.NEXT_PUBLIC_API_JWT_USER
  );
}

/**
 * Lazily loads API JWT password from environment variables, prioritizing AMPLIFY_ prefix for AWS Amplify.
 */
export function getApiJwtPass() {
  return (
    process.env.AMPLIFY_API_JWT_PASS ||
    process.env.API_JWT_PASS ||
    process.env.NEXT_PUBLIC_API_JWT_PASS
  );
}

/**
 * Lazily loads tenant ID from environment variables (NEXT_PUBLIC_TENANT_ID).
 * Throws an error if not set.
 */
export function getTenantId() {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  if (!tenantId) {
    throw new Error('NEXT_PUBLIC_TENANT_ID is not set in environment variables');
  }
  return tenantId;
}

/**
 * Get the app URL for port-agnostic configuration
 * This is used for server-side API calls to ensure the application works on any port
 * Returns the full URL including protocol (e.g., "http://localhost:3000" or "https://mcefee.org")
 *
 * IMPORTANT: This function should NOT have hardcoded fallbacks. The actual host should be
 * determined from the request context or environment variables to avoid hardcoding issues.
 */
export function getAppUrl(): string {
  // In production, use the actual domain from environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || '';
  }
  // In development, use localhost with dynamic port detection
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Get the email host URL prefix for QR code generation
 * This is used to ensure QR codes work properly in email contexts
 * Returns the full URL including protocol (e.g., "http://localhost:3000" or "https://mcefee.org")
 *
 * IMPORTANT: This function should NOT have hardcoded fallbacks. The actual host should be
 * determined from the request context or environment variables to avoid hardcoding issues.
 */
export function getEmailHostUrlPrefix(): string {
  // In production, use the actual domain from environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || '';
  }
  // In development, use localhost with dynamic port detection
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Get Clerk Backend API URL
 * Returns the Clerk API endpoint for backend authentication
 */
export function getClerkBackendUrl(): string {
  const raw = process.env.CLERK_BACKEND_API_URL || 'https://api.clerk.com';
  // Safety: only allow Clerk host and normalize to origin without path
  try {
    const u = new URL(raw);
    if (!/clerk\.com$/i.test(u.hostname)) return 'https://api.clerk.com';
    // Always force api.clerk.com origin, strip any path (/v1 etc.)
    return 'https://api.clerk.com';
  } catch {
    return 'https://api.clerk.com';
  }
}

/**
 * Get Clerk Secret Key for backend API authentication
 * Throws an error if not set as this is required for backend Clerk integration
 */
export function getClerkSecretKey(): string {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error('CLERK_SECRET_KEY is not set in environment variables');
  }
  return secretKey;
}

/**
 * Get Clerk Publishable Key for frontend (if needed for hybrid approach)
 */
export function getClerkPublishableKey(): string | undefined {
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

/**
 * Get Auth JWT Secret for signing access/refresh tokens
 * Prioritize Amplify prefixed vars in production
 */
export function getAuthJwtSecret(): string {
  const secret =
    process.env.AMPLIFY_JWT_SECRET ||
    process.env.JWT_SECRET ||
    process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret not set. Configure AMPLIFY_JWT_SECRET or JWT_SECRET');
  }
  return secret;
}

/**
 * Get Backend API Base URL for OAuth and API calls
 * Returns the backend server URL (e.g., "http://localhost:8080" or "https://api.yourdomain.com")
 */
export function getBackendApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
}