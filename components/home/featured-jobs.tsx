"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Zap, ChevronRight } from "lucide-react";
import type { Job } from "@/types";

function FeaturedJobsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border border-neutral-800 p-6 animate-pulse"
        >
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

export function FeaturedJobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedJobs() {
      try {
        const response = await fetch("/api/jobs/featured");
        if (response.ok) {
          const data = await response.json();
          setJobs(data.jobs?.slice(0, 3) || []);
        }
      } catch (error) {
        console.error("Failed to fetch featured jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedJobs();
  }, []);

  return (
    <section className="border-b border-neutral-800 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Featured Jobs
            </h2>
            <p className="mt-2 text-neutral-400">
              Hand-picked opportunities with top employers
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white hover:text-neutral-300 transition-colors"
          >
            View All Jobs
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <FeaturedJobsSkeleton />
        ) : jobs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, i) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className={`group card card-lift p-6 ${
                  job.is_featured ? "border-amber-900/50 bg-amber-950/10" : ""
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {job.is_featured && (
                  <div className="mb-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-amber-500">
                    <Zap className="h-3 w-3" />
                    Featured
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-neutral-900 text-lg font-bold text-neutral-600">
                    {job.company_name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white group-hover:underline truncate">
                      {job.title}
                    </h3>
                    <p className="text-sm text-neutral-400">{job.company_name}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-emerald-950 px-2 py-1 text-xs font-medium text-emerald-400">
                    ${Math.round((job.salary_min || 0) / 1000)}K - ${Math.round((job.salary_max || 0) / 1000)}K
                  </span>
                  <span className="inline-flex items-center gap-1 bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-400">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            No featured jobs available at the moment.
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/jobs"
            className="btn btn-secondary px-6 py-3 text-sm"
          >
            View All Jobs
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
