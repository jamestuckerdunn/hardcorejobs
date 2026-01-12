import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Clock,
  Building2,
  Bookmark,
  Share2,
  DollarSign,
  Briefcase,
  Users,
  Globe,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge, RemoteBadge, SalaryBadge } from "@/components/ui/badge";
import { getAppUrl } from "@/lib/env";

interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo_url?: string;
  company_website?: string;
  company_description?: string;
  company_size?: string;
  industry?: string;
  location: string;
  remote_type: "remote" | "hybrid" | "onsite";
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  description: string;
  requirements?: string;
  apply_url: string;
  is_featured: boolean;
  posted_at: string;
  source: string;
  verified?: boolean;
}

interface SimilarJob {
  id: string;
  title: string;
  company_name: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  remote_type: string;
}

async function getJob(id: string): Promise<{ job: Job; similarJobs: SimilarJob[] } | null> {
  try {
    const response = await fetch(`${getAppUrl()}/api/jobs/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "Competitive";
  if (min && max) return `$${Math.round(min / 1000)}K - $${Math.round(max / 1000)}K`;
  if (min) return `$${Math.round(min / 1000)}K+`;
  return `Up to $${Math.round(max! / 1000)}K`;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getJob(id);

  if (!data || !data.job) {
    notFound();
  }

  const { job, similarJobs } = data;

  const postedDate = new Date(job.posted_at);
  const now = new Date();
  const daysAgo = Math.floor(
    (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-black min-h-screen">
      {/* Back Link */}
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="border border-neutral-800 p-8">
              {job.is_featured && (
                <div className="mb-4 inline-flex items-center gap-2 bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                  <Zap className="h-3 w-3" />
                  Featured Position
                </div>
              )}

              <div className="flex items-start gap-6">
                {job.company_logo_url ? (
                  <img
                    src={job.company_logo_url}
                    alt={job.company_name}
                    className="h-16 w-16 shrink-0 object-contain bg-neutral-900"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-neutral-900 text-2xl font-bold text-neutral-600">
                    {job.company_name.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                    {job.title}
                  </h1>
                  <p className="mt-2 text-lg text-neutral-400">
                    {job.company_name}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <SalaryBadge
                      min={job.salary_min}
                      max={job.salary_max}
                      currency={job.salary_currency}
                    />
                    <RemoteBadge type={job.remote_type} />
                    <Badge>
                      <MapPin className="mr-1 h-3 w-3" />
                      {job.location}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary px-8 py-4 text-base flex-1 sm:flex-none"
                >
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <button className="btn btn-secondary px-6 py-4 text-base">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </button>
                <button className="btn btn-ghost px-6 py-4 text-base">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="border border-neutral-800 p-4">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <p className="mt-2 text-sm text-neutral-500">Salary Range</p>
                <p className="font-semibold text-white">
                  {formatSalary(job.salary_min, job.salary_max)}
                </p>
              </div>
              <div className="border border-neutral-800 p-4">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <p className="mt-2 text-sm text-neutral-500">Experience</p>
                <p className="font-semibold text-white">Entry Level</p>
              </div>
              <div className="border border-neutral-800 p-4">
                <Globe className="h-5 w-5 text-purple-500" />
                <p className="mt-2 text-sm text-neutral-500">Work Type</p>
                <p className="font-semibold text-white capitalize">
                  {job.remote_type}
                </p>
              </div>
              <div className="border border-neutral-800 p-4">
                <Clock className="h-5 w-5 text-amber-500" />
                <p className="mt-2 text-sm text-neutral-500">Posted</p>
                <p className="font-semibold text-white">
                  {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                </p>
              </div>
            </div>

            {/* Job Description */}
            <div className="mt-8 border border-neutral-800 p-8">
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-6">
                Job Description
              </h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Requirements */}
            <div className="mt-6 border border-neutral-800 p-8">
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-4">
                Requirements
              </h2>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-neutral-400">{job.requirements}</p>
              </div>
            </div>

            {/* No Experience Notice */}
            <div className="mt-6 border border-emerald-900/50 bg-emerald-950/20 p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-white">
                    No Experience Required
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    This position does not require prior work experience or a
                    college degree. The employer provides comprehensive training
                    for all new hires.
                  </p>
                </div>
              </div>
            </div>

            {/* Apply CTA */}
            <div className="mt-8 border border-neutral-800 bg-neutral-950 p-8 text-center">
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                Ready to Apply?
              </h3>
              <p className="mt-2 text-neutral-400">
                Don&apos;t wait - apply now and take the first step toward your
                $100K+ career.
              </p>
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-6 px-10 py-4 text-base"
              >
                Apply for This Position
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                About the Company
              </h3>
              <div className="flex items-center gap-4 mb-4">
                {job.company_logo_url ? (
                  <img
                    src={job.company_logo_url}
                    alt={job.company_name}
                    className="h-12 w-12 object-contain bg-neutral-900"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center bg-neutral-900 text-lg font-bold text-neutral-600">
                    {job.company_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{job.company_name}</p>
                  {job.company_website && (
                    <a
                      href={job.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
              {job.company_description && (
                <p className="text-sm text-neutral-400 mb-4">
                  {job.company_description}
                </p>
              )}
              {(job.company_size || job.industry) && (
                <div className="space-y-2 text-sm">
                  {job.company_size && (
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Users className="h-4 w-4" aria-hidden="true" />
                      <span>{job.company_size}</span>
                    </div>
                  )}
                  {job.industry && (
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                      <span>{job.industry}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Similar Jobs */}
            {similarJobs && similarJobs.length > 0 && (
              <div className="border border-neutral-800 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                  Similar Jobs
                </h3>
                <div className="space-y-4">
                  {similarJobs.map((sj) => (
                    <Link
                      key={sj.id}
                      href={`/jobs/${sj.id}`}
                      className="block p-4 border border-neutral-800 hover:border-neutral-600 transition-colors"
                    >
                      <p className="font-semibold text-white">{sj.title}</p>
                      <p className="text-sm text-neutral-500">{sj.company_name}</p>
                      <p className="mt-2 text-sm font-medium text-emerald-400">
                        {formatSalary(sj.salary_min, sj.salary_max)}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/jobs"
                  className="block mt-4 text-center text-sm font-semibold uppercase tracking-wider text-white hover:text-neutral-300 transition-colors"
                >
                  View All Jobs
                </Link>
              </div>
            )}

            {/* Job Alert CTA */}
            <div className="border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="font-bold text-white">Get Job Alerts</h3>
              <p className="mt-2 text-sm text-neutral-400">
                Be the first to know when similar positions are posted.
              </p>
              <Link
                href="/sign-up"
                className="btn btn-secondary mt-4 w-full py-3 text-sm"
              >
                Create Alert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
