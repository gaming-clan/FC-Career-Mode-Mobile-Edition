/// <reference path="../../types.global.d.ts" />

/**
 * Structured Logging Utilities
 * Provides consistent logging patterns with metadata.
 * 
 * NOTE: This module uses process which is Node-specific.
 * It's guarded with typeof checks for browser compatibility.
 */

/* @ts-expect-error - process is Node global */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  module: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Get the current environment (development or production).
 * Safe to call in both Node and browser contexts.
 */
function getEnvironment(): "development" | "production" {
  // Safely access process in both Node and browser environments
  try {
    const env = (globalThis as any).process?.env || {};
    return (env.NODE_ENV as "development" | "production") || "development";
  } catch {
    return "development";
  }
}

/**
 * Create a logger instance for a specific module.
 *
 * @param moduleName - Name of the module using this logger
 * @returns Logger with methods for different log levels
 */
export function createLogger(moduleName: string) {
  const formatLogEntry = (level: LogLevel, message: string, data?: Record<string, unknown>) => {
    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      module: moduleName,
      message,
      ...(data && { data }),
    };
    return entry;
  };

  const log = (level: LogLevel, message: string, data?: Record<string, unknown>) => {
    const entry = formatLogEntry(level, message, data);
    const environment = getEnvironment();

    // Only log errors and warnings in production
    if (environment === "production") {
      if (level === "error" || level === "warn") {
        console[level](`[${entry.module}] ${message}`, data || "");
      }
      return;
    }

    // Log all levels in development
    console[level](`[${entry.timestamp}] [${entry.module}] ${message}`, data || "");
  };

  return {
    debug: (message: string, data?: Record<string, unknown>) => log("debug", message, data),
    info: (message: string, data?: Record<string, unknown>) => log("info", message, data),
    warn: (message: string, data?: Record<string, unknown>) => log("warn", message, data),
    error: (message: string, data?: Record<string, unknown>) => log("error", message, data),

    /**
     * Log an error with stack trace.
     */
    errorWithStack: (message: string, error: unknown) => {
      const stack = error instanceof Error ? error.stack : String(error);
      log("error", message, { error: String(error), stack });
    },
  };
}
