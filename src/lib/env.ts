/**
 * Lazily loads API JWT user from environment variables, supporting AMPLIFY_ and unprefixed names.
 */
export function getApiJwtUser() {
  return (
    process.env.AMPLIFY_API_JWT_USER ||
    process.env.API_JWT_USER ||
    process.env.NEXT_PUBLIC_API_JWT_USER
  );
}

/**
 * Lazily loads API JWT password from environment variables, supporting AMPLIFY_ and unprefixed names.
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
 * Gets the current app URL dynamically, making the application truly port-agnostic.
 * Priority order:
 * 1. NEXT_PUBLIC_APP_URL environment variable (highest priority)
 * 2. PORT environment variable
 * 3. Default to localhost:3000 (lowest priority)
 *
 * This ensures the app works regardless of how the port is specified.
 */
export function getAppUrl(): string {
  // If NEXT_PUBLIC_APP_URL is explicitly set, use it (highest priority)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // In development, try to detect the port
  if (process.env.NODE_ENV === 'development') {
    // Check for PORT environment variable (set by command line or env)
    const port = process.env.PORT || '3000';
    return `http://localhost:${port}`;
  }

  // Default fallback
  return 'http://localhost:3000';
}