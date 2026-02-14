/**
 * API Request/Response Types
 * Type-safe interfaces for all API interactions.
 */

/**
 * Standard error response from the API.
 */
export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

/**
 * Options for configuring API calls with retry logic.
 */
export interface ApiCallOptions extends RequestInit {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in milliseconds (default: 1000) */
  retryDelayMs?: number;
  /** HTTP status codes that should trigger a retry (default: [408, 429, 500, 502, 503, 504]) */
  retryableStatusCodes?: number[];
  /** Timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Check if an error response is a valid ApiErrorResponse.
 */
export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.error === "string";
}

/**
 * Check if an HTTP status code indicates a retryable error.
 */
export function isRetryableStatus(status: number, retryableStatuses: number[]): boolean {
  return retryableStatuses.includes(status);
}

/**
 * Calculate exponential backoff delay.
 * @param attempt Retry attempt number (0-indexed)
 * @param baseDelayMs Base delay in milliseconds
 * @returns Delay in milliseconds with jitter
 */
export function calculateBackoffDelay(attempt: number, baseDelayMs: number): number {
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
  // Add jitter (±10%) to prevent thundering herd
  const jitter = exponentialDelay * 0.1 * (Math.random() * 2 - 1);
  return Math.round(exponentialDelay + jitter);
}
