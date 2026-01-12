// Simple logging utility for error monitoring
// This can be extended to use Sentry, LogRocket, or other services

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  route?: string;
  method?: string;
  [key: string]: unknown;
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatLog("debug", message, context));
    }
  },

  info(message: string, context?: LogContext) {
    console.info(formatLog("info", message, context));
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatLog("warn", message, context));
  },

  error(message: string, error?: unknown, context?: LogContext) {
    const errorDetails = error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { raw: String(error) };

    console.error(formatLog("error", message, { ...context, error: errorDetails }));

    // In production, you would send to an error tracking service here
    // Example: Sentry.captureException(error, { extra: context });
  },

  // Log API request for monitoring
  apiRequest(method: string, route: string, userId?: string) {
    this.info(`API Request: ${method} ${route}`, { method, route, userId });
  },

  // Log API error with full context
  apiError(method: string, route: string, error: unknown, userId?: string) {
    this.error(`API Error: ${method} ${route}`, error, { method, route, userId });
  },
};

// Error response helper for consistent API error responses
export function createErrorResponse(
  message: string,
  status: number,
  details?: string
) {
  // Log all errors
  if (status >= 500) {
    logger.error(message, details);
  } else if (status >= 400) {
    logger.warn(message, { details });
  }

  return {
    error: message,
    ...(process.env.NODE_ENV === "development" && details ? { details } : {}),
  };
}
