"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { Zap } from "lucide-react";
import type { Job } from "@/types";

interface JobCardCompactProps {
  job: Job;
  className?: string;
}

export function JobCardCompact({ job, className }: JobCardCompactProps) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className={clsx(
        "block border border-neutral-800 p-4 transition-all duration-200",
        "hover:border-neutral-600 hover:bg-neutral-950",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {job.company_logo_url ? (
          <img
            src={job.company_logo_url}
            alt={`${job.company_name} logo`}
            className="h-8 w-8 shrink-0 object-contain bg-neutral-900"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-neutral-900 text-sm font-bold text-neutral-600">
            {job.company_name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{job.title}</p>
          <p className="text-xs text-neutral-500 truncate">{job.company_name}</p>
        </div>
        {job.is_featured && (
          <Zap className="h-4 w-4 shrink-0 text-amber-500 ml-auto" />
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {job.salary_min && (
          <span className="text-xs font-medium text-emerald-400">
            ${Math.round(job.salary_min / 1000)}K+
          </span>
        )}
        <span className="text-xs text-neutral-600">•</span>
        <span className="text-xs text-neutral-500">{job.location}</span>
      </div>
    </Link>
  );
}
