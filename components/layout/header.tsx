"use client";

import Link from "next/link";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Menu,
  X,
  Briefcase,
  Bookmark,
  User,
  Settings,
  LayoutDashboard,
  Zap,
} from "lucide-react";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const userMenuLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/applications", label: "Applications", icon: Briefcase },
  { href: "/dashboard/saved", label: "Saved Jobs", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-black tracking-tighter text-white">
            HARDCORE<span className="text-neutral-500">JOBS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <SignedOut>
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="btn btn-primary px-5 py-2 text-sm"
            >
              Get Started
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/jobs"
              className="mr-2 flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-amber-500 border border-amber-500/30 hover:bg-amber-500/10 transition-colors"
            >
              <Zap className="h-3 w-3" />
              500+ Jobs
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                  userButtonPopoverCard: "bg-black border border-neutral-800",
                  userButtonPopoverActionButton:
                    "text-neutral-400 hover:text-white hover:bg-neutral-900",
                  userButtonPopoverActionButtonText: "text-sm",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-800 bg-black md:hidden animate-slide-down">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-sm font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div className="my-4 border-t border-neutral-800 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Account
                </p>
                {userMenuLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 py-3 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </SignedIn>

            <div className="border-t border-neutral-800 pt-4 space-y-2">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="btn btn-ghost w-full py-3 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="btn btn-primary w-full py-3 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
