import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Building2,
  Users,
  ArrowRight,
  ChevronRight,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "HARDCOREJOBS pricing: Free for job seekers, affordable plans for employers. Post featured jobs for $99 or access our resume database for $199/month.",
  openGraph: {
    title: "Pricing | HARDCOREJOBS",
    description:
      "Free for job seekers. Employers: Featured jobs $99, Resume database $199/mo.",
  },
};

const jobSeekerFeatures = [
  "Browse all $100K+ jobs",
  "Create a profile",
  "Take the Hardcore Pledge",
  "Apply to unlimited jobs",
  "Save jobs for later",
  "Job alert notifications",
  "Track applications",
];

const employerPlans = [
  {
    name: "Featured Job Post",
    price: "$99",
    period: "per job",
    description:
      "Get your job listing in front of motivated candidates who are ready to work hard.",
    features: [
      "Featured placement for 30 days",
      "Priority in search results",
      "Highlighted with featured badge",
      "Direct applicant notifications",
      "Analytics dashboard",
      "Edit listing anytime",
    ],
    cta: "Post a Job",
    href: "/sign-up?role=employer",
    highlighted: false,
  },
  {
    name: "Resume Database",
    price: "$199",
    period: "per month",
    description:
      "Access our database of pledge-takers who are committed, driven, and ready to relocate.",
    features: [
      "Unlimited resume views",
      "Search by location, skills, pledge status",
      "Direct contact with candidates",
      "Candidate tracking tools",
      "Export candidate data",
      "Priority support",
      "Cancel anytime",
    ],
    cta: "Get Access",
    href: "/sign-up?role=employer",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description:
      "For companies with high-volume hiring needs and custom integration requirements.",
    features: [
      "Unlimited featured job posts",
      "Full resume database access",
      "Dedicated account manager",
      "Custom API integrations",
      "Bulk applicant management",
      "Priority candidate matching",
      "Custom reporting",
      "SLA guarantees",
    ],
    cta: "Contact Sales",
    href: "mailto:hello@hardcorejobs.com",
    highlighted: false,
  },
];

const comparisonFeatures = [
  { feature: "Post standard jobs", free: true, featured: true, resume: true },
  { feature: "Featured placement", free: false, featured: true, resume: true },
  {
    feature: "Priority in search results",
    free: false,
    featured: true,
    resume: true,
  },
  {
    feature: "View candidate profiles",
    free: false,
    featured: false,
    resume: true,
  },
  {
    feature: "Contact candidates directly",
    free: false,
    featured: false,
    resume: true,
  },
  {
    feature: "Search candidate database",
    free: false,
    featured: false,
    resume: true,
  },
  {
    feature: "Analytics dashboard",
    free: false,
    featured: true,
    resume: true,
  },
  { feature: "Priority support", free: false, featured: false, resume: true },
];

export default function PricingPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
            Free for job seekers. Affordable plans for employers who want access
            to the most motivated candidates.
          </p>
        </div>
      </section>

      {/* Job Seeker Section */}
      <section className="border-b border-neutral-800 py-24 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black mb-6">
                <Users className="h-4 w-4" />
                For Job Seekers
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                100% Free Forever
              </h2>
              <p className="mt-6 text-lg text-neutral-400">
                We believe everyone deserves access to high-paying opportunities
                regardless of their background. That&apos;s why HARDCOREJOBS is
                completely free for job seekers.
              </p>
              <Link
                href="/sign-up"
                className="btn btn-primary mt-8 px-8 py-4 text-base"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="border border-emerald-900/50 bg-emerald-950/20 p-8">
              <div className="text-center mb-8">
                <p className="text-5xl font-black text-white">$0</p>
                <p className="text-neutral-400 mt-2">Forever free</p>
              </div>
              <ul className="space-y-4">
                {jobSeekerFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-emerald-500 text-black">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Employer Plans */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-6">
              <Building2 className="h-4 w-4" />
              For Employers
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Find Your Next Great Hire
            </h2>
            <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
              Access candidates who have committed to working hard, relocating
              anywhere, and staying for the long term.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {employerPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative border p-8 ${
                  plan.highlighted
                    ? "border-white bg-neutral-950"
                    : "border-neutral-800"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider text-black">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                  {plan.name}
                </h3>

                <div className="mt-4">
                  <span className="text-4xl font-black text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-neutral-500">/{plan.period}</span>
                  )}
                </div>

                <p className="mt-4 text-sm text-neutral-400">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-neutral-300"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-white text-xs font-bold text-black mt-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 block w-full py-3 text-center text-sm font-semibold uppercase tracking-wider transition-all ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "border-2 border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="border-b border-neutral-800 py-24 bg-neutral-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white text-center mb-12">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider text-neutral-500">
                    Feature
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold uppercase tracking-wider text-neutral-500">
                    Free
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold uppercase tracking-wider text-neutral-500">
                    Featured ($99)
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold uppercase tracking-wider text-white">
                    Resume DB ($199)
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-neutral-800 hover:bg-neutral-900/50"
                  >
                    <td className="py-4 px-4 text-sm text-neutral-300">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.free ? (
                        <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-neutral-700">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.featured ? (
                        <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-neutral-700">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.resume ? (
                        <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-neutral-700">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-neutral-800 py-24 bg-neutral-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Can I try before I buy?",
                a: "Yes! You can create a free employer account and post a standard job listing to see how our platform works. Featured jobs and resume database access require a paid plan.",
              },
              {
                q: "How long does a featured job listing last?",
                a: "Featured job listings are active for 30 days from the date of purchase. You can edit the listing at any time during this period.",
              },
              {
                q: "Can I cancel my resume database subscription?",
                a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a full refund within 7 days of purchase if you're not satisfied with our service.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) and ACH bank transfers for enterprise accounts.",
              },
            ].map((faq, i) => (
              <details key={i} className="card group p-6 cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-white list-none">
                  {faq.q}
                  <ChevronRight className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-neutral-400 pr-8">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Ready to Find Your Next Great Hire?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            Join hundreds of companies who have found committed, hardworking
            candidates through HARDCOREJOBS.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up?role=employer"
              className="btn btn-primary w-full px-8 py-4 text-base sm:w-auto"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="mailto:hello@hardcorejobs.com"
              className="btn btn-secondary w-full px-8 py-4 text-base sm:w-auto"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
