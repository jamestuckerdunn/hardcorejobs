"use client";

import Link from "next/link";
import { clsx } from "clsx";
import {
  MapPin,
  Clock,
  Building2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react";
import { Badge, RemoteBadge, SalaryBadge, FeaturedBadge } from "@/components/ui/badge";
import type { Job } from "@/types";

function formatTimeAgo(postedAt: string): string {
  const postedDate = new Date(postedAt);
  const now = new Date();
  const daysAgo = Math.floor(
    (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return `${daysAgo}d ago`;
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}w ago`;
  return `${Math.floor(daysAgo / 30)}mo ago`;
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
  const timeAgo = formatTimeAgo(job.posted_at);

  return (
    <div
      className={clsx(
        "group relative border border-neutral-800 bg-black p-6 transition-all duration-200",
        "hover:border-neutral-600 hover:bg-neutral-950",
        job.is_featured && "border-amber-900/50 bg-amber-950/10",
        className
      )}
    >
      {job.is_featured && (
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
      )}

      <div className="flex items-start gap-4">
        {job.company_logo_url ? (
          <img
            src={job.company_logo_url}
            alt={`${job.company_name} logo`}
            className="h-12 w-12 shrink-0 object-contain bg-neutral-900"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-neutral-900 text-lg font-bold text-neutral-600">
            {job.company_name.charAt(0)}
          </div>
        )}

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

            {onSave && (
              <button
                onClick={() => onSave(job.id)}
                className={clsx(
                  "shrink-0 p-2 transition-colors",
                  isSaved ? "text-white" : "text-neutral-600 hover:text-white"
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

          {showDescription && job.description && (
            <p className="mt-4 text-sm text-neutral-400 line-clamp-2">
              {job.description.replace(/<[^>]*>/g, "").substring(0, 200)}...
            </p>
          )}

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
