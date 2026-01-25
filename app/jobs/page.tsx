"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { JobCard, FeaturedJobCard } from "@/components/jobs/job-card";
import { JobFilters, QuickFilters, JobFilters as JobFiltersType } from "@/components/jobs/job-filters";
import { NoJobsFound } from "@/components/ui/empty-state";
import { JobListSkeleton } from "@/components/ui/loading";
import { Zap, TrendingUp, MapPin, Building2 } from "lucide-react";
import type { Job, JobsResponse } from "@/types";
import { PAGINATION } from "@/lib/constants";

function getVisiblePageNumbers(currentPage: number, totalPages: number): number[] {
  const maxVisible = 5;
  const pages: number[] = [];

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 3) {
    for (let i = 1; i <= maxVisible; i++) pages.push(i);
  } else if (currentPage >= totalPages - 2) {
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
  }

  return pages;
}

const defaultFilters: JobFiltersType = {
  search: "",
  location: "",
  remoteType: "",
  salaryMin: "",
  sortBy: "recent",
  featuredOnly: false,
};

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  }>({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [stats, setStats] = useState({
    featuredCount: 0,
    avgSalary: 0,
    remoteCount: 0,
    companyCount: 0,
  });

  const [filters, setFilters] = useState<JobFiltersType>(() => ({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    remoteType: searchParams.get("remote_type") || "",
    salaryMin: searchParams.get("salary_min") || "",
    sortBy: searchParams.get("sort") || "recent",
    featuredOnly: searchParams.get("featured") === "true",
  }));

  const fetchJobs = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(PAGINATION.DEFAULT_LIMIT));
      if (filters.search) params.set("search", filters.search);
      if (filters.location) params.set("location", filters.location);
      if (filters.remoteType) params.set("remote_type", filters.remoteType);
      if (filters.salaryMin) params.set("salary_min", filters.salaryMin);
      if (filters.sortBy) params.set("sort", filters.sortBy);
      if (filters.featuredOnly) params.set("featured", "true");

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data: JobsResponse = await response.json();
      setJobs(data.jobs);
      setPagination(data.pagination);

      const featured = data.jobs.filter((j) => j.is_featured).length;
      const remote = data.jobs.filter((j) => j.remote_type === "remote").length;
      const companies = new Set(data.jobs.map((j) => j.company_name)).size;
      const avgSalary = data.jobs.length > 0
        ? Math.round(
            data.jobs.reduce((sum, j) => sum + (j.salary_min || 0), 0) /
              data.jobs.length /
              1000
          )
        : 0;

      setStats({
        featuredCount: featured,
        avgSalary,
        remoteCount: remote,
        companyCount: companies,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchSavedJobs = useCallback(async () => {
    try {
      const response = await fetch("/api/user/saved-jobs");
      if (response.ok) {
        const data = await response.json();
        const ids = new Set<string>(data.savedJobs?.map((sj: { job_id: string }) => sj.job_id) || []);
        setSavedJobIds(ids);
      }
    } catch {
      // User might not be logged in
    }
  }, []);

  useEffect(() => {
    fetchJobs(1);
    fetchSavedJobs();
  }, [fetchJobs, fetchSavedJobs]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.location) params.set("location", filters.location);
    if (filters.remoteType) params.set("remote_type", filters.remoteType);
    if (filters.salaryMin) params.set("salary_min", filters.salaryMin);
    if (filters.sortBy && filters.sortBy !== "recent") params.set("sort", filters.sortBy);
    if (filters.featuredOnly) params.set("featured", "true");

    const queryString = params.toString();
    router.replace(queryString ? `/jobs?${queryString}` : "/jobs", { scroll: false });
  }, [filters, router]);

  const handleSaveJob = async (jobId: string) => {
    try {
      const response = await fetch("/api/user/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (response.ok) {
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          if (next.has(jobId)) {
            next.delete(jobId);
          } else {
            next.add(jobId);
          }
          return next;
        });
      }
    } catch {
      // Handle error silently or show toast
    }
  };

  const handleQuickFilter = (quickFilters: Partial<JobFiltersType>) => {
    setFilters({ ...filters, ...quickFilters });
  };

  const handlePageChange = (page: number) => {
    fetchJobs(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featuredJobs = jobs.filter((job) => job.is_featured);
  const regularJobs = jobs.filter((job) => !job.is_featured);

  return (
    <div className="bg-black min-h-screen">
      <section className="border-b border-neutral-800 bg-gradient-to-b from-neutral-950 to-black py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
              $100K+ Jobs
            </h1>
            <p className="mt-4 text-lg text-neutral-400">
              Browse {pagination.total}+ positions that don&apos;t require a degree
              or prior experience
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-800 bg-neutral-950 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-neutral-400">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>
                <strong className="text-white">{stats.featuredCount}</strong> Featured Jobs
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>
                <strong className="text-white">${stats.avgSalary}K</strong> Avg Salary
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>
                <strong className="text-white">{stats.remoteCount}</strong> Remote Positions
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Building2 className="h-4 w-4 text-purple-500" />
              <span>
                <strong className="text-white">{stats.companyCount}</strong> Companies Hiring
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-4">
            <JobFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
              jobCount={pagination.total}
            />
            <QuickFilters onSelect={handleQuickFilter} />
          </div>

          {error && (
            <div className="mb-8 border border-red-900 bg-red-950/50 p-4 text-center text-red-400">
              {error}
            </div>
          )}

          {isLoading ? (
            <JobListSkeleton count={5} />
          ) : jobs.length === 0 ? (
            <NoJobsFound />
          ) : (
            <div className="space-y-12">
              {featuredJobs.length > 0 && !filters.featuredOnly && (
                <div>
                  <h2 className="mb-6 flex items-center gap-2 text-lg font-bold uppercase tracking-tight text-white">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Featured Jobs
                  </h2>
                  <div className="space-y-4">
                    {featuredJobs.map((job) => (
                      <FeaturedJobCard
                        key={job.id}
                        job={job}
                        isSaved={savedJobIds.has(job.id)}
                        onSave={handleSaveJob}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                {!filters.featuredOnly && featuredJobs.length > 0 && (
                  <h2 className="mb-6 text-lg font-bold uppercase tracking-tight text-white">
                    All Jobs
                  </h2>
                )}
                <div className="space-y-4">
                  {(filters.featuredOnly ? jobs : regularJobs).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobIds.has(job.id)}
                      onSave={handleSaveJob}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {getVisiblePageNumbers(pagination.page, pagination.totalPages).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-10 w-10 text-sm font-semibold transition-colors ${
                      pageNum === pagination.page
                        ? "bg-white text-black"
                        : "text-neutral-500 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasMore}
                className="px-4 py-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
