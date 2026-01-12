"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  ExternalLink,
  Filter,
} from "lucide-react";
import type { Application } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-blue-950 text-blue-400",
  reviewed: "bg-purple-950 text-purple-400",
  interviewing: "bg-amber-950 text-amber-400",
  offered: "bg-emerald-950 text-emerald-400",
  rejected: "bg-red-950 text-red-400",
  withdrawn: "bg-neutral-800 text-neutral-400",
};

const statusLabels: Record<string, string> = {
  pending: "Pending Review",
  reviewed: "Reviewed",
  interviewing: "Interviewing",
  offered: "Offer Received",
  rejected: "Not Selected",
  withdrawn: "Withdrawn",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ApplicationsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border border-neutral-800 p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-neutral-800" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/2 bg-neutral-800" />
              <div className="h-4 w-1/3 bg-neutral-900" />
            </div>
            <div className="h-6 w-24 bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ApplicationWithJob extends Application {
  job_title?: string;
  company_name?: string;
  company_logo_url?: string;
  location?: string;
  remote_type?: string;
  salary_min?: number;
  salary_max?: number;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchApplications() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/applications");
        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications || []);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const filteredApplications = statusFilter === "all"
    ? applications
    : applications.filter((app) => app.status === statusFilter);

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-black min-h-screen">
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            My Applications
          </h1>
          <p className="mt-1 text-neutral-400">
            Track and manage your job applications
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <div className="border border-neutral-800 p-4 text-center">
            <p className="text-2xl font-black text-white">{applications.length}</p>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Total</p>
          </div>
          <div className="border border-neutral-800 p-4 text-center">
            <p className="text-2xl font-black text-blue-400">{statusCounts.pending || 0}</p>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Pending</p>
          </div>
          <div className="border border-neutral-800 p-4 text-center">
            <p className="text-2xl font-black text-amber-400">{statusCounts.interviewing || 0}</p>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Interviewing</p>
          </div>
          <div className="border border-neutral-800 p-4 text-center">
            <p className="text-2xl font-black text-emerald-400">{statusCounts.offered || 0}</p>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Offers</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="h-4 w-4 text-neutral-500" />
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "reviewed", "interviewing", "offered", "rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    statusFilter === status
                      ? "bg-white text-black"
                      : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                  }`}
                >
                  {status === "all" ? "All" : statusLabels[status] || status}
                </button>
              )
            )}
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <ApplicationsSkeleton />
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="border border-neutral-800 p-6 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-neutral-900 text-lg font-bold text-neutral-600">
                    {(app.company_name || "?").charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/jobs/${app.job_id}`}
                          className="font-semibold text-white hover:underline"
                        >
                          {app.job_title || app.job?.title || "Job"}
                        </Link>
                        <p className="text-sm text-neutral-400">
                          {app.company_name || app.job?.company_name}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-1 text-xs font-medium uppercase ${
                          statusColors[app.status] || statusColors.pending
                        }`}
                      >
                        {statusLabels[app.status] || app.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      {(app.location || app.job?.location) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {app.location || app.job?.location}
                        </span>
                      )}
                      {(app.salary_min || app.job?.salary_min) && (
                        <span className="text-emerald-400">
                          ${Math.round((app.salary_min || app.job?.salary_min || 0) / 1000)}K - $
                          {Math.round((app.salary_max || app.job?.salary_max || 0) / 1000)}K
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Applied {formatDate(app.applied_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/jobs/${app.job_id}`}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                  >
                    View Job
                  </Link>
                  {app.job?.apply_url && (
                    <a
                      href={app.job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                    >
                      Company Site
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-neutral-800 p-12 text-center">
            <Briefcase className="h-12 w-12 text-neutral-700 mx-auto" />
            <h3 className="mt-4 text-lg font-bold text-white">No Applications Yet</h3>
            <p className="mt-2 text-neutral-400">
              Start applying to jobs to track your progress here.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center bg-white px-6 py-3 mt-6 text-sm font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
