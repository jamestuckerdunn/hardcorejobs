"use client";

import { useState } from "react";
import { SearchInput, Select, Checkbox } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";

export interface JobFilters {
  search: string;
  location: string;
  remoteType: string;
  salaryMin: string;
  sortBy: string;
  featuredOnly: boolean;
}

interface JobFiltersProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  onReset: () => void;
  jobCount?: number;
}

const locationOptions = [
  { value: "", label: "All Locations" },
  { value: "remote", label: "Remote" },
  { value: "new-york", label: "New York, NY" },
  { value: "san-francisco", label: "San Francisco, CA" },
  { value: "los-angeles", label: "Los Angeles, CA" },
  { value: "chicago", label: "Chicago, IL" },
  { value: "austin", label: "Austin, TX" },
  { value: "seattle", label: "Seattle, WA" },
  { value: "denver", label: "Denver, CO" },
  { value: "boston", label: "Boston, MA" },
  { value: "miami", label: "Miami, FL" },
];

const remoteOptions = [
  { value: "", label: "All Work Types" },
  { value: "remote", label: "Remote Only" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

const salaryOptions = [
  { value: "", label: "Any Salary" },
  { value: "100000", label: "$100K+" },
  { value: "125000", label: "$125K+" },
  { value: "150000", label: "$150K+" },
  { value: "175000", label: "$175K+" },
  { value: "200000", label: "$200K+" },
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "salary-high", label: "Highest Salary" },
  { value: "salary-low", label: "Lowest Salary" },
  { value: "featured", label: "Featured First" },
];

export function JobFilters({
  filters,
  onChange,
  onReset,
  jobCount,
}: JobFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.remoteType ||
    filters.salaryMin ||
    filters.featuredOnly;

  const updateFilter = <K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Main Search */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <SearchInput
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            onClear={() => updateFilter("search", "")}
            placeholder="Search jobs, companies, keywords..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsExpanded(!isExpanded)}
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
          >
            Filters
            {isExpanded ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={onReset}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border border-neutral-800 p-6 animate-slide-down">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Location"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              options={locationOptions}
            />
            <Select
              label="Work Type"
              value={filters.remoteType}
              onChange={(e) => updateFilter("remoteType", e.target.value)}
              options={remoteOptions}
            />
            <Select
              label="Minimum Salary"
              value={filters.salaryMin}
              onChange={(e) => updateFilter("salaryMin", e.target.value)}
              options={salaryOptions}
            />
            <Select
              label="Sort By"
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              options={sortOptions}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <Checkbox
              label="Show featured jobs only"
              checked={filters.featuredOnly}
              onChange={(checked) => updateFilter("featuredOnly", checked)}
            />
          </div>
        </div>
      )}

      {/* Results Count */}
      {jobCount !== undefined && (
        <div className="text-sm text-neutral-500">
          {jobCount === 0 ? (
            "No jobs found"
          ) : (
            <>
              Showing <span className="text-white font-semibold">{jobCount}</span>{" "}
              {jobCount === 1 ? "job" : "jobs"}
              {hasActiveFilters && " matching your criteria"}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Quick filter pills for common searches
interface QuickFiltersProps {
  onSelect: (filters: Partial<JobFilters>) => void;
}

export function QuickFilters({ onSelect }: QuickFiltersProps) {
  const quickFilters = [
    { label: "Remote", filters: { remoteType: "remote" } },
    { label: "$150K+", filters: { salaryMin: "150000" } },
    { label: "$200K+", filters: { salaryMin: "200000" } },
    { label: "San Francisco", filters: { location: "san-francisco" } },
    { label: "New York", filters: { location: "new-york" } },
    { label: "Featured", filters: { featuredOnly: true } },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-xs text-neutral-500 uppercase tracking-wider self-center mr-2">
        Quick:
      </span>
      {quickFilters.map((qf) => (
        <button
          key={qf.label}
          onClick={() => onSelect(qf.filters as Partial<JobFilters>)}
          className="px-3 py-1.5 text-xs font-medium border border-neutral-800 text-neutral-400 hover:border-white hover:text-white transition-colors"
        >
          {qf.label}
        </button>
      ))}
    </div>
  );
}
