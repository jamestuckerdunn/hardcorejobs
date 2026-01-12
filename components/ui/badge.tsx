import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  default: "bg-neutral-800 text-neutral-300 border-neutral-700",
  success: "bg-emerald-950 text-emerald-400 border-emerald-800",
  warning: "bg-amber-950 text-amber-400 border-amber-800",
  danger: "bg-red-950 text-red-400 border-red-800",
  info: "bg-blue-950 text-blue-400 border-blue-800",
  outline: "bg-transparent text-white border-white",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium uppercase tracking-wider border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function RemoteBadge({ type }: { type: "remote" | "hybrid" | "onsite" }) {
  const config = {
    remote: { label: "Remote", variant: "success" as const },
    hybrid: { label: "Hybrid", variant: "info" as const },
    onsite: { label: "On-site", variant: "default" as const },
  };

  const { label, variant } = config[type];

  return <Badge variant={variant}>{label}</Badge>;
}

export function FeaturedBadge() {
  return (
    <Badge variant="warning" className="animate-pulse">
      Featured
    </Badge>
  );
}

export function SalaryBadge({ min, max, currency = "USD" }: { min?: number; max?: number; currency?: string }) {
  const formatSalary = (amount: number) => {
    if (amount >= 1000) {
      return `$${Math.round(amount / 1000)}K`;
    }
    return `$${amount}`;
  };

  if (!min && !max) return null;

  let text = "";
  if (min && max) {
    text = `${formatSalary(min)} - ${formatSalary(max)}`;
  } else if (min) {
    text = `${formatSalary(min)}+`;
  } else if (max) {
    text = `Up to ${formatSalary(max)}`;
  }

  return (
    <Badge variant="success" size="lg">
      {text}
    </Badge>
  );
}
