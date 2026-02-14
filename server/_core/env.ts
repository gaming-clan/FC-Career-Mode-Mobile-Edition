/**
 * Environment Variable Configuration
 * Validates required environment variables and provides typed access.
 */

/**
 * Validate and get a required environment variable.
 *
 * @throws Error if the variable is not set
 */
function getRequired(name: string, description?: string): string {
  const value = typeof process !== "undefined" ? process.env[name] : undefined;

  if (!value) {
    const msg = `Missing required environment variable: ${name}${description ? ` (${description})` : ""}`;
    throw new Error(msg);
  }

  return value;
}

/**
 * Get an optional environment variable with a default value.
 */
function getOptional(name: string, defaultValue: string = ""): string {
  return typeof process !== "undefined" ? (process.env[name] ?? defaultValue) : defaultValue;
}

/**
 * Validated environment variables for the application.
 *
 * Throws on startup if any required variables are missing.
 */
export const ENV = {
  // Database configuration
  /** MySQL database connection URL */
  DATABASE_URL: getRequired("DATABASE_URL", "MySQL connection string"),

  // OAuth configuration (identity provider)
  /** OAuth provider URL for login flow */
  OAUTH_PORTAL_URL: getRequired("EXPO_PUBLIC_OAUTH_PORTAL_URL", "OAuth identity provider URL"),

  /** OAuth callback server URL */
  OAUTH_SERVER_URL: getRequired("EXPO_PUBLIC_OAUTH_SERVER_URL", "OAuth server URL"),

  /** Application ID in OAuth provider */
  APP_ID: getRequired("EXPO_PUBLIC_APP_ID", "App ID for OAuth provider"),

  // Owner configuration
  /** OpenID of the app owner (for admin privileges) */
  ownerOpenId: getRequired("EXPO_PUBLIC_OWNER_OPEN_ID", "App owner's OAuth ID"),

  /** Owner's display name */
  ownerName: getOptional("EXPO_PUBLIC_OWNER_NAME", "Owner"),

  // API configuration
  /** API base URL for client requests */
  API_BASE_URL: getOptional("EXPO_PUBLIC_API_BASE_URL", ""),

  // Storage configuration (optional - for S3 file uploads)
  /** Forge/S3 storage API URL */
  forgeApiUrl: getOptional("BUILT_IN_FORGE_API_URL", ""),

  /** Forge/S3 API key for authentication */
  forgeApiKey: getOptional("BUILT_IN_FORGE_API_KEY", ""),

  // Runtime environment
  /** Current environment (development, production, test) */
  NODE_ENV: getOptional("NODE_ENV", "development") as "development" | "production" | "test",

  /** Server port */
  PORT: parseInt(getOptional("PORT", "3000"), 10),
};

/**
 * Validate that storage is properly configured.
 *
 * @throws Error if storage is accessed but not configured
 */
export function assertStorageConfigured(): void {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    throw new Error(
      "Storage is not configured. Set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY",
    );
  }
}
