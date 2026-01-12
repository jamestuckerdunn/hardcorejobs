import Link from "next/link";
import { Search, Home, ArrowRight } from "lucide-react";

/**
 * Custom 404 page for better user experience when pages are not found.
 */
export default function NotFound() {
  return (
    <div className="bg-black min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="flex h-20 w-20 items-center justify-center border border-neutral-800 text-neutral-600">
            <span className="text-4xl font-black">404</span>
          </div>
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mt-4 text-neutral-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back Home
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 border-2 border-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Jobs
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800">
          <p className="text-sm text-neutral-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1">
              About Us <ArrowRight className="h-3 w-3" />
            </Link>
            <Link href="/pricing" className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1">
              Pricing <ArrowRight className="h-3 w-3" />
            </Link>
            <Link href="/sign-up" className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1">
              Sign Up <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
