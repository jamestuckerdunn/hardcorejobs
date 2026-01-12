import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  GraduationCap,
  Briefcase,
  MapPin,
  Target,
  Zap,
  Shield,
  TrendingUp,
  ChevronRight,
  Star,
  Building2,
  Globe,
  CheckCircle2,
} from "lucide-react";

interface FeaturedJob {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  remote_type: "remote" | "hybrid" | "onsite";
  is_featured: boolean;
}

async function getFeaturedJobs(): Promise<FeaturedJob[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/jobs?featured=true&limit=3`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.jobs || [];
  } catch {
    return [];
  }
}

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "Competitive";
  if (min && max) return `$${Math.round(min / 1000)}K - $${Math.round(max / 1000)}K`;
  if (min) return `$${Math.round(min / 1000)}K+`;
  return `Up to $${Math.round((max || 0) / 1000)}K`;
}

export default async function Home() {
  const featuredJobs = await getFeaturedJobs();

  // Fallback jobs if none in database yet
  const displayJobs = featuredJobs.length > 0 ? featuredJobs : [
    {
      id: "demo-1",
      title: "Sales Development Representative",
      company_name: "TechFlow Inc",
      location: "Remote",
      salary_min: 120000,
      salary_max: 150000,
      remote_type: "remote" as const,
      is_featured: true,
    },
    {
      id: "demo-2",
      title: "Field Service Technician",
      company_name: "PowerGrid Systems",
      location: "Austin, TX",
      salary_min: 110000,
      salary_max: 140000,
      remote_type: "onsite" as const,
      is_featured: true,
    },
    {
      id: "demo-3",
      title: "Insurance Sales Agent",
      company_name: "SecureLife",
      location: "Chicago, IL",
      salary_min: 100000,
      salary_max: 200000,
      remote_type: "hybrid" as const,
      is_featured: false,
    },
  ];

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-800">
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 -z-10 opacity-20 bg-grid" />

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 animate-fade-down">
              <Zap className="h-3 w-3 text-amber-500" aria-hidden="true" />
              <span>500+ Jobs Available Now</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl font-black uppercase tracking-tight text-white sm:text-7xl lg:text-8xl animate-fade-up">
              <span className="block">$100K+ Jobs</span>
              <span className="block mt-2 bg-gradient-to-r from-white via-neutral-400 to-white bg-clip-text text-transparent animate-text-gradient">
                Zero Experience
              </span>
            </h1>

            <p className="mt-8 text-lg text-neutral-400 sm:text-xl max-w-2xl mx-auto animate-fade-up delay-200">
              We aggregate high-paying positions that don&apos;t require a degree or
              prior experience. For those willing to work hard and relocate
              anywhere.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up delay-300">
              <Link
                href="/jobs"
                className="group btn btn-primary w-full px-8 py-4 text-base sm:w-auto"
              >
                Browse All Jobs
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/sign-up"
                className="btn btn-secondary w-full px-8 py-4 text-base sm:w-auto"
              >
                Take the Pledge
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-500 animate-fade-up delay-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span>No degree required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span>Entry-level friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span>$100K+ salaries only</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                Featured Jobs
              </h2>
              <p className="mt-2 text-neutral-400">
                Hand-picked opportunities with top employers
              </p>
            </div>
            <Link
              href="/jobs"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white hover:text-neutral-300 transition-colors"
            >
              View All Jobs
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Featured job listings">
            {displayJobs.map((job, i) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className={`group card card-lift p-6 ${
                  job.is_featured ? "border-amber-900/50 bg-amber-950/10" : ""
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
                role="listitem"
              >
                {job.is_featured && (
                  <div className="mb-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-amber-500">
                    <Zap className="h-3 w-3" aria-hidden="true" />
                    Featured
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-neutral-900 text-lg font-bold text-neutral-600" aria-hidden="true">
                    {job.company_name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white group-hover:underline truncate">
                      {job.title}
                    </h3>
                    <p className="text-sm text-neutral-400">{job.company_name}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-emerald-950 px-2 py-1 text-xs font-medium text-emerald-400">
                    {formatSalary(job.salary_min, job.salary_max)}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-400">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {job.location}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/jobs"
              className="btn btn-secondary px-6 py-3 text-sm"
            >
              View All Jobs
              <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Why HARDCOREJOBS?
            </h2>
            <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
              We&apos;re not like other job boards. We focus exclusively on
              high-paying opportunities that don&apos;t require traditional credentials.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="card card-glow p-8 text-center hover-lift">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-neutral-800 text-white">
                <DollarSign className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-lg font-bold uppercase tracking-tight text-white">
                $100K+ Minimum
              </h3>
              <p className="mt-3 text-sm text-neutral-400">
                Every job pays at least $100,000 per year. No lowball offers.
              </p>
            </div>

            <div className="card card-glow p-8 text-center hover-lift">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-neutral-800 text-white">
                <GraduationCap className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-lg font-bold uppercase tracking-tight text-white">
                No Degree Required
              </h3>
              <p className="mt-3 text-sm text-neutral-400">
                Skip the student debt. Skills and drive over credentials.
              </p>
            </div>

            <div className="card card-glow p-8 text-center hover-lift">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-neutral-800 text-white">
                <Briefcase className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-lg font-bold uppercase tracking-tight text-white">
                Zero Experience
              </h3>
              <p className="mt-3 text-sm text-neutral-400">
                Entry-level doesn&apos;t mean entry pay. Start at the top.
              </p>
            </div>

            <div className="card card-glow p-8 text-center hover-lift">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-neutral-800 text-white">
                <Globe className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-lg font-bold uppercase tracking-tight text-white">
                Remote & On-site
              </h3>
              <p className="mt-3 text-sm text-neutral-400">
                Work from anywhere or relocate for the right opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-neutral-800 bg-neutral-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div className="group">
              <p className="text-5xl font-black text-white sm:text-6xl group-hover:scale-110 transition-transform">
                500<span className="text-neutral-600">+</span>
              </p>
              <p className="mt-3 text-sm uppercase tracking-wider text-neutral-500">
                Active Jobs
              </p>
            </div>
            <div className="group">
              <p className="text-5xl font-black text-white sm:text-6xl group-hover:scale-110 transition-transform">
                $127K
              </p>
              <p className="mt-3 text-sm uppercase tracking-wider text-neutral-500">
                Average Salary
              </p>
            </div>
            <div className="group">
              <p className="text-5xl font-black text-white sm:text-6xl group-hover:scale-110 transition-transform">
                10K<span className="text-neutral-600">+</span>
              </p>
              <p className="mt-3 text-sm uppercase tracking-wider text-neutral-500">
                Hardcore Job Seekers
              </p>
            </div>
            <div className="group">
              <p className="text-5xl font-black text-white sm:text-6xl group-hover:scale-110 transition-transform">
                48<span className="text-neutral-600">hrs</span>
              </p>
              <p className="mt-3 text-sm uppercase tracking-wider text-neutral-500">
                Avg Time to Interview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
              Get from zero to $100K+ in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="absolute -left-4 top-0 text-8xl font-black text-neutral-900" aria-hidden="true">
                1
              </div>
              <div className="relative pt-4 pl-8">
                <div className="flex h-12 w-12 items-center justify-center bg-white text-black">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-bold uppercase tracking-tight text-white">
                  Take the Pledge
                </h3>
                <p className="mt-3 text-neutral-400">
                  Sign up and take the Hardcore Pledge to show employers you&apos;re
                  committed, willing to relocate, and ready to work hard.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 text-8xl font-black text-neutral-900" aria-hidden="true">
                2
              </div>
              <div className="relative pt-4 pl-8">
                <div className="flex h-12 w-12 items-center justify-center bg-white text-black">
                  <Briefcase className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-bold uppercase tracking-tight text-white">
                  Apply to Jobs
                </h3>
                <p className="mt-3 text-neutral-400">
                  Browse our curated list of $100K+ jobs that don&apos;t require
                  degrees or experience. Apply directly to employers.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 text-8xl font-black text-neutral-900" aria-hidden="true">
                3
              </div>
              <div className="relative pt-4 pl-8">
                <div className="flex h-12 w-12 items-center justify-center bg-white text-black">
                  <TrendingUp className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-bold uppercase tracking-tight text-white">
                  Land Your Job
                </h3>
                <p className="mt-3 text-neutral-400">
                  Get interviews faster because employers know pledge-takers are
                  serious. Start earning $100K+ with no degree required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Pledge Section */}
      <section className="border-b border-neutral-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black mb-6">
                <Shield className="h-4 w-4" aria-hidden="true" />
                The Hardcore Pledge
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
                Separate Yourself From The Pack
              </h2>
              <p className="mt-6 text-lg text-neutral-400">
                Our job seekers aren&apos;t just looking for jobs. They&apos;re committed to
                excellence. When you take the pledge, employers know you&apos;re
                serious about success.
              </p>
              <Link
                href="/sign-up"
                className="btn btn-primary mt-8 px-8 py-4 text-base"
              >
                Take the Pledge
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                {
                  num: 1,
                  title: "Willing to relocate anywhere",
                  desc: "Opportunity doesn't wait. Neither do you.",
                },
                {
                  num: 2,
                  title: "Ready for 60+ hour weeks",
                  desc: "Success demands sacrifice. You understand that.",
                },
                {
                  num: 3,
                  title: "Available to start immediately",
                  desc: "When they call, you're ready.",
                },
                {
                  num: 4,
                  title: "Committed for 2+ years",
                  desc: "You're building a career, not padding a resume.",
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="card flex items-start gap-4 p-6 hover-lift"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-sm font-bold text-black" aria-hidden="true">
                    {item.num}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-neutral-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Success Stories
            </h2>
            <p className="mt-4 text-neutral-400">
              Real people who went from zero experience to six-figure careers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "I was working retail making $35K. Now I'm a sales rep making $140K. The pledge opened doors I didn't know existed.",
                name: "Marcus Johnson",
                role: "Sales Representative",
                company: "TechFlow Inc",
              },
              {
                quote:
                  "No CS degree, no bootcamp. Just hustle. HARDCOREJOBS connected me with a company that valued my drive over credentials.",
                name: "Sarah Kim",
                role: "Customer Success Manager",
                company: "CloudBase",
              },
              {
                quote:
                  "I relocated from Ohio to Austin for my first tech job. Best decision I ever made. $120K right out of the gate.",
                name: "David Chen",
                role: "Field Engineer",
                company: "PowerGrid Systems",
              },
            ].map((testimonial, i) => (
              <article key={i} className="card p-8 hover-lift">
                <div className="flex gap-1 mb-4" aria-label="5 star rating">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-500 text-amber-500"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="text-neutral-300 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-neutral-800 text-lg font-bold text-white" aria-hidden="true">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-neutral-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 border border-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-6">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                For Employers
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
                Hire Candidates Who Are Ready to Prove Themselves
              </h2>
              <p className="mt-6 text-lg text-neutral-400">
                Access a database of candidates who have taken the Hardcore
                Pledge. These aren&apos;t passive job seekers—they&apos;re committed,
                driven, and ready to work.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Post featured jobs for $99",
                  "Access resume database for $199/mo",
                  "Filter by pledge commitment level",
                  "No credential gatekeeping",
                  "48-hour average response time",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-300">
                    <span className="flex h-6 w-6 items-center justify-center bg-white text-xs font-bold text-black" aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/sign-up?role=employer"
                  className="btn btn-primary px-8 py-4 text-base"
                >
                  Post a Job
                </Link>
                <Link
                  href="/pricing"
                  className="btn btn-secondary px-8 py-4 text-base"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="card p-8 lg:p-12">
              <blockquote className="text-xl italic text-neutral-300">
                &ldquo;We&apos;ve hired three people through HARDCOREJOBS. All of them
                outperform candidates we&apos;ve found through traditional
                channels. The pledge means something.&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-14 w-14 bg-neutral-800 flex items-center justify-center text-xl font-bold" aria-hidden="true">
                  S
                </div>
                <div>
                  <p className="font-semibold text-white">Sarah Chen</p>
                  <p className="text-sm text-neutral-500">
                    VP of Engineering, TechCorp
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-neutral-800">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-black text-white">47%</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
                      Faster Hiring
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">3x</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
                      Better Retention
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">89%</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
                      Satisfaction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Do I really need zero experience?",
                a: "Yes! All jobs on HARDCOREJOBS are entry-level positions that don't require prior work experience in the field. Employers are looking for drive and willingness to learn.",
              },
              {
                q: "What types of jobs pay $100K+ without experience?",
                a: "Sales roles (SDRs, AEs), field service technicians, insurance agents, real estate, equipment operators, and many more. The common thread is they reward hustle.",
              },
              {
                q: "What is the Hardcore Pledge?",
                a: "It's a commitment that signals to employers you're serious. Pledge-takers agree to relocate anywhere, work hard, start immediately, and commit for at least 2 years.",
              },
              {
                q: "Is the Hardcore Pledge mandatory?",
                a: "No, but pledge-takers get priority visibility to employers and often receive faster responses. It's a competitive advantage.",
              },
              {
                q: "How do I apply to jobs?",
                a: "Create a free account, browse jobs, and apply directly through the employer's application. Some featured jobs have one-click apply.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="card group p-6 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-white list-none">
                  {faq.q}
                  <ChevronRight className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="mt-4 text-neutral-400 pr-8">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready to Go Hardcore?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            Stop scrolling through job boards full of positions you&apos;re not
            qualified for. Find opportunities that match your ambition, not your
            credentials.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/jobs"
              className="btn btn-primary w-full px-8 py-4 text-base sm:w-auto"
            >
              Browse Jobs
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/sign-up"
              className="btn btn-secondary w-full px-8 py-4 text-base sm:w-auto"
            >
              Create Free Account
            </Link>
          </div>
          <p className="mt-8 text-sm text-neutral-600">
            Free to sign up. No credit card required.
          </p>
        </div>
      </section>
    </div>
  );
}
