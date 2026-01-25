"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // Error monitoring can be added here later (e.g., Sentry)
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-red-950 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-black uppercase tracking-tight text-white">
          Something went wrong
        </h1>

        <p className="mt-4 text-neutral-400">
          We encountered an unexpected error. Our team has been notified and is
          working on a fix.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs text-neutral-600">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-neutral-200"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
