/**
 * Security Utilities
 * Common security functions for authentication, authorization, and data protection.
 */

/**
 * Check if a user role has permission for an action.
 *
 * @param userRole - User's role
 * @param requiredRole - Required role for the action
 * @returns true if user has sufficient permissions
 */
export function hasRole(userRole: string | null | undefined, requiredRole: string): boolean {
  if (!userRole) return false;

  // Admin has all permissions
  if (userRole === "admin") return true;

  // Exact match
  return userRole === requiredRole;
}

/**
 * Check if a user ID matches or is authorized.
 * Useful for ensuring users can only access their own data.
 *
 * @param requestUserId - User ID from request (authenticated user)
 * @param resourceOwnerId - User ID that owns the resource
 * @param isAdmin - Whether the request user is an admin
 * @returns true if user is allowed to access the resource
 */
export function isAuthorized(
  requestUserId: number | null | undefined,
  resourceOwnerId: number,
  isAdmin: boolean = false,
): boolean {
  // Admins can access anything
  if (isAdmin) return true;

  // User can access their own resources
  return requestUserId === resourceOwnerId;
}

/**
 * Rate limit check using simple in-memory store.
 * For production, use Redis or similar.
 *
 * @param key - Unique identifier (e.g., IP address, user ID)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count < maxRequests) {
    entry.count++;
    return true;
  }

  return false;
}

/**
 * Clear rate limit entry (useful after request handling).
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Generate a secure random string.
 *
 * @param length - Length of the random string
 * @returns Random hex string
 */
export function generateRandomToken(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Validate CORS origin for security.
 *
 * @param origin - Origin to validate
 * @param allowedOrigins - List of allowed origins
 * @returns true if origin is allowed
 */
export function isValidCorsOrigin(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.some((allowed) => {
    // Exact match
    if (allowed === origin) return true;

    // Wildcard support
    if (allowed === "*") return true;

    // Subdomain wildcard (e.g., "*.example.com")
    if (allowed.startsWith("*.")) {
      const domain = allowed.slice(2);
      return origin.endsWith(domain) && origin.includes(".");
    }

    return false;
  });
}
