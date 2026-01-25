"use client";

import { clsx } from "clsx";
import { Search, X } from "lucide-react";

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(
          "w-full py-3 pl-11 pr-10 text-sm",
          "bg-black border border-neutral-800 text-white",
          "placeholder:text-neutral-600",
          "focus:border-white focus:outline-none focus:ring-1 focus:ring-white",
          "transition-colors duration-150",
          className
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
