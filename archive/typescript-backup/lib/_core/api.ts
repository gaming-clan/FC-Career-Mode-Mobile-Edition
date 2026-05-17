import { Platform } from "react-native";
import { getApiBaseUrl } from "@/constants/oauth";
import * as Auth from "./auth";
import {
  isApiErrorResponse,
  isRetryableStatus,
  calculateBackoffDelay,
  type ApiCallOptions,
  type ApiErrorResponse,
} from "./api-types";

type ApiResponse<T> = {
  data?: T;
  error?: string;
};

/**
 * User type for API responses.
 * Should match the server's User type.
 */
export type ApiUser = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: string;
};

/**
 * OAuth token response from the backend.
 */
type OAuthTokenResponse = {
  app_session_id: string;
  user: ApiUser;
};

/**
 * Default options for API calls with retry logic.
 */
const DEFAULT_API_CALL_OPTIONS: Required<Omit<ApiCallOptions, keyof RequestInit>> = {
  maxRetries: 3,
  retryDelayMs: 1000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  timeoutMs: 30000,
};

/**
 * Validates that a URL is safe to call.
 * @throws Error if URL is invalid
 */
function validateUrl(url: string): asserts url is string {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL provided to API call");
  }
  try {
    new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  } catch {
    throw new Error(`Malformed URL: ${url}`);
  }
}

/**
 * Makes an HTTP request with automatic retry logic, timeout, and error handling.
 *
 * @template T - The expected response type
 * @param endpoint - API endpoint (relative or absolute path)
 * @param options - Request options including auth, headers, and retry configuration
 * @returns Promise resolving to the parsed response
 * @throws Error with descriptive message on failure
 */
export async function apiCall<T>(
  endpoint: string,
  options: ApiCallOptions = {},
): Promise<T> {
  validateUrl(endpoint);

  const {
    maxRetries = DEFAULT_API_CALL_OPTIONS.maxRetries,
    retryDelayMs = DEFAULT_API_CALL_OPTIONS.retryDelayMs,
    retryableStatusCodes = DEFAULT_API_CALL_OPTIONS.retryableStatusCodes,
    timeoutMs = DEFAULT_API_CALL_OPTIONS.timeoutMs,
    ...fetchOptions
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Add authentication token for native platforms
  if (Platform.OS !== "web") {
    const sessionToken = await Auth.getSessionToken();
    if (sessionToken) {
      headers["Authorization"] = `Bearer ${sessionToken}`;
    }
  }

  const baseUrl = getApiBaseUrl();
  // Ensure no double slashes between baseUrl and endpoint
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = baseUrl ? `${cleanBaseUrl}${cleanEndpoint}` : endpoint;

  let lastError: Error | null = null;

  // Retry loop with exponential backoff
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Create abort controller for timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          credentials: "include",
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        // Handle non-OK responses
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = errorText;

          try {
            const errorJson = JSON.parse(errorText);
            if (isApiErrorResponse(errorJson)) {
              errorMessage = errorJson.error || errorJson.message || errorText;
            }
          } catch {
            // Not JSON, use text as is
          }

          const error = new Error(
            errorMessage || `API call failed: ${response.statusText} (${response.status})`,
          );
          (error as any).status = response.status;

          // Check if this status code is retryable
          if (
            isRetryableStatus(response.status, retryableStatusCodes) &&
            attempt < maxRetries
          ) {
            lastError = error;
            const delay = calculateBackoffDelay(attempt, retryDelayMs);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }

        // Parse successful response
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          return data as T;
        }

        const text = await response.text();
        return (text ? JSON.parse(text) : {}) as T;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error occurred");

      // Check if it's a retriable error
      if (attempt < maxRetries) {
        const isTimeout = lastError.name === "AbortError";
        const isNetworkError =
          lastError instanceof TypeError && lastError.message.includes("Failed to fetch");

        if (isTimeout || isNetworkError) {
          const delay = calculateBackoffDelay(attempt, retryDelayMs);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      throw lastError;
    }
  }

  throw lastError || new Error("API call failed after retries");
}

// OAuth callback handler - exchange code for session token
// Calls /api/oauth/mobile endpoint which returns JSON with app_session_id and user
/**
 * Exchange OAuth authorization code for session token.
 *
 * @param code - OAuth authorization code from identity provider
 * @param state - OAuth state parameter for CSRF protection
 * @returns Object containing session token and user information
 * @throws Error if code exchange fails
 */
export async function exchangeOAuthCode(
  code: string,
  state: string,
): Promise<{ sessionToken: string; user: ApiUser }> {
  if (!code || typeof code !== "string") {
    throw new Error("Invalid OAuth code provided");
  }
  if (!state || typeof state !== "string") {
    throw new Error("Invalid OAuth state provided");
  }

  // Use GET with query params
  const params = new URLSearchParams({ code, state });
  const endpoint = `/api/oauth/mobile?${params.toString()}`;
  const result = await apiCall<OAuthTokenResponse>(endpoint);

  // Convert app_session_id to sessionToken for compatibility
  const sessionToken = result.app_session_id;

  return {
    sessionToken,
    user: result.user,
  };
}

/**
 * Logout the current user and clear session.
 *
 * @throws Error if logout request fails
 */
export async function logout(): Promise<void> {
  await apiCall<void>("/api/auth/logout", {
    method: "POST",
  });
}

/**
 * Get current authenticated user information.
 *
 * Only works on web platform with cookie-based auth.
 * Returns null if user is not authenticated or on non-web platform.
 *
 * @returns User information or null if not authenticated
 */
export async function getMe(): Promise<ApiUser | null> {
  try {
    const result = await apiCall<{ user: ApiUser }>("/api/auth/me");
    return result.user || null;
  } catch (error) {
    // User not authenticated - return null instead of throwing
    return null;
  }
}

/**
 * Establish session cookie on the backend domain.
 *
 * Called after receiving token via OAuth to get a proper Set-Cookie header
 * from the backend.
 *
 * @param token - Session token to establish
 * @returns true if session was established successfully
 */
export async function establishSession(token: string): Promise<boolean> {
  if (!token || typeof token !== "string") {
    console.error("[Auth] Invalid token provided to establishSession");
    return false;
  }

  try {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/auth/session`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Important: allows Set-Cookie to be stored
    });

    return response.ok;
  } catch (error) {
    console.error("[Auth] Failed to establish session:", error);
    return false;
  }
}
