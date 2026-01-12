"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans bg-black">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center bg-red-950 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Critical Error
            </h1>

            <p className="mt-4 text-neutral-400">
              A critical error has occurred. Please try refreshing the page.
            </p>

            {error.digest && (
              <p className="mt-2 text-xs text-neutral-600">
                Error ID: {error.digest}
              </p>
            )}

            <button
              onClick={reset}
              className="mt-8 inline-flex items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-neutral-200"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
