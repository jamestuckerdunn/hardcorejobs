"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { MapPin, Bookmark, BookmarkCheck, ExternalLink, Zap } from "lucide-react";
import { Badge, RemoteBadge, SalaryBadge } from "@/components/ui/badge";
import type { Job } from "@/types";

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
          <img
            src={job.company_logo_url}
            alt={`${job.company_name} logo`}
            className="h-16 w-16 shrink-0 object-contain bg-neutral-900"
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
