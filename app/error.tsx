"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Global error handler for unhandled errors in the app.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service (e.g., Sentry)
      console.error("Unhandled error:", error);
    }
  }, [error]);

  return (
    <div className="bg-black min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="flex h-20 w-20 items-center justify-center border border-red-900 text-red-500">
            <AlertCircle className="h-10 w-10" />
          </div>
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          Something Went Wrong
        </h1>

        <p className="mt-4 text-neutral-400">
          We encountered an unexpected error. Our team has been notified
          and is working to fix the issue.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs text-neutral-600">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-2 border-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
