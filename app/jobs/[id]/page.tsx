import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Clock,
  Building2,
  Bookmark,
  Share2,
  DollarSign,
  Briefcase,
  Users,
  Globe,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge, RemoteBadge, SalaryBadge } from "@/components/ui/badge";

// Sample job data - in production this would come from the database
const sampleJobs = [
  {
    id: "1",
    title: "Sales Development Representative",
    company_name: "TechFlow Inc",
    company_logo_url: null,
    company_website: "https://techflow.com",
    company_description:
      "TechFlow is a leading provider of enterprise automation software, helping Fortune 500 companies streamline their operations.",
    company_size: "500-1000 employees",
    industry: "Enterprise Software",
    location: "Remote",
    remote_type: "remote" as const,
    salary_min: 120000,
    salary_max: 150000,
    salary_currency: "USD",
    description: `
      <h2>About the Role</h2>
      <p>We're looking for hungry, ambitious individuals to join our high-growth sales team. As a Sales Development Representative, you'll be on the front lines of our go-to-market strategy, helping enterprise clients discover the power of automation.</p>

      <h2>What You'll Do</h2>
      <ul>
        <li>Generate qualified leads through outbound prospecting (cold calls, emails, LinkedIn)</li>
        <li>Book meetings with decision-makers at Fortune 500 companies</li>
        <li>Learn our product inside and out to effectively communicate value</li>
        <li>Collaborate with Account Executives to close deals</li>
        <li>Hit and exceed monthly quota targets</li>
      </ul>

      <h2>What We're Looking For</h2>
      <ul>
        <li>No prior sales experience required - we provide comprehensive training</li>
        <li>Strong communication skills and ability to handle rejection</li>
        <li>Competitive drive and desire to win</li>
        <li>Coachable attitude and willingness to learn</li>
        <li>Availability to start immediately</li>
      </ul>

      <h2>Compensation & Benefits</h2>
      <ul>
        <li>$120K-$150K OTE (On-Target Earnings)</li>
        <li>Uncapped commissions - top performers earn $200K+</li>
        <li>Full health, dental, and vision insurance</li>
        <li>Unlimited PTO</li>
        <li>Home office stipend</li>
        <li>Clear promotion path to Account Executive role</li>
      </ul>
    `,
    requirements:
      "No degree required. No prior experience required. Must be legally authorized to work in the US.",
    apply_url: "https://example.com/apply",
    is_featured: true,
    posted_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    source: "direct",
  },
  {
    id: "2",
    title: "Field Service Technician",
    company_name: "PowerGrid Systems",
    company_logo_url: null,
    company_website: "https://powergrid.com",
    company_description:
      "PowerGrid Systems installs and maintains industrial power infrastructure across the United States.",
    company_size: "1000-5000 employees",
    industry: "Energy & Utilities",
    location: "Austin, TX",
    remote_type: "onsite" as const,
    salary_min: 110000,
    salary_max: 140000,
    salary_currency: "USD",
    description: `
      <h2>About the Role</h2>
      <p>Join our field service team and help power America's infrastructure. We're looking for technically-minded individuals who aren't afraid of hard work and want to earn a great living without a college degree.</p>

      <h2>What You'll Do</h2>
      <ul>
        <li>Install, maintain, and repair industrial power systems</li>
        <li>Travel to customer sites across the Southwest region</li>
        <li>Diagnose and troubleshoot electrical and mechanical issues</li>
        <li>Work with customers to ensure complete satisfaction</li>
        <li>Document all work and maintain service records</li>
      </ul>

      <h2>What We're Looking For</h2>
      <ul>
        <li>No prior experience required - full training provided</li>
        <li>Mechanical aptitude and problem-solving skills</li>
        <li>Willingness to travel up to 75% of the time</li>
        <li>Valid driver's license</li>
        <li>Ability to lift 50+ pounds</li>
      </ul>

      <h2>Compensation & Benefits</h2>
      <ul>
        <li>$110K-$140K base salary</li>
        <li>Overtime opportunities (time and a half)</li>
        <li>Company truck and fuel card</li>
        <li>Full benefits package</li>
        <li>401(k) with company match</li>
        <li>Paid training and certifications</li>
      </ul>
    `,
    requirements:
      "Must have valid driver's license. Must be able to pass background check. Must be willing to relocate to Austin, TX.",
    apply_url: "https://example.com/apply",
    is_featured: true,
    posted_at: new Date(Date.now() - 86400000).toISOString(),
    expires_at: new Date(Date.now() + 29 * 86400000).toISOString(),
    source: "direct",
  },
];

