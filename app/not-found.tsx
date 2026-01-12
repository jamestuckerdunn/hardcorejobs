import Link from "next/link";
import { Search, Home, Briefcase } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-neutral-800">404</div>

        <h1 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">
          Page Not Found
        </h1>

        <p className="mt-4 text-neutral-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-neutral-200"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>

          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 border-2 border-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
          >
            <Briefcase className="h-4 w-4" />
            Browse Jobs
          </Link>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-8">
          <p className="text-sm text-neutral-500 mb-4">
            Looking for something specific?
          </p>
          <div className="relative max-w-xs mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="search"
              placeholder="Search jobs..."
              className="w-full bg-neutral-900 border border-neutral-800 pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
