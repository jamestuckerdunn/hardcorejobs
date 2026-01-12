"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Shield,
  CheckCircle2,
  Upload,
  Save,
  ArrowRight,
} from "lucide-react";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    headline: "Ambitious professional ready to prove myself",
    location: "Austin, TX",
    willingToRelocate: true,
    linkedinUrl: "https://linkedin.com/in/johndoe",
    portfolioUrl: "",
    bio: "I'm a highly motivated individual looking for my first opportunity in tech sales. I'm willing to work hard, learn fast, and relocate anywhere for the right opportunity.",
  });

  const [pledgeStatus, setPledgeStatus] = useState({
    signed: true,
    date: "January 5, 2025",
    commitments: {
      relocate: true,
      hours: true,
      immediate: true,
      twoYears: true,
    },
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            Your Profile
          </h1>
          <p className="mt-1 text-neutral-400">
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Completion Banner */}
        <div className="mb-8 border border-amber-900/50 bg-amber-950/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">Profile 75% Complete</h3>
              <p className="mt-1 text-sm text-neutral-400">
                Add your portfolio URL to complete your profile and improve visibility.
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-white">75%</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-neutral-800">
            <div className="h-full w-3/4 bg-amber-500" />
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <div className="border border-neutral-800 p-8">
            <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-6">
              Basic Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Full Name"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                placeholder="Your full name"
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="your@email.com"
                disabled
                hint="Email is managed by your account settings"
              />
              <Input
                label="Phone"
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
              />
              <Input
                label="Location"
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                placeholder="City, State"
              />
              <div className="md:col-span-2">
                <Input
                  label="Headline"
                  value={profile.headline}
                  onChange={(e) =>
                    setProfile({ ...profile, headline: e.target.value })
                  }
                  placeholder="A brief headline about yourself"
                  hint="This appears at the top of your profile"
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  label="About"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Tell employers about yourself..."
                  hint="Highlight your motivation, work ethic, and what makes you a great candidate"
                />
              </div>
            </div>
            <div className="mt-6">
              <Checkbox
                label="I'm willing to relocate anywhere for the right opportunity"
                checked={profile.willingToRelocate}
                onChange={(checked) =>
                  setProfile({ ...profile, willingToRelocate: checked })
                }
              />
            </div>
          </div>

          {/* Links */}
          <div className="border border-neutral-800 p-8">
            <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-6">
              Links
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="LinkedIn URL"
                value={profile.linkedinUrl}
                onChange={(e) =>
                  setProfile({ ...profile, linkedinUrl: e.target.value })
                }
                placeholder="https://linkedin.com/in/yourprofile"
              />
              <Input
                label="Portfolio/Website URL"
                value={profile.portfolioUrl}
                onChange={(e) =>
                  setProfile({ ...profile, portfolioUrl: e.target.value })
                }
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Resume */}
          <div className="border border-neutral-800 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold uppercase tracking-tight text-white">
                Resume
              </h2>
              <Link
                href="/profile/resume"
                className="text-sm font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
              >
                Manage Resume
              </Link>
            </div>
            <div className="border-2 border-dashed border-neutral-800 p-8 text-center">
              <Upload className="h-8 w-8 text-neutral-600 mx-auto" />
              <p className="mt-4 text-neutral-400">
                <span className="text-white font-semibold">resume_johndoe.pdf</span>
                <br />
                <span className="text-sm">Uploaded Jan 5, 2025</span>
              </p>
              <button className="btn btn-secondary mt-4 px-6 py-2 text-sm">
                Replace Resume
              </button>
            </div>
          </div>

          {/* Hardcore Pledge Status */}
          <div
            className={`border p-8 ${
              pledgeStatus.signed
                ? "border-emerald-900/50 bg-emerald-950/20"
                : "border-neutral-800"
            }`}
          >
            <div className="flex items-start gap-4">
              <Shield
                className={`h-8 w-8 shrink-0 ${
                  pledgeStatus.signed ? "text-emerald-500" : "text-neutral-600"
                }`}
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold uppercase tracking-tight text-white">
                  The Hardcore Pledge
                </h2>
                {pledgeStatus.signed ? (
                  <>
                    <p className="mt-2 text-neutral-400">
                      You signed the pledge on{" "}
                      <span className="text-white">{pledgeStatus.date}</span>
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Willing to relocate anywhere
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Ready for 60+ hour weeks
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Available to start immediately
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Committed for 2+ years
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-neutral-400">
                      You haven&apos;t signed the pledge yet. Pledge-takers get 47%
                      more profile views on average.
                    </p>
                    <Link
                      href="/onboarding/pledge"
                      className="btn btn-primary mt-4 px-6 py-3 text-sm"
                    >
                      Take the Pledge
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              isLoading={isLoading}
              leftIcon={<Save className="h-4 w-4" />}
              size="lg"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
