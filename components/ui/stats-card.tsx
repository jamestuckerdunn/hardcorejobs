import { clsx } from "clsx";
import { Card } from "./card-base";

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

export function StatsCardSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-3 w-20 bg-neutral-800" />
          <div className="mt-3 h-8 w-16 bg-neutral-800" />
        </div>
        <div className="h-10 w-10 bg-neutral-800" />
      </div>
    </Card>
  );
}
