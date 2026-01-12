"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  Upload,
  Save,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Input, Textarea, Checkbox } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    headline: "",
    location: "",
    willingToRelocate: false,
    linkedinUrl: "",
    portfolioUrl: "",
    bio: "",
  });

  const [pledgeStatus] = useState({
    signed: false,
    date: "",
    commitments: {
      relocate: false,
      hours: false,
      immediate: false,
      twoYears: false,
    },
  });

  const handleSave = async () => {
    setIsLoading(true);
    setSaveMessage(null);

    try {
      // API integration placeholder - will save to backend when available
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaveMessage({ type: "success", text: "Profile saved locally. Backend integration coming soon." });
    } catch {
      setSaveMessage({ type: "error", text: "Failed to save profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const profileCompletion = calculateProfileCompletion(profile);

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
        {/* Save Message */}
        {saveMessage && (
          <div
            className={`mb-8 border p-4 ${
              saveMessage.type === "success"
                ? "border-emerald-900/50 bg-emerald-950/20 text-emerald-400"
                : "border-red-900/50 bg-red-950/20 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {saveMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
              )}
              <p className="text-sm">{saveMessage.text}</p>
            </div>
          </div>
        )}

        {/* Profile Completion Banner */}
        <div className="mb-8 border border-amber-900/50 bg-amber-950/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">Profile {profileCompletion}% Complete</h3>
              <p className="mt-1 text-sm text-neutral-400">
                {profileCompletion < 100
                  ? "Complete your profile to improve your visibility to employers."
                  : "Great job! Your profile is complete."}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-white">{profileCompletion}%</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-neutral-800">
            <div
              className={`h-full transition-all ${
                profileCompletion === 100 ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${profileCompletion}%` }}
            />
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
            </div>
            <div className="border-2 border-dashed border-neutral-800 p-8 text-center">
              <Upload className="h-8 w-8 text-neutral-600 mx-auto" aria-hidden="true" />
              <p className="mt-4 text-neutral-400">
                No resume uploaded yet
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Upload your resume to apply to jobs faster
              </p>
              <button className="btn btn-secondary mt-4 px-6 py-2 text-sm">
                Upload Resume
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
                aria-hidden="true"
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
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Willing to relocate anywhere
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Ready for 60+ hour weeks
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Available to start immediately
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
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
                      className="btn btn-primary mt-4 px-6 py-3 text-sm inline-flex items-center"
                    >
                      Take the Pledge
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
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

function calculateProfileCompletion(profile: {
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  bio: string;
  linkedinUrl: string;
  portfolioUrl: string;
}): number {
  const fields = [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.headline,
    profile.location,
    profile.bio,
    profile.linkedinUrl,
    profile.portfolioUrl,
  ];

  const filledFields = fields.filter((field) => field.trim() !== "").length;
  return Math.round((filledFields / fields.length) * 100);
}
