import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

const pledgeItems = [
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
];

export function PledgeSection() {
  return (
    <section className="border-b border-neutral-800 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black mb-6">
              <Shield className="h-4 w-4" />
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
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="space-y-4">
            {pledgeItems.map((item) => (
              <div
                key={item.num}
                className="card flex items-start gap-4 p-6 hover-lift"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-sm font-bold text-black">
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
  );
}
