/**
 * Input Validation and Sanitization Utilities
 * Provides common validation functions for user input and API parameters.
 */

/**
 * Validate that a string is not empty and has reasonable length.
 *
 * @param value - String to validate
 * @param name - Parameter name for error messages
 * @param minLength - Minimum string length (default: 1)
 * @param maxLength - Maximum string length (default: 1000)
 * @throws Error if validation fails
 */
export function validateString(
  value: unknown,
  name: string,
  minLength = 1,
  maxLength = 1000,
): string {
  if (typeof value !== "string") {
    throw new Error(`${name} must be a string`);
  }

  const trimmed = value.trim();

  if (trimmed.length < minLength) {
    throw new Error(`${name} must be at least ${minLength} character(s)`);
  }

  if (trimmed.length > maxLength) {
    throw new Error(`${name} must not exceed ${maxLength} characters`);
  }

  return trimmed;
}

/**
 * Validate that a value is a valid positive integer.
 *
 * @param value - Value to validate
 * @param name - Parameter name for error messages
 * @param min - Minimum value (inclusive, default: 0)
 * @param max - Maximum value (inclusive, optional)
 * @throws Error if validation fails
 * @returns The validated integer
 */
export function validateInt(
  value: unknown,
  name: string,
  min = 0,
  max?: number,
): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`${name} must be an integer`);
  }

  if (value < min) {
    throw new Error(`${name} must be at least ${min}`);
  }

  if (max !== undefined && value > max) {
    throw new Error(`${name} must not exceed ${max}`);
  }

  return value;
}

/**
 * Validate that a value is a valid email address.
 *
 * @param value - Email to validate
 * @param name - Parameter name for error messages
 * @throws Error if validation fails
 * @returns The validated email (normalized to lowercase)
 */
export function validateEmail(value: unknown, name = "Email"): string {
  const email = validateString(value, name, 5, 320);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error(`${name} must be a valid email address`);
  }

  return email.toLowerCase();
}

/**
 * Validate that a value is one of the allowed enum values.
 *
 * @param value - Value to validate
 * @param allowedValues - Array of allowed values
 * @param name - Parameter name for error messages
 * @throws Error if validation fails
 * @returns The validated value
 */
export function validateEnum<T extends string | number>(
  value: unknown,
  allowedValues: readonly T[],
  name: string,
): T {
  if (!allowedValues.includes(value as T)) {
    throw new Error(`${name} must be one of: ${allowedValues.join(", ")}`);
  }

  return value as T;
}

/**
 * Sanitize a string to prevent XSS by escaping HTML characters.
 *
 * @param value - String to sanitize
 * @returns Sanitized string with HTML characters escaped
 */
export function sanitizeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate a URL string is properly formatted.
 *
 * @param value - URL to validate
 * @param name - Parameter name for error messages
 * @throws Error if validation fails
 * @returns The validated URL
 */
export function validateUrl(value: unknown, name = "URL"): string {
  const url = validateString(value, name);

  try {
    new URL(url);
  } catch {
    throw new Error(`${name} must be a valid URL`);
  }

  return url;
}
