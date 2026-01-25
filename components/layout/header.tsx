"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Briefcase,
  Bookmark,
  User,
  Settings,
  LayoutDashboard,
} from "lucide-react";

// Conditionally import Clerk components
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Dynamic imports for Clerk components to avoid errors when not configured
let SignedIn: React.ComponentType<{ children: React.ReactNode }> = () => null;
let SignedOut: React.ComponentType<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
let UserButton: React.ComponentType<{ appearance?: unknown }> = () => null;

if (isClerkConfigured) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const clerk = require("@clerk/nextjs");
  SignedIn = clerk.SignedIn;
  SignedOut = clerk.SignedOut;
  UserButton = clerk.UserButton;
}

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
  const [mounted, setMounted] = useState(false);

  // Only render Clerk components after hydration to avoid SSG context errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR/SSG, render signed-out state to avoid Clerk context errors
  const AuthSignedIn = mounted && isClerkConfigured ? SignedIn : () => null;
  const AuthSignedOut = mounted && isClerkConfigured ? SignedOut : ({ children }: { children: React.ReactNode }) => <>{children}</>;
  const AuthUserButton = mounted && isClerkConfigured ? UserButton : () => null;

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
          <AuthSignedOut>
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
          </AuthSignedOut>

          <AuthSignedIn>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
            <AuthUserButton
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
          </AuthSignedIn>
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

            <AuthSignedIn>
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
            </AuthSignedIn>

            <div className="border-t border-neutral-800 pt-4 space-y-2">
              <AuthSignedOut>
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
              </AuthSignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
