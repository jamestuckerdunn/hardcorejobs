import { clsx } from "clsx";
import Link from "next/link";
import { Briefcase, Search, Heart, FileText, Bell, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center border border-neutral-800 text-neutral-600 mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold uppercase tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm text-neutral-500">{description}</p>
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function NoJobsFound() {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8" />}
      title="No Jobs Found"
      description="We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms."
      action={{ label: "Clear Filters", href: "/jobs" }}
    />
  );
}

export function NoSavedJobs() {
  return (
    <EmptyState
      icon={<Heart className="h-8 w-8" />}
      title="No Saved Jobs"
      description="You haven't saved any jobs yet. Browse jobs and click the heart icon to save them for later."
      action={{ label: "Browse Jobs", href: "/jobs" }}
    />
  );
}

export function NoApplications() {
  return (
    <EmptyState
      icon={<Briefcase className="h-8 w-8" />}
      title="No Applications"
      description="You haven't applied to any jobs yet. Start browsing and apply to positions that match your skills."
      action={{ label: "Find Jobs", href: "/jobs" }}
    />
  );
}

export function NoResume() {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8" />}
      title="No Resume Uploaded"
      description="Upload your resume to make it easier to apply to jobs and let employers find you."
      action={{ label: "Upload Resume", href: "/profile/resume" }}
    />
  );
}

export function NoAlerts() {
  return (
    <EmptyState
      icon={<Bell className="h-8 w-8" />}
      title="No Job Alerts"
      description="Set up job alerts to get notified when new positions matching your criteria are posted."
      action={{ label: "Create Alert", href: "/dashboard/alerts/new" }}
    />
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again later.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
      role="alert"
    >
      <div className="flex h-16 w-16 items-center justify-center border border-red-900 text-red-500 mb-6">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold uppercase tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm text-neutral-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
