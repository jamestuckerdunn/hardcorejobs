import Link from "next/link";
import {
  Briefcase,
  Bookmark,
  Eye,
  TrendingUp,
  ArrowRight,
  Plus,
  Zap,
  Shield,
} from "lucide-react";
import { StatsCard } from "@/components/ui/card";
import { getAppUrl } from "@/lib/env";

interface Job {
  id: string;
  title: string;
  company_name: string;
  salary_min?: number;
  salary_max?: number;
  is_featured: boolean;
}

async function getRecommendedJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${getAppUrl()}/api/jobs?limit=4`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.jobs || [];
  } catch {
    return [];
  }
}

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "Competitive";
  if (min && max) return `$${Math.round(min / 1000)}K - $${Math.round(max / 1000)}K`;
  if (min) return `$${Math.round(min / 1000)}K+`;
  return `Up to $${Math.round(max! / 1000)}K`;
}

export default async function DashboardPage() {
  const recommendedJobs = await getRecommendedJobs();
  const pledgeSigned = false; // Placeholder - would come from user profile API

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
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
              className="btn btn-primary px-6 py-3 text-sm"
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Pledge Banner */}
        {!pledgeSigned && (
          <div className="mb-8 border border-amber-900/50 bg-amber-950/20 p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-amber-500 shrink-0" aria-hidden="true" />
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
                href="/onboarding/pledge"
                className="btn btn-primary px-4 py-2 text-sm shrink-0"
              >
                Take Pledge
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            label="Applications"
            value={0}
            icon={<Briefcase className="h-5 w-5" />}
          />
          <StatsCard
            label="Saved Jobs"
            value={0}
            icon={<Bookmark className="h-5 w-5" />}
          />
          <StatsCard
            label="Profile Views"
            value={0}
            icon={<Eye className="h-5 w-5" />}
          />
          <StatsCard
            label="Interviews"
            value={0}
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Applications */}
            <div className="border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 p-6">
                <h2 className="text-lg font-bold uppercase tracking-tight text-white">
                  Recent Applications
                </h2>
              </div>
              <div className="p-12 text-center">
                <Briefcase className="h-8 w-8 text-neutral-700 mx-auto" aria-hidden="true" />
                <p className="mt-4 text-neutral-500">No applications yet</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Start applying to high-paying jobs today
                </p>
                <Link
                  href="/jobs"
                  className="btn btn-secondary mt-4 px-6 py-2 text-sm"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>

            {/* Recommended Jobs */}
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
              {recommendedJobs.length > 0 ? (
                <div className="divide-y divide-neutral-800">
                  {recommendedJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="flex items-center justify-between p-6 hover:bg-neutral-950 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {job.is_featured && (
                          <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
                        )}
                        <div>
                          <p className="font-semibold text-white">{job.title}</p>
                          <p className="text-sm text-neutral-500">{job.company_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-emerald-400">
                          {formatSalary(job.salary_min, job.salary_max)}
                        </span>
                        <ArrowRight className="h-4 w-4 text-neutral-600" aria-hidden="true" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Briefcase className="h-8 w-8 text-neutral-700 mx-auto" aria-hidden="true" />
                  <p className="mt-4 text-neutral-500">No jobs available</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    Check back soon for new opportunities
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                Profile Completion
              </h3>
              <div className="relative h-2 bg-neutral-800 mb-4">
                <div
                  className="absolute inset-y-0 left-0 bg-white"
                  style={{ width: "25%" }}
                />
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                <span className="text-white font-semibold">25%</span> complete
              </p>
              <p className="text-sm text-neutral-500 mb-4">
                Complete your profile to stand out to employers and get better job matches.
              </p>
              <Link
                href="/profile"
                className="btn btn-secondary w-full py-2 text-sm"
              >
                Complete Profile
              </Link>
            </div>

            {/* Saved Jobs */}
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                Saved Jobs
              </h3>
              <div className="p-6 text-center">
                <Bookmark className="h-6 w-6 text-neutral-700 mx-auto" aria-hidden="true" />
                <p className="mt-2 text-sm text-neutral-500">No saved jobs yet</p>
                <p className="mt-1 text-xs text-neutral-600">
                  Save jobs to review later
                </p>
              </div>
              <Link
                href="/jobs"
                className="block text-center text-sm font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
              >
                Find Jobs to Save
              </Link>
            </div>

            {/* Get Started CTA */}
            <div className="border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="font-bold text-white">Ready to Land Your Dream Job?</h3>
              <p className="mt-2 text-sm text-neutral-400">
                Browse $100K+ jobs that don&apos;t require experience or a degree.
              </p>
              <Link
                href="/jobs"
                className="btn btn-primary w-full mt-4 py-3 text-sm"
              >
                Browse All Jobs
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
