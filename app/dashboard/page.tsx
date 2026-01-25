"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Bookmark,
  Bell,
  TrendingUp,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Zap,
  Shield,
} from "lucide-react";
import { StatsCard, StatsCardSkeleton } from "@/components/ui/card";
import type { DashboardStats, Application, SavedJob, Job, PledgeStatus } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-blue-950 text-blue-400",
  reviewed: "bg-purple-950 text-purple-400",
  interviewing: "bg-amber-950 text-amber-400",
  offered: "bg-emerald-950 text-emerald-400",
  rejected: "bg-red-950 text-red-400",
  withdrawn: "bg-neutral-800 text-neutral-400",
};

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

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    applications: 0,
    savedJobs: 0,
    profileViews: 0,
    interviews: 0,
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [pledgeStatus, setPledgeStatus] = useState<PledgeStatus>({
    signed: false,
    commitments: { relocate: false, hours: false, immediate: false, twoYears: false },
  });

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [statsRes, applicationsRes, savedRes, featuredRes, pledgeRes] = await Promise.all([
          fetch("/api/user/stats"),
          fetch("/api/user/applications"),
          fetch("/api/user/saved-jobs"),
          fetch("/api/jobs/featured"),
          fetch("/api/user/pledge"),
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats);
        }

        if (applicationsRes.ok) {
          const data = await applicationsRes.json();
          setRecentApplications(data.applications?.slice(0, 3) || []);
        }

        if (savedRes.ok) {
          const data = await savedRes.json();
          setSavedJobs(data.savedJobs?.slice(0, 2) || []);
        }

        if (featuredRes.ok) {
          const data = await featuredRes.json();
          setRecommendedJobs(data.jobs?.slice(0, 2) || []);
        }

        if (pledgeRes.ok) {
          const data = await pledgeRes.json();
          setPledgeStatus(data.pledge);
        }
      } catch {
        // Errors are handled by individual response checks above
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 text-neutral-400">
                Welcome back! Here&apos;s your job search overview.
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!pledgeStatus.signed && (
          <div className="mb-8 border border-amber-900/50 bg-amber-950/20 p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-amber-500 shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-white">
                  Take the Hardcore Pledge
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Stand out to employers by taking the pledge. Pledge-takers get
                  47% more profile views on average.
                </p>
              </div>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors shrink-0"
              >
                Take Pledge
              </Link>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {isLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <StatsCard
                label="Applications"
                value={stats.applications}
                icon={<Briefcase className="h-5 w-5" />}
              />
              <StatsCard
                label="Saved Jobs"
                value={stats.savedJobs}
                icon={<Bookmark className="h-5 w-5" />}
              />
              <StatsCard
                label="Profile Views"
                value={stats.profileViews}
                icon={<Eye className="h-5 w-5" />}
              />
              <StatsCard
                label="Interviews"
                value={stats.interviews}
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 p-6">
                <h2 className="text-lg font-bold uppercase tracking-tight text-white">
                  Recent Applications
                </h2>
                <Link
                  href="/dashboard/applications"
                  className="text-sm font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="divide-y divide-neutral-800">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/jobs/${app.job_id}`}
                    className="flex items-center justify-between p-6 hover:bg-neutral-950 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-neutral-900 text-sm font-bold text-neutral-600">
                        {(app.job?.company_name || "?").charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{app.job?.title || "Job"}</p>
                        <p className="text-sm text-neutral-500">{app.job?.company_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium uppercase ${
                          statusColors[app.status] || statusColors.pending
                        }`}
                      >
                        {app.status}
                      </span>
                      <span className="text-xs text-neutral-600">
                        {formatTimeAgo(app.applied_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {recentApplications.length === 0 && !isLoading && (
                <div className="p-12 text-center">
                  <Briefcase className="h-8 w-8 text-neutral-700 mx-auto" />
                  <p className="mt-4 text-neutral-500">No applications yet</p>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center justify-center border-2 border-white px-6 py-2 mt-4 text-sm font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>

            <div className="border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 p-6">
                <h2 className="text-lg font-bold uppercase tracking-tight text-white">
                  Recommended For You
                </h2>
                <Link
                  href="/jobs"
                  className="text-sm font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="divide-y divide-neutral-800">
                {recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="flex items-center justify-between p-6 hover:bg-neutral-950 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {job.is_featured && (
                        <Zap className="h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <p className="font-semibold text-white">{job.title}</p>
                        <p className="text-sm text-neutral-500">{job.company_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-emerald-400">
                        ${Math.round((job.salary_min || 0) / 1000)}K - ${Math.round((job.salary_max || 0) / 1000)}K
                      </span>
                      <ArrowRight className="h-4 w-4 text-neutral-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                Profile Completion
              </h3>
              <div className="relative h-2 bg-neutral-800 mb-4">
                <div
                  className="absolute inset-y-0 left-0 bg-white"
                  style={{ width: pledgeStatus.signed ? "100%" : "50%" }}
                />
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                <span className="text-white font-semibold">
                  {pledgeStatus.signed ? "100" : "50"}%
                </span>{" "}
                complete
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-neutral-400">Account created</span>
                </div>
                {pledgeStatus.signed ? (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-neutral-400">Pledge signed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-neutral-600" />
                    <span className="text-neutral-500">Sign the pledge</span>
                  </div>
                )}
              </div>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center w-full border-2 border-white mt-4 py-2 text-sm font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
              >
                Complete Profile
              </Link>
            </div>

            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                Saved Jobs
              </h3>
              <div className="space-y-4">
                {savedJobs.map((saved) => (
                  <Link
                    key={saved.id}
                    href={`/jobs/${saved.job_id}`}
                    className="block p-4 border border-neutral-800 hover:border-neutral-600 transition-colors"
                  >
                    <p className="font-semibold text-white text-sm">
                      {saved.job?.title}
                    </p>
                    <p className="text-xs text-neutral-500">{saved.job?.company_name}</p>
                    <p className="mt-2 text-xs font-medium text-emerald-400">
                      ${Math.round((saved.job?.salary_min || 0) / 1000)}K - ${Math.round((saved.job?.salary_max || 0) / 1000)}K
                    </p>
                  </Link>
                ))}
                {savedJobs.length === 0 && !isLoading && (
                  <p className="text-sm text-neutral-500 text-center py-4">
                    No saved jobs yet
                  </p>
                )}
              </div>
              <Link
                href="/dashboard/saved"
                className="block mt-4 text-center text-sm font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
              >
                View All Saved
              </Link>
            </div>

            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                Job Alerts
              </h3>
              <p className="text-sm text-neutral-400 mb-4">
                Get notified when new jobs match your criteria.
              </p>
              <Link
                href="/dashboard/alerts"
                className="inline-flex items-center justify-center w-full border-2 border-white py-2 text-sm font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
              >
                <Bell className="mr-2 h-4 w-4" />
                Manage Alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
