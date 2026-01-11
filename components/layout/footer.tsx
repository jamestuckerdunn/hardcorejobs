import Link from "next/link";

const footerLinks = {
  product: [
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ],
  jobSeekers: [
    { href: "/sign-up", label: "Create Account" },
    { href: "/jobs", label: "Search Jobs" },
  ],
  employers: [
    { href: "/sign-up?role=employer", label: "Post a Job" },
    { href: "/pricing", label: "Resume Database" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-black tracking-tighter text-white">
                HARDCORE<span className="text-neutral-500">JOBS</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-neutral-500">
              $100K+ jobs. Zero experience required. For those willing to work
              hard.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Job Seekers
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.jobSeekers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Employers
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.employers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-neutral-800 pt-8">
          <p className="text-center text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} HARDCOREJOBS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
