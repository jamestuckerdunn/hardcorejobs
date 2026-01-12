import Link from "next/link";
import {
  ArrowRight,
  Target,
  Heart,
  Zap,
  Users,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Merit Over Credentials",
    description:
      "We believe drive, hustle, and commitment matter more than degrees and pedigree. Everyone deserves a shot at success.",
  },
  {
    icon: Zap,
    title: "Radical Transparency",
    description:
      "No hidden fees, no bait-and-switch job postings. What you see is what you get, for both job seekers and employers.",
  },
  {
    icon: Heart,
    title: "Commitment to Excellence",
    description:
      "The Hardcore Pledge isn't just words - it's a commitment to working hard, showing up, and building a real career.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We're building more than a job board - we're building a community of ambitious people who support each other.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="border-b border-neutral-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            We Believe in
            <br />
            <span className="bg-gradient-to-r from-white via-neutral-400 to-white bg-clip-text text-transparent">
              Hustle Over Credentials
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
            HARDCOREJOBS exists because we believe the traditional hiring system
            is broken. Great candidates are passed over because they lack
            degrees or &ldquo;experience.&rdquo; We&apos;re here to change that.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-6 text-lg text-neutral-400">
              We&apos;re on a mission to connect ambitious, hardworking individuals
              with employers who value drive and commitment over pedigree.
              No college degree? No problem. No prior experience? Doesn&apos;t matter.
            </p>
            <p className="mt-4 text-lg text-neutral-400">
              Through the Hardcore Pledge, job seekers prove they&apos;re serious,
              and employers get access to the most motivated candidates in the
              market. We aggregate high-paying jobs from across the internet that
              welcome entry-level candidates.
            </p>
            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center border border-neutral-800">
                <Target className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white">$100K+ Jobs Only</p>
                <p className="text-sm text-neutral-500">
                  Every job meets our salary threshold
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-neutral-800 py-24 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
              These principles guide everything we do at HARDCOREJOBS.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-neutral-800 text-white">
                  <value.icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-bold uppercase tracking-tight text-white">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              How We Work
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="border border-neutral-800 p-8">
              <div className="flex h-12 w-12 items-center justify-center bg-white text-black font-bold">
                1
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">
                We Aggregate Jobs
              </h3>
              <p className="mt-3 text-neutral-400">
                We pull job listings from multiple sources across the internet,
                filtering for positions that pay $100K+ and don&apos;t require
                degrees or prior experience.
              </p>
            </div>

            <div className="border border-neutral-800 p-8">
              <div className="flex h-12 w-12 items-center justify-center bg-white text-black font-bold">
                2
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">
                We Verify Quality
              </h3>
              <p className="mt-3 text-neutral-400">
                Every listing is checked to ensure it meets our standards:
                legitimate employer, realistic salary range, and genuine
                entry-level requirements.
              </p>
            </div>

            <div className="border border-neutral-800 p-8">
              <div className="flex h-12 w-12 items-center justify-center bg-white text-black font-bold">
                3
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">
                We Connect Talent
              </h3>
              <p className="mt-3 text-neutral-400">
                Job seekers who take the Hardcore Pledge demonstrate their
                commitment. Employers get access to motivated candidates ready
                to work hard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Join the Movement
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            Whether you&apos;re looking for your next $100K+ opportunity or searching
            for committed candidates, we&apos;re here to help.
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
              href="/sign-up?role=employer"
              className="btn btn-secondary w-full px-8 py-4 text-base sm:w-auto"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
