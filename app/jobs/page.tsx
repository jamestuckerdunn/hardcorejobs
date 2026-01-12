"use client";

import { useState, useMemo } from "react";
import { JobCard, FeaturedJobCard, Job } from "@/components/jobs/job-card";
import { JobFilters, QuickFilters, JobFilters as JobFiltersType } from "@/components/jobs/job-filters";
import { NoJobsFound } from "@/components/ui/empty-state";
import { Zap, TrendingUp, MapPin, Building2 } from "lucide-react";

// Sample job data - in production this would come from the API
const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Sales Development Representative",
    company_name: "TechFlow Inc",
    location: "Remote",
    remote_type: "remote",
    salary_min: 120000,
    salary_max: 150000,
    description: "Join our high-growth sales team and help enterprise clients discover the power of automation. No prior sales experience required - we provide comprehensive training.",
    apply_url: "https://example.com/apply",
    is_featured: true,
    posted_at: new Date().toISOString(),
    source: "direct",
  },
  {
    id: "2",
    title: "Field Service Technician",
    company_name: "PowerGrid Systems",
    location: "Austin, TX",
    remote_type: "onsite",
    salary_min: 110000,
    salary_max: 140000,
    description: "Install, maintain, and repair industrial power systems. Full training provided. Must be willing to travel up to 75% of the time.",
    apply_url: "https://example.com/apply",
    is_featured: true,
    posted_at: new Date(Date.now() - 86400000).toISOString(),
    source: "direct",
  },
  {
    id: "3",
    title: "Insurance Sales Agent",
    company_name: "SecureLife Insurance",
    location: "Chicago, IL",
    remote_type: "hybrid",
    salary_min: 100000,
    salary_max: 200000,
    description: "Unlimited earning potential in insurance sales. We provide leads, training, and licensing support. Commission-based with guaranteed base.",
    apply_url: "https://example.com/apply",
    is_featured: false,
    posted_at: new Date(Date.now() - 172800000).toISOString(),
    source: "aggregated",
  },
  {
    id: "4",
    title: "Account Executive",
    company_name: "CloudBase Solutions",
    location: "San Francisco, CA",
    remote_type: "hybrid",
    salary_min: 130000,
    salary_max: 180000,
    description: "Close enterprise deals with Fortune 500 companies. Full sales methodology training provided. OTE potential of $250K+.",
    apply_url: "https://example.com/apply",
    is_featured: true,
    posted_at: new Date(Date.now() - 259200000).toISOString(),
    source: "direct",
  },
  {
    id: "5",
    title: "Equipment Operator",
    company_name: "Heavy Haul Logistics",
    location: "Denver, CO",
    remote_type: "onsite",
    salary_min: 105000,
    salary_max: 130000,
    description: "Operate heavy machinery for construction and logistics projects. CDL training provided. Union benefits and overtime opportunities.",
    apply_url: "https://example.com/apply",
    is_featured: false,
    posted_at: new Date(Date.now() - 345600000).toISOString(),
    source: "aggregated",
  },
  {
    id: "6",
    title: "Solar Installation Technician",
    company_name: "SunPower Installations",
    location: "Phoenix, AZ",
    remote_type: "onsite",
    salary_min: 100000,
    salary_max: 125000,
    description: "Install residential and commercial solar panel systems. No experience necessary - we train you on everything from electrical to roofing.",
    apply_url: "https://example.com/apply",
    is_featured: false,
    posted_at: new Date(Date.now() - 432000000).toISOString(),
    source: "aggregated",
  },
  {
    id: "7",
    title: "Customer Success Manager",
    company_name: "DataSync Corp",
    location: "Remote",
    remote_type: "remote",
    salary_min: 115000,
    salary_max: 145000,
    description: "Help our enterprise customers get maximum value from our platform. Strong communication skills required. Tech background not necessary.",
    apply_url: "https://example.com/apply",
    is_featured: false,
    posted_at: new Date(Date.now() - 518400000).toISOString(),
    source: "direct",
  },
  {
    id: "8",
    title: "Real Estate Agent",
    company_name: "Premier Properties",
    location: "Miami, FL",
    remote_type: "hybrid",
    salary_min: 100000,
    salary_max: 300000,
    description: "Join South Florida's fastest-growing brokerage. We provide leads, training, and licensing support. Top agents earn $500K+.",
    apply_url: "https://example.com/apply",
    is_featured: false,
    posted_at: new Date(Date.now() - 604800000).toISOString(),
    source: "aggregated",
  },
  {
    id: "9",
    title: "Wind Turbine Technician",
    company_name: "GreenEnergy Co",
    location: "Oklahoma City, OK",
    remote_type: "onsite",
    salary_min: 108000,
    salary_max: 135000,
    description: "Maintain and repair wind turbines across our Oklahoma wind farms. Full technical training provided. Must be comfortable with heights.",
    apply_url: "https://example.com/apply",
    is_featured: false,
    posted_at: new Date(Date.now() - 691200000).toISOString(),
    source: "aggregated",
  },
  {
    id: "10",
    title: "Business Development Representative",
    company_name: "SaaS Startup Inc",
    location: "New York, NY",
    remote_type: "hybrid",
    salary_min: 110000,
    salary_max: 160000,
    description: "Generate leads and book meetings for our enterprise sales team. Equity compensation included. Fast track to AE role.",
    apply_url: "https://example.com/apply",
    is_featured: false,
    posted_at: new Date(Date.now() - 777600000).toISOString(),
    source: "direct",
  },
];

