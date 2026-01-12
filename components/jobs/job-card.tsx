"use client";

import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import {
  MapPin,
  Clock,
  Building2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Badge, RemoteBadge, SalaryBadge, FeaturedBadge } from "@/components/ui/badge";

export interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo_url?: string;
  location: string;
  remote_type?: "remote" | "hybrid" | "onsite";
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  description: string;
  requirements?: string;
  apply_url: string;
  is_featured?: boolean;
  posted_at: string;
  source: string;
}

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onSave?: (jobId: string) => void;
  showDescription?: boolean;
  className?: string;
}

export function JobCard({
  job,
  isSaved = false,
  onSave,
  showDescription = true,
  className,
}: JobCardProps) {
  const postedDate = new Date(job.posted_at);
  const now = new Date();
  const daysAgo = Math.floor(
    (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const timeAgo =
    daysAgo === 0
      ? "Today"
      : daysAgo === 1
      ? "Yesterday"
      : daysAgo < 7
      ? `${daysAgo}d ago`
      : daysAgo < 30
      ? `${Math.floor(daysAgo / 7)}w ago`
      : `${Math.floor(daysAgo / 30)}mo ago`;

  return (
    <div
      className={clsx(
        "group relative border border-neutral-800 bg-black p-6 transition-all duration-200",
        "hover:border-neutral-600 hover:bg-neutral-950",
        job.is_featured && "border-amber-900/50 bg-amber-950/10",
        className
      )}
    >
      {/* Featured indicator */}
      {job.is_featured && (
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
      )}

      <div className="flex items-start gap-4">
        {/* Company Logo */}
        {job.company_logo_url ? (
          <Image
            src={job.company_logo_url}
            alt={`${job.company_name} logo`}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 object-contain bg-neutral-900"
            unoptimized
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-neutral-900 text-lg font-bold text-neutral-600">
            {job.company_name.charAt(0)}
          </div>
        )}

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={`/jobs/${job.id}`}
                className="block text-lg font-bold text-white hover:underline truncate"
              >
                {job.title}
              </Link>
              <div className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="truncate">{job.company_name}</span>
              </div>
            </div>

            {/* Save Button */}
            {onSave && (
              <button
                onClick={() => onSave(job.id)}
                className={clsx(
                  "shrink-0 p-2 transition-colors",
                  isSaved
                    ? "text-white"
                    : "text-neutral-600 hover:text-white"
                )}
                aria-label={isSaved ? "Unsave job" : "Save job"}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {job.is_featured && <FeaturedBadge />}
            {job.salary_min && (
              <SalaryBadge
                min={job.salary_min}
                max={job.salary_max}
                currency={job.salary_currency}
              />
            )}
            {job.remote_type && <RemoteBadge type={job.remote_type} />}
            <Badge variant="default">
              <MapPin className="mr-1 h-3 w-3" />
              {job.location}
            </Badge>
          </div>

          {/* Description */}
          {showDescription && job.description && (
            <p className="mt-4 text-sm text-neutral-400 line-clamp-2">
              {job.description.replace(/<[^>]*>/g, "").substring(0, 200)}...
            </p>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </span>
              <span className="capitalize">{job.source}</span>
            </div>

            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white hover:text-neutral-300 transition-colors"
            >
              Apply Now
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Featured job card with more prominent styling
interface FeaturedJobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

export function FeaturedJobCard({ job, onSave, isSaved }: FeaturedJobCardProps) {
  return (
    <div className="relative border-2 border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-transparent p-8">
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
          <Zap className="h-3 w-3" />
          Featured
        </span>
      </div>

      <div className="flex items-start gap-6">
        {job.company_logo_url ? (
          <Image
            src={job.company_logo_url}
            alt={`${job.company_name} logo`}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 object-contain bg-neutral-900"
            unoptimized
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-neutral-900 text-2xl font-bold text-neutral-600">
            {job.company_name.charAt(0)}
          </div>
        )}

        <div className="flex-1">
          <Link
            href={`/jobs/${job.id}`}
            className="text-2xl font-bold text-white hover:underline"
          >
            {job.title}
          </Link>
          <p className="mt-1 text-neutral-400">{job.company_name}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {job.salary_min && (
              <SalaryBadge
                min={job.salary_min}
                max={job.salary_max}
                currency={job.salary_currency}
              />
            )}
            {job.remote_type && <RemoteBadge type={job.remote_type} />}
            <Badge variant="default">
              <MapPin className="mr-1 h-3 w-3" />
              {job.location}
            </Badge>
          </div>

          <p className="mt-4 text-neutral-400 line-clamp-3">
            {job.description.replace(/<[^>]*>/g, "").substring(0, 300)}...
          </p>

          <div className="mt-6 flex items-center gap-4">
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors"
            >
              Apply Now
              <ExternalLink className="h-4 w-4" />
            </a>
            {onSave && (
              <button
                onClick={() => onSave(job.id)}
                className={clsx(
                  "inline-flex items-center gap-2 border-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors",
                  isSaved
                    ? "border-white bg-white text-black"
                    : "border-white text-white hover:bg-white hover:text-black"
                )}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save Job
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
