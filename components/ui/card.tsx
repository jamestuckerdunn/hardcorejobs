import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-black border border-neutral-800 transition-all duration-200",
        hover && "hover:border-neutral-600",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
}

export function StatsCard({ label, value, change, icon }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
          {change && (
            <p
              className={clsx(
                "mt-1 text-xs font-medium",
                change.type === "increase" ? "text-emerald-400" : "text-red-400"
              )}
            >
              {change.type === "increase" ? "+" : "-"}
              {Math.abs(change.value)}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center bg-neutral-900 text-neutral-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