const defaultFilters: JobFiltersType = {
  search: "",
  location: "",
  remoteType: "",
  salaryMin: "",
  sortBy: "recent",
  featuredOnly: false,
};

export default function JobsPage() {
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const handleQuickFilter = (quickFilters: Partial<JobFiltersType>) => {
    setFilters({ ...filters, ...quickFilters });
  };

  const filteredJobs = useMemo(() => {
    let result = [...sampleJobs];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company_name.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }

    // Location filter
    if (filters.location) {
      if (filters.location === "remote") {
        result = result.filter((job) => job.remote_type === "remote");
      } else {
        result = result.filter((job) =>
          job.location.toLowerCase().includes(filters.location.replace("-", " "))
        );
      }
    }

    // Remote type filter
    if (filters.remoteType) {
      result = result.filter((job) => job.remote_type === filters.remoteType);
    }

    // Salary filter
    if (filters.salaryMin) {
      const minSalary = parseInt(filters.salaryMin);
      result = result.filter(
        (job) => job.salary_min && job.salary_min >= minSalary
      );
    }

    // Featured only filter
    if (filters.featuredOnly) {
      result = result.filter((job) => job.is_featured);
    }

    // Sort
    switch (filters.sortBy) {
      case "salary-high":
        result.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
        break;
      case "salary-low":
        result.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
        break;
      case "featured":
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      case "recent":
      default:
        result.sort(
          (a, b) =>
            new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
        );
        break;
    }

    return result;
  }, [filters]);

  const featuredJobs = filteredJobs.filter((job) => job.is_featured);
  const regularJobs = filteredJobs.filter((job) => !job.is_featured);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="border-b border-neutral-800 bg-gradient-to-b from-neutral-950 to-black py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
              $100K+ Jobs
            </h1>
            <p className="mt-4 text-lg text-neutral-400">
              Browse {sampleJobs.length}+ positions that don&apos;t require a degree
              or prior experience
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-neutral-800 bg-neutral-950 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-neutral-400">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>
                <strong className="text-white">{featuredJobs.length}</strong>{" "}
                Featured Jobs
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>
                <strong className="text-white">$127K</strong> Avg Salary
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>
                <strong className="text-white">
                  {sampleJobs.filter((j) => j.remote_type === "remote").length}
                </strong>{" "}
                Remote Positions
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Building2 className="h-4 w-4 text-purple-500" />
              <span>
                <strong className="text-white">
                  {new Set(sampleJobs.map((j) => j.company_name)).size}
                </strong>{" "}
                Companies Hiring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <JobFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
              jobCount={filteredJobs.length}
            />
            <QuickFilters onSelect={handleQuickFilter} />
          </div>

          {filteredJobs.length === 0 ? (
            <NoJobsFound />
          ) : (
            <div className="space-y-12">
              {/* Featured Jobs */}
              {featuredJobs.length > 0 && !filters.featuredOnly && (
                <div>
                  <h2 className="mb-6 flex items-center gap-2 text-lg font-bold uppercase tracking-tight text-white">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Featured Jobs
                  </h2>
                  <div className="space-y-4">
                    {featuredJobs.map((job) => (
                      <FeaturedJobCard
                        key={job.id}
                        job={job}
                        isSaved={savedJobs.has(job.id)}
                        onSave={handleSaveJob}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Jobs */}
              <div>
                {!filters.featuredOnly && featuredJobs.length > 0 && (
                  <h2 className="mb-6 text-lg font-bold uppercase tracking-tight text-white">
                    All Jobs
                  </h2>
                )}
                <div className="space-y-4">
                  {(filters.featuredOnly ? filteredJobs : regularJobs).map(
                    (job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSaved={savedJobs.has(job.id)}
                        onSave={handleSaveJob}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pagination placeholder */}
          {filteredJobs.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button className="px-4 py-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors">
                Previous
              </button>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`h-10 w-10 text-sm font-semibold transition-colors ${
                      page === 1
                        ? "bg-white text-black"
                        : "text-neutral-500 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="px-4 py-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors">
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
