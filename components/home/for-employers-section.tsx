import Link from "next/link";
import { Building2 } from "lucide-react";

const employerBenefits = [
  "Post featured jobs for $99",
  "Access resume database for $199/mo",
  "Filter by pledge commitment level",
  "No credential gatekeeping",
  "48-hour average response time",
];

export function ForEmployersSection() {
  return (
    <section className="border-b border-neutral-800 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-6">
              <Building2 className="h-4 w-4" />
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
              {employerBenefits.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-neutral-300">
                  <span className="flex h-6 w-6 items-center justify-center bg-white text-xs font-bold text-black">
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
              <div className="h-14 w-14 bg-neutral-800 flex items-center justify-center text-xl font-bold">
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
  );
}
