/**
 * Simple logger utility that respects environment
 * In production, only errors and warnings are logged
 */

const isProduction = process.env.NODE_ENV === "production";
const isDebugEnabled = process.env.DEBUG === "true";

export const logger = {
  debug: (...args: unknown[]) => {
    if (!isProduction || isDebugEnabled) {
      console.log("[DEBUG]", ...args);
    }
  },

  info: (...args: unknown[]) => {
    if (!isProduction || isDebugEnabled) {
      console.log("[INFO]", ...args);
    }
  },

  warn: (...args: unknown[]) => {
    console.warn("[WARN]", ...args);
  },

  error: (...args: unknown[]) => {
    console.error("[ERROR]", ...args);
  },
};

export default logger;
