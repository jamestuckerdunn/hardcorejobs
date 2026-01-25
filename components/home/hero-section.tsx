import Link from "next/link";
import { ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="absolute inset-0 -z-10 opacity-20 bg-grid" />

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 animate-fade-down">
            <Zap className="h-3 w-3 text-amber-500" />
            New Jobs Added Daily
          </div>

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

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up delay-300">
            <Link
              href="/jobs"
              className="group btn btn-primary w-full px-8 py-4 text-base sm:w-auto"
            >
              Browse All Jobs
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sign-up"
              className="btn btn-secondary w-full px-8 py-4 text-base sm:w-auto"
            >
              Take the Pledge
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-500 animate-fade-up delay-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>No degree required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Entry-level friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>$100K+ salaries only</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
