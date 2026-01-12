"use client";

import { useState, useEffect, useCallback } from "react";
import { JobCard, FeaturedJobCard, Job } from "@/components/jobs/job-card";
import { JobFilters, QuickFilters, JobFilters as JobFiltersType } from "@/components/jobs/job-filters";
import { NoJobsFound, ErrorState } from "@/components/ui/empty-state";
import { JobCardSkeleton } from "@/components/ui/loading";
import { Zap, TrendingUp, MapPin, Building2, RefreshCw } from "lucide-react";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface JobsResponse {
  jobs: Job[];
  pagination: PaginationInfo;
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
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobs = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "20");

      if (filters.search) params.set("search", filters.search);
      if (filters.location && filters.location !== "remote") {
        params.set("location", filters.location.replace("-", " "));
      }
      if (filters.remoteType || filters.location === "remote") {
        params.set("remote_type", filters.remoteType || "remote");
      }
      if (filters.salaryMin) params.set("salary_min", filters.salaryMin);
      if (filters.featuredOnly) params.set("featured", "true");
      params.set("sort", filters.sortBy);

      const response = await fetch(`/api/jobs?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data: JobsResponse = await response.json();
      setJobs(data.jobs);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch jobs when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchJobs(1);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchJobs]);

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
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

  // Calculate stats
  const totalJobs = pagination?.total || jobs.length;
  const remoteCount = jobs.filter((j) => j.remote_type === "remote").length;
  const uniqueCompanies = new Set(jobs.map((j) => j.company_name)).size;
  const avgSalary = jobs.length > 0
    ? Math.round(jobs.reduce((sum, j) => sum + ((j.salary_min || 0) + (j.salary_max || 0)) / 2, 0) / jobs.length / 1000)
    : 0;

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="border-b border-neutral-800 bg-gradient-to-b from-neutral-950 to-black py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
              $100K+ Jobs
            </h1>
            <p className="mt-4 text-lg text-neutral-400">
              Browse {totalJobs.toLocaleString()}+ positions that don&apos;t require a degree
              or prior experience
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-neutral-800 bg-neutral-950 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-neutral-400">
              <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span>
                <strong className="text-white">{featuredJobs.length}</strong>{" "}
                Featured Jobs
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              <span>
                <strong className="text-white">${avgSalary || 127}K</strong> Avg Salary
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <MapPin className="h-4 w-4 text-blue-500" aria-hidden="true" />
              <span>
                <strong className="text-white">{remoteCount}</strong>{" "}
                Remote Positions
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Building2 className="h-4 w-4 text-purple-500" aria-hidden="true" />
              <span>
                <strong className="text-white">{uniqueCompanies}</strong>{" "}
                Companies Hiring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <JobFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
              jobCount={totalJobs}
            />
            <QuickFilters onSelect={handleQuickFilter} />
          </div>

          {/* Error State */}
          {error && (
            <ErrorState
              title="Failed to load jobs"
              description={error}
              action={
                <button
                  onClick={() => fetchJobs(currentPage)}
                  className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              }
            />
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && jobs.length === 0 && <NoJobsFound />}

          {/* Jobs List */}
          {!isLoading && !error && jobs.length > 0 && (
            <div className="space-y-12">
              {/* Featured Jobs */}
              {featuredJobs.length > 0 && !filters.featuredOnly && (
                <div>
                  <h2 className="mb-6 flex items-center gap-2 text-lg font-bold uppercase tracking-tight text-white">
                    <Zap className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    Featured Jobs
                  </h2>
                  <div className="space-y-4" role="list" aria-label="Featured job listings">
                    {featuredJobs.map((job) => (
                      <FeaturedJobCard
                        key={job.id}
                        job={job}
                        isSaved={savedJobs.has(job.id)}
                        onSave={handleSaveJob}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Jobs */}
              <div>
                {!filters.featuredOnly && featuredJobs.length > 0 && (
                  <h2 className="mb-6 text-lg font-bold uppercase tracking-tight text-white">
                    All Jobs
                  </h2>
                )}
                <div className="space-y-4" role="list" aria-label="Job listings">
                  {(filters.featuredOnly ? jobs : regularJobs).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobs.has(job.id)}
                      onSave={handleSaveJob}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <nav
              className="mt-12 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-10 w-10 text-sm font-semibold transition-colors ${
                        page === currentPage
                          ? "bg-white text-black"
                          : "text-neutral-500 hover:text-white"
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasMore}
                className="px-4 py-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
