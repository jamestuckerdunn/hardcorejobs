import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
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
            <ArrowRight className="ml-2 h-5 w-5" />
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
  );
}
