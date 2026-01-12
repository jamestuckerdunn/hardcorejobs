/**
 * Simple structured logging utility.
 * Provides environment-aware logging with consistent formatting.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL as LogLevel | undefined;
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return envLevel;
  }
  return process.env.NODE_ENV === "production" ? "warn" : "info";
}

function shouldLog(level: LogLevel): boolean {
  const currentLevel = getLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(level: LogLevel, message: string, data?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
}

/**
 * Logger instance with methods for each log level.
 * Respects LOG_LEVEL environment variable.
 * In production, only warns and errors are logged by default.
 */
export const logger = {
  debug(message: string, data?: Record<string, unknown>): void {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", message, data));
    }
  },

  info(message: string, data?: Record<string, unknown>): void {
    if (shouldLog("info")) {
      console.info(formatMessage("info", message, data));
    }
  },

  warn(message: string, data?: Record<string, unknown>): void {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, data));
    }
  },

  error(message: string, error?: unknown, data?: Record<string, unknown>): void {
    if (shouldLog("error")) {
      const errorData = {
        ...data,
        error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      };
      console.error(formatMessage("error", message, errorData));
    }
  },

  /**
   * Log API request details (info level).
   */
  request(method: string, path: string, data?: Record<string, unknown>): void {
    this.info(`${method} ${path}`, data);
  },

  /**
   * Log API response details (info level).
   */
  response(method: string, path: string, status: number, duration?: number): void {
    this.info(`${method} ${path} -> ${status}`, duration ? { durationMs: duration } : undefined);
  },
};

export default logger;
