import Link from "next/link";
import {
  ArrowRight,
  Target,
  Heart,
  Zap,
  Users,
  TrendingUp,
  Award,
  Building2,
  MapPin,
  Linkedin,
  Twitter,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Jobs Posted" },
  { value: "10K+", label: "Job Seekers" },
  { value: "$127K", label: "Average Salary" },
  { value: "89%", label: "Satisfaction Rate" },
];

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

const team = [
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    bio: "Former sales rep who went from $0 to $200K in 2 years without a degree. Started HARDCOREJOBS to help others do the same.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Jordan Chen",
    role: "Head of Product",
    bio: "Self-taught developer who believes technology should open doors, not close them. Previously at Stripe.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Morgan Taylor",
    role: "Head of Operations",
    bio: "Former recruiter who was tired of seeing great candidates rejected for lack of credentials. Joined to fix that.",
    linkedin: "#",
    twitter: "#",
  },
];

const milestones = [
  {
    year: "2023",
    title: "The Beginning",
    description:
      "HARDCOREJOBS was founded with a simple mission: help ambitious people find high-paying jobs without requiring degrees or experience.",
  },
  {
    year: "2024",
    title: "First 1,000 Users",
    description:
      "We reached our first 1,000 job seekers and helped place our first 100 candidates in $100K+ roles.",
  },
  {
    year: "2024",
    title: "Launch of The Pledge",
    description:
      "We introduced the Hardcore Pledge, creating a new standard for candidate commitment and employer confidence.",
  },
  {
    year: "2025",
    title: "10,000+ Job Seekers",
    description:
      "Our community grew to over 10,000 active job seekers, with an average placement salary of $127K.",
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

      {/* Stats */}
      <section className="border-b border-neutral-800 bg-neutral-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black text-white">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-wider text-neutral-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                Our Mission
              </h2>
              <p className="mt-6 text-lg text-neutral-400">
                We&apos;re on a mission to create 100,000 six-figure careers for
                people who don&apos;t have traditional credentials. No college degree?
                No problem. No prior experience? Doesn&apos;t matter.
              </p>
              <p className="mt-4 text-lg text-neutral-400">
                We connect ambitious, hardworking individuals with employers who
                value drive and commitment over pedigree. Through the Hardcore
                Pledge, job seekers prove they&apos;re serious, and employers get
                access to the most motivated candidates in the market.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center border border-neutral-800">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">100,000 Careers</p>
                  <p className="text-sm text-neutral-500">
                    Our goal by 2030
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, value: "$12.7B", label: "Total earnings for our community" },
                { icon: Award, value: "47%", label: "Faster time to hire" },
                { icon: Building2, value: "500+", label: "Companies hiring" },
                { icon: MapPin, value: "50", label: "States with placements" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border border-neutral-800 p-6 text-center"
                >
                  <item.icon className="h-6 w-6 text-white mx-auto" />
                  <p className="mt-4 text-2xl font-black text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{item.label}</p>
                </div>
              ))}
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
                  <value.icon className="h-7 w-7" />
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

      {/* Story / Timeline */}
      <section className="border-b border-neutral-800 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Our Story
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-800 md:left-1/2" />

            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <div
                  key={i}
                  className={`relative flex gap-8 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />

                  {/* Content */}
                  <div
                    className={`flex-1 ml-12 md:ml-0 ${
                      i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <span className="text-sm font-semibold text-amber-500">
                      {milestone.year}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-white">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-neutral-400">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Spacer for alignment */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-b border-neutral-800 py-24 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Meet the Team
            </h2>
            <p className="mt-4 text-neutral-400">
              We&apos;re a small team with big ambitions. Every one of us believes in
              our mission.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="border border-neutral-800 p-8 text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center bg-neutral-800 text-2xl font-bold text-white">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-amber-500">{member.role}</p>
                <p className="mt-4 text-sm text-neutral-400">{member.bio}</p>
                <div className="mt-6 flex justify-center gap-4">
                  <a
                    href={member.linkedin}
                    className="text-neutral-500 hover:text-white transition-colors"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={member.twitter}
                    className="text-neutral-500 hover:text-white transition-colors"
                    aria-label={`${member.name}'s Twitter`}
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press / Featured In */}
      <section className="border-b border-neutral-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm uppercase tracking-wider text-neutral-600 mb-8">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 text-neutral-500">
            {["TechCrunch", "Forbes", "Business Insider", "The Hustle", "Axios"].map(
              (outlet) => (
                <span
                  key={outlet}
                  className="text-lg font-semibold hover:text-white transition-colors cursor-default"
                >
                  {outlet}
                </span>
              )
            )}
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
              <ArrowRight className="ml-2 h-5 w-5" />
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
