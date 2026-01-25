"use client";

import { clsx } from "clsx";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  onChange,
  className,
}: CheckboxProps) {
  return (
    <label
      className={clsx(
        "flex items-center gap-3 cursor-pointer group",
        className
      )}
      onClick={() => onChange(!checked)}
    >
      <div
        className={clsx(
          "w-5 h-5 border flex items-center justify-center transition-all",
          checked
            ? "bg-white border-white"
            : "bg-transparent border-neutral-700 group-hover:border-neutral-500"
        )}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
}
