"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Zap,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type { SavedJob } from "@/types";

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function SavedJobsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border border-neutral-800 p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-neutral-800" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-neutral-800" />
              <div className="h-4 w-1/2 bg-neutral-900" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-24 bg-neutral-800" />
            <div className="h-6 w-20 bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SavedJobWithDetails extends SavedJob {
  title?: string;
  company_name?: string;
  company_logo_url?: string;
  location?: string;
  remote_type?: string;
  salary_min?: number;
  salary_max?: number;
  is_featured?: boolean;
  apply_url?: string;
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJobWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSavedJobs() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/saved-jobs");
        if (response.ok) {
          const data = await response.json();
          setSavedJobs(data.savedJobs || []);
        }
      } catch {
        // Silent failure - empty state will be shown
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId: string) => {
    setRemovingId(jobId);
    try {
      const response = await fetch("/api/user/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (response.ok) {
        setSavedJobs((prev) => prev.filter((job) => job.job_id !== jobId));
      }
    } catch {
      // Silent failure - job remains in list
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            Saved Jobs
          </h1>
          <p className="mt-1 text-neutral-400">
            Jobs you&apos;ve bookmarked for later
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <SavedJobsSkeleton />
        ) : savedJobs.length > 0 ? (
          <>
            <p className="text-sm text-neutral-500 mb-6">
              {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {savedJobs.map((saved) => (
                <div
                  key={saved.id}
                  className={`border p-6 transition-colors ${
                    saved.is_featured || saved.job?.is_featured
                      ? "border-amber-900/50 bg-amber-950/10"
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {(saved.is_featured || saved.job?.is_featured) && (
                    <div className="mb-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-amber-500">
                      <Zap className="h-3 w-3" />
                      Featured
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-neutral-900 text-lg font-bold text-neutral-600">
                      {(saved.company_name || saved.job?.company_name || "?").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/jobs/${saved.job_id}`}
                        className="font-semibold text-white hover:underline block truncate"
                      >
                        {saved.title || saved.job?.title}
                      </Link>
                      <p className="text-sm text-neutral-400 truncate">
                        {saved.company_name || saved.job?.company_name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-emerald-950 px-2 py-1 text-xs font-medium text-emerald-400">
                      ${Math.round((saved.salary_min || saved.job?.salary_min || 0) / 1000)}K - $
                      {Math.round((saved.salary_max || saved.job?.salary_max || 0) / 1000)}K
                    </span>
                    <span className="inline-flex items-center gap-1 bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-400">
                      <MapPin className="h-3 w-3" />
                      {saved.location || saved.job?.location}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-neutral-600">
                      Saved {formatTimeAgo(saved.saved_at)}
                    </span>
                    <div className="flex gap-3">
                      <Link
                        href={`/jobs/${saved.job_id}`}
                        className="text-xs font-semibold uppercase tracking-wider text-white hover:text-neutral-300 transition-colors"
                      >
                        View
                      </Link>
                      {(saved.apply_url || saved.job?.apply_url) && (
                        <a
                          href={saved.apply_url || saved.job?.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Apply
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button
                        onClick={() => handleRemove(saved.job_id)}
                        disabled={removingId === saved.job_id}
                        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="border border-neutral-800 p-12 text-center">
            <Bookmark className="h-12 w-12 text-neutral-700 mx-auto" />
            <h3 className="mt-4 text-lg font-bold text-white">No Saved Jobs</h3>
            <p className="mt-2 text-neutral-400">
              Save jobs you&apos;re interested in to review them later.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center bg-white px-6 py-3 mt-6 text-sm font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
