import { clsx } from "clsx";
import Link from "next/link";
import { Search, AlertCircle } from "lucide-react";

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
