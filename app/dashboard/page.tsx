import Link from "next/link";
import {
  Briefcase,
  Bookmark,
  FileText,
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
import { StatsCard } from "@/components/ui/card";

// Sample data - in production this would come from the database
const stats = {
  applications: 12,
  savedJobs: 8,
  profileViews: 47,
  interviews: 3,
};

const recentApplications = [
  {
    id: "1",
    title: "Sales Development Representative",
    company: "TechFlow Inc",
    status: "interviewing",
    appliedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Field Service Technician",
    company: "PowerGrid Systems",
    status: "applied",
    appliedAt: "5 days ago",
  },
  {
    id: "3",
    title: "Customer Success Manager",
    company: "DataSync Corp",
    status: "applied",
    appliedAt: "1 week ago",
  },
];

const savedJobs = [
  {
    id: "4",
    title: "Account Executive",
    company: "CloudBase",
    salary: "$130K - $180K",
  },
  {
    id: "5",
    title: "Insurance Sales Agent",
    company: "SecureLife",
    salary: "$100K - $200K",
  },
];

const recommendedJobs = [
  {
    id: "6",
    title: "Business Development Rep",
    company: "SaaS Startup",
    salary: "$110K - $160K",
    featured: true,
  },
  {
    id: "7",
    title: "Solar Installation Tech",
    company: "SunPower",
    salary: "$100K - $125K",
    featured: false,
  },
];

const statusColors = {
  applied: "bg-blue-950 text-blue-400",
  interviewing: "bg-amber-950 text-amber-400",
  offered: "bg-emerald-950 text-emerald-400",
  rejected: "bg-red-950 text-red-400",
};

export default function DashboardPage() {
  const pledgeSigned = true; // In production, check user profile

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
              <Plus className="mr-2 h-4 w-4" />
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
            value={stats.applications}
            icon={<Briefcase className="h-5 w-5" />}
            change={{ value: 20, type: "increase" }}
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
            change={{ value: 15, type: "increase" }}
          />
          <StatsCard
            label="Interviews"
            value={stats.interviews}
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
                    href={`/dashboard/applications/${app.id}`}
                    className="flex items-center justify-between p-6 hover:bg-neutral-950 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-neutral-900 text-sm font-bold text-neutral-600">
                        {app.company.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{app.title}</p>
                        <p className="text-sm text-neutral-500">{app.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium uppercase ${
                          statusColors[app.status as keyof typeof statusColors]
                        }`}
                      >
                        {app.status}
                      </span>
                      <span className="text-xs text-neutral-600">
                        {app.appliedAt}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {recentApplications.length === 0 && (
                <div className="p-12 text-center">
                  <Briefcase className="h-8 w-8 text-neutral-700 mx-auto" />
                  <p className="mt-4 text-neutral-500">No applications yet</p>
                  <Link
                    href="/jobs"
                    className="btn btn-secondary mt-4 px-6 py-2 text-sm"
                  >
                    Browse Jobs
                  </Link>
                </div>
              )}
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
              <div className="divide-y divide-neutral-800">
                {recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="flex items-center justify-between p-6 hover:bg-neutral-950 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {job.featured && (
                        <Zap className="h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <p className="font-semibold text-white">{job.title}</p>
                        <p className="text-sm text-neutral-500">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-emerald-400">
                        {job.salary}
                      </span>
                      <ArrowRight className="h-4 w-4 text-neutral-600" />
                    </div>
                  </Link>
                ))}
              </div>
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
                  style={{ width: "75%" }}
                />
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                <span className="text-white font-semibold">75%</span> complete
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-neutral-400">Basic info added</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-neutral-400">Resume uploaded</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-neutral-600" />
                  <span className="text-neutral-500">Add work preferences</span>
                </div>
              </div>
              <Link
                href="/profile"
                className="btn btn-secondary w-full mt-4 py-2 text-sm"
              >
                Complete Profile
              </Link>
            </div>

            {/* Saved Jobs */}
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                Saved Jobs
              </h3>
              <div className="space-y-4">
                {savedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block p-4 border border-neutral-800 hover:border-neutral-600 transition-colors"
                  >
                    <p className="font-semibold text-white text-sm">
                      {job.title}
                    </p>
                    <p className="text-xs text-neutral-500">{job.company}</p>
                    <p className="mt-2 text-xs font-medium text-emerald-400">
                      {job.salary}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                href="/dashboard/saved"
                className="block mt-4 text-center text-sm font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
              >
                View All Saved
              </Link>
            </div>

            {/* Job Alerts */}
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                Job Alerts
              </h3>
              <p className="text-sm text-neutral-400 mb-4">
                Get notified when new jobs match your criteria.
              </p>
              <Link
                href="/dashboard/alerts"
                className="btn btn-secondary w-full py-2 text-sm"
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
