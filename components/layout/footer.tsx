"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Linkedin, Twitter, Mail } from "lucide-react";
import { SOCIAL_LINKS, CONTACT } from "@/lib/constants";

const footerLinks = {
  product: [
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
  ],
  jobSeekers: [
    { href: "/sign-up", label: "Create Account" },
    { href: "/jobs", label: "Search Jobs" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  employers: [
    { href: "/sign-up?role=employer", label: "Post a Job" },
    { href: "/pricing", label: "Resume Database" },
    { href: "mailto:hello@hardcorejobs.com", label: "Contact Sales" },
  ],
  resources: [
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/support", label: "Support" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

const socialLinks = [
  { href: SOCIAL_LINKS.TWITTER, label: "Twitter", icon: Twitter },
  { href: SOCIAL_LINKS.LINKEDIN, label: "LinkedIn", icon: Linkedin },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call an API
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-neutral-800 bg-black">
      {/* Newsletter Section */}
      <div className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                Get Job Alerts
              </h3>
              <p className="mt-2 text-neutral-400">
                Be the first to know when new $100K+ jobs are posted. No spam,
                just opportunities.
              </p>
            </div>
            {subscribed ? (
              <div className="text-center lg:text-right">
                <p className="text-emerald-400 font-semibold">
                  Thanks for subscribing!
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Check your inbox for confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-label="Email address for job alerts"
                  className="flex-1 px-4 py-3 text-sm bg-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:border-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="btn btn-primary px-6 py-3 text-sm shrink-0"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-xl font-black tracking-tighter text-white">
                HARDCORE<span className="text-neutral-500">JOBS</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-neutral-500 max-w-xs">
              $100K+ jobs that don&apos;t require a degree or experience. For those
              willing to work hard and go anywhere.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Product
            </h4>
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Job Seekers
            </h4>
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Employers
            </h4>
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Legal
            </h4>
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} HARDCOREJOBS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${CONTACT.EMAIL}`}
              className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              {CONTACT.EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