// Similar jobs for the sidebar
const similarJobs = [
  {
    id: "3",
    title: "Account Executive",
    company: "CloudBase",
    salary: "$130K - $180K",
  },
  {
    id: "4",
    title: "Business Development Rep",
    company: "SaaS Startup",
    salary: "$110K - $160K",
  },
  {
    id: "5",
    title: "Customer Success Manager",
    company: "DataSync",
    salary: "$115K - $145K",
  },
];

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = sampleJobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  const postedDate = new Date(job.posted_at);
  const currentDate = new Date();
  const daysAgo = Math.floor(
    (currentDate.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-black min-h-screen">
      {/* Back Link */}
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="border border-neutral-800 p-8">
              {job.is_featured && (
                <div className="mb-4 inline-flex items-center gap-2 bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                  <Zap className="h-3 w-3" />
                  Featured Position
                </div>
              )}

              <div className="flex items-start gap-6">
                {job.company_logo_url ? (
                  <img
                    src={job.company_logo_url}
                    alt={job.company_name}
                    className="h-16 w-16 shrink-0 object-contain bg-neutral-900"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-neutral-900 text-2xl font-bold text-neutral-600">
                    {job.company_name.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                    {job.title}
                  </h1>
                  <p className="mt-2 text-lg text-neutral-400">
                    {job.company_name}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <SalaryBadge
                      min={job.salary_min}
                      max={job.salary_max}
                      currency={job.salary_currency}
                    />
                    <RemoteBadge type={job.remote_type} />
                    <Badge>
                      <MapPin className="mr-1 h-3 w-3" />
                      {job.location}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary px-8 py-4 text-base flex-1 sm:flex-none"
                >
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <button className="btn btn-secondary px-6 py-4 text-base">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </button>
                <button className="btn btn-ghost px-6 py-4 text-base">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="border border-neutral-800 p-4">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <p className="mt-2 text-sm text-neutral-500">Salary Range</p>
                <p className="font-semibold text-white">
                  ${Math.round(job.salary_min / 1000)}K - $
                  {Math.round(job.salary_max / 1000)}K
                </p>
              </div>
              <div className="border border-neutral-800 p-4">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <p className="mt-2 text-sm text-neutral-500">Experience</p>
                <p className="font-semibold text-white">Entry Level</p>
              </div>
              <div className="border border-neutral-800 p-4">
                <Globe className="h-5 w-5 text-purple-500" />
                <p className="mt-2 text-sm text-neutral-500">Work Type</p>
                <p className="font-semibold text-white capitalize">
                  {job.remote_type}
                </p>
              </div>
              <div className="border border-neutral-800 p-4">
                <Clock className="h-5 w-5 text-amber-500" />
                <p className="mt-2 text-sm text-neutral-500">Posted</p>
                <p className="font-semibold text-white">
                  {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                </p>
              </div>
            </div>

            {/* Job Description */}
            <div className="mt-8 border border-neutral-800 p-8">
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-6">
                Job Description
              </h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Requirements */}
            <div className="mt-6 border border-neutral-800 p-8">
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-4">
                Requirements
              </h2>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-neutral-400">{job.requirements}</p>
              </div>
            </div>

            {/* No Experience Notice */}
            <div className="mt-6 border border-emerald-900/50 bg-emerald-950/20 p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-white">
                    No Experience Required
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    This position does not require prior work experience or a
                    college degree. The employer provides comprehensive training
                    for all new hires.
                  </p>
                </div>
              </div>
            </div>

            {/* Apply CTA */}
            <div className="mt-8 border border-neutral-800 bg-neutral-950 p-8 text-center">
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                Ready to Apply?
              </h3>
              <p className="mt-2 text-neutral-400">
                Don&apos;t wait - apply now and take the first step toward your
                $100K+ career.
              </p>
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-6 px-10 py-4 text-base"
              >
                Apply for This Position
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                About the Company
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center bg-neutral-900 text-lg font-bold text-neutral-600">
                  {job.company_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{job.company_name}</p>
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                {job.company_description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Users className="h-4 w-4" />
                  <span>{job.company_size}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <Building2 className="h-4 w-4" />
                  <span>{job.industry}</span>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                Similar Jobs
              </h3>
              <div className="space-y-4">
                {similarJobs.map((sj) => (
                  <Link
                    key={sj.id}
                    href={`/jobs/${sj.id}`}
                    className="block p-4 border border-neutral-800 hover:border-neutral-600 transition-colors"
                  >
                    <p className="font-semibold text-white">{sj.title}</p>
                    <p className="text-sm text-neutral-500">{sj.company}</p>
                    <p className="mt-2 text-sm font-medium text-emerald-400">
                      {sj.salary}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                href="/jobs"
                className="block mt-4 text-center text-sm font-semibold uppercase tracking-wider text-white hover:text-neutral-300 transition-colors"
              >
                View All Jobs
              </Link>
            </div>

            {/* Job Alert CTA */}
            <div className="border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="font-bold text-white">Get Job Alerts</h3>
              <p className="mt-2 text-sm text-neutral-400">
                Be the first to know when similar positions are posted.
              </p>
              <Link
                href="/sign-up"
                className="btn btn-secondary mt-4 w-full py-3 text-sm"
              >
                Create Alert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
