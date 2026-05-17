/**
 * Application Constants
 * Centralized constants for the entire application.
 */

// ============================================================================
// Time Constants
// ============================================================================

/** Milliseconds per second */
export const MS_PER_SECOND = 1000;

/** Milliseconds per minute */
export const MS_PER_MINUTE = 60 * MS_PER_SECOND;

/** Milliseconds per hour */
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;

/** Milliseconds per day */
export const MS_PER_DAY = 24 * MS_PER_HOUR;

/** One year in milliseconds */
export const ONE_YEAR_MS = 365 * MS_PER_DAY;

// ============================================================================
// API Constants
// ============================================================================

/** Default timeout for API calls (30 seconds) */
export const API_TIMEOUT_MS = 30_000;

/** Default number of retries for API calls */
export const API_MAX_RETRIES = 3;

/** Initial delay for exponential backoff (1 second) */
export const API_RETRY_DELAY_MS = 1000;

// ============================================================================
// Authentication Constants
// ============================================================================

/** Session cookie name */
export const COOKIE_NAME = "app_session_id";

/** Error message for unauthenticated requests */
export const UNAUTHED_ERR_MSG = "Please login (10001)";

/** Error message for unauthorized requests */
export const NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// ============================================================================
// Validation Constants
// ============================================================================

/** Maximum string length for user input */
export const MAX_STRING_LENGTH = 1000;

/** Maximum email length (RFC 5321) */
export const MAX_EMAIL_LENGTH = 320;

/** Minimum password length */
export const MIN_PASSWORD_LENGTH = 8;

/** Maximum password length */
export const MAX_PASSWORD_LENGTH = 128;

// ============================================================================
// Rate Limiting Constants
// ============================================================================

/** Max login attempts per IP */
export const LOGIN_RATE_LIMIT = 5;

/** Rate limit window (15 minutes) */
export const RATE_LIMIT_WINDOW_MS = 15 * MS_PER_MINUTE;

// ============================================================================
// Pagination Constants
// ============================================================================

/** Default page size for list endpoints */
export const DEFAULT_PAGE_SIZE = 20;

/** Maximum page size to prevent abuse */
export const MAX_PAGE_SIZE = 100;

// ============================================================================
// File Upload Constants
// ============================================================================

/** Maximum file upload size (10 MB) */
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

/** Allowed MIME types for uploads */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

// ============================================================================
// Game Constants
// ============================================================================

/** Number of weeks in a season */
export const WEEKS_PER_SEASON = 38;

/** Number of teams in a league */
export const TEAMS_PER_LEAGUE = 20;

/** Maximum squad size */
export const MAX_SQUAD_SIZE = 25;

/** Minimum squad size for a valid team */
export const MIN_SQUAD_SIZE = 11;
