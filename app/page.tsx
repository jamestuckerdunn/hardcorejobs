import Link from "next/link";
import { ArrowRight, DollarSign, GraduationCap, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
              $100K+ Jobs
              <br />
              <span className="text-neutral-500">Zero Experience</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-400 sm:text-xl">
              We aggregate high-paying positions that don&apos;t require a degree or
              prior experience. For those willing to work hard and relocate
              anywhere.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/jobs"
                className="btn btn-primary w-full px-8 py-4 text-base sm:w-auto"
              >
                Browse Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/sign-up"
                className="btn btn-secondary w-full px-8 py-4 text-base sm:w-auto"
              >
                Take the Pledge
              </Link>
            </div>
          </div>
        </div>

        {/* Background grid */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="card p-8">
              <DollarSign className="h-10 w-10 text-white" />
              <h3 className="mt-6 text-xl font-bold uppercase tracking-tight text-white">
                $100K+ Minimum
              </h3>
              <p className="mt-3 text-neutral-400">
                Every job we list pays at least $100,000 per year. No lowball
                offers, no salary games.
              </p>
            </div>
            <div className="card p-8">
              <GraduationCap className="h-10 w-10 text-white" />
              <h3 className="mt-6 text-xl font-bold uppercase tracking-tight text-white">
                No Degree Required
              </h3>
              <p className="mt-3 text-neutral-400">
                Skip the student debt. These positions value skills and drive
                over credentials.
              </p>
            </div>
            <div className="card p-8">
              <Briefcase className="h-10 w-10 text-white" />
              <h3 className="mt-6 text-xl font-bold uppercase tracking-tight text-white">
                Zero Experience
              </h3>
              <p className="mt-3 text-neutral-400">
                Entry-level doesn&apos;t mean entry pay. Start your career at the top
                of the salary scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div>
              <p className="text-4xl font-black text-white sm:text-5xl">500+</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-neutral-500">
                Active Jobs
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-white sm:text-5xl">$127K</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-neutral-500">
                Average Salary
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-white sm:text-5xl">10K+</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-neutral-500">
                Hardcore Job Seekers
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-white sm:text-5xl">48hrs</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-neutral-500">
                Avg Time to Interview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Pledge Section */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              The Hardcore Pledge
            </h2>
            <p className="mt-6 text-lg text-neutral-400">
              Our job seekers aren&apos;t just looking for jobs. They&apos;re committed to
              excellence. When you take the pledge, employers know you&apos;re
              serious.
            </p>
            <div className="mt-10 space-y-4 text-left">
              <div className="card flex items-start gap-4 p-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-white text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Willing to relocate anywhere
                  </p>
                  <p className="mt-1 text-sm text-neutral-400">
                    Opportunity doesn&apos;t wait. Neither do you.
                  </p>
                </div>
              </div>
              <div className="card flex items-start gap-4 p-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-white text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Ready for 60+ hour weeks
                  </p>
                  <p className="mt-1 text-sm text-neutral-400">
                    Success demands sacrifice. You understand that.
                  </p>
                </div>
              </div>
              <div className="card flex items-start gap-4 p-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-white text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Available to start immediately
                  </p>
                  <p className="mt-1 text-sm text-neutral-400">
                    When they call, you&apos;re ready.
                  </p>
                </div>
              </div>
              <div className="card flex items-start gap-4 p-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-white text-sm font-bold text-white">
                  4
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Committed for 2+ years
                  </p>
                  <p className="mt-1 text-sm text-neutral-400">
                    You&apos;re building a career, not padding a resume.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/sign-up"
              className="btn btn-primary mt-10 px-8 py-4 text-base"
            >
              Take the Pledge
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                For Employers
              </h2>
              <p className="mt-6 text-lg text-neutral-400">
                Access a database of candidates who have taken the Hardcore
                Pledge. These aren&apos;t passive job seekers—they&apos;re committed,
                driven, and ready to prove themselves.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3 text-neutral-300">
                  <span className="flex h-6 w-6 items-center justify-center bg-white text-xs font-bold text-black">
                    ✓
                  </span>
                  Post featured jobs for $99
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <span className="flex h-6 w-6 items-center justify-center bg-white text-xs font-bold text-black">
                    ✓
                  </span>
                  Access resume database for $199/mo
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <span className="flex h-6 w-6 items-center justify-center bg-white text-xs font-bold text-black">
                    ✓
                  </span>
                  Filter by pledge commitment level
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <span className="flex h-6 w-6 items-center justify-center bg-white text-xs font-bold text-black">
                    ✓
                  </span>
                  No credential gatekeeping
                </li>
              </ul>
              <Link
                href="/sign-up?role=employer"
                className="btn btn-secondary mt-8 px-8 py-4 text-base"
              >
                Post a Job
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="card p-8 lg:p-12">
              <blockquote className="text-lg italic text-neutral-300">
                &ldquo;We&apos;ve hired three people through HARDCOREJOBS. All of them
                outperform candidates we&apos;ve found through traditional
                channels. The pledge means something.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-neutral-800" />
                <div>
                  <p className="font-semibold text-white">Sarah Chen</p>
                  <p className="text-sm text-neutral-500">
                    VP of Engineering, TechCorp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-800 bg-neutral-950 py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
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
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/sign-up"
              className="btn btn-secondary w-full px-8 py-4 text-base sm:w-auto"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
