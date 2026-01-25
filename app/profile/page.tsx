"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  Upload,
  Save,
  ArrowRight,
} from "lucide-react";
import { Input, Textarea, Checkbox } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserProfile, PledgeStatus } from "@/types";

function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="border border-neutral-800 p-6">
        <div className="h-4 w-48 bg-neutral-800 mb-4" />
        <div className="h-2 w-full bg-neutral-800 mb-2" />
        <div className="h-4 w-24 bg-neutral-800" />
      </div>
      <div className="border border-neutral-800 p-8">
        <div className="h-6 w-48 bg-neutral-800 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-neutral-800" />
              <div className="h-10 w-full bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    full_name: "",
    email: "",
    phone: "",
    headline: "",
    location: "",
    willing_to_relocate: false,
    linkedin_url: "",
    portfolio_url: "",
    bio: "",
    resume_url: "",
  });

  const [pledgeStatus, setPledgeStatus] = useState<PledgeStatus>({
    signed: false,
    commitments: { relocate: false, hours: false, immediate: false, twoYears: false },
  });

  useEffect(() => {
    async function fetchProfileData() {
      setIsLoading(true);
      try {
        const [profileRes, pledgeRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/pledge"),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          if (data.profile) {
            setProfile(data.profile);
          }
        }

        if (pledgeRes.ok) {
          const data = await pledgeRes.json();
          if (data.pledge) {
            setPledgeStatus(data.pledge);
          }
        }
      } catch {
        // Silent failure - default empty profile shown
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
    } catch {
      // Silent failure - form remains editable
    } finally {
      setIsSaving(false);
    }
  };

  const profileCompletion = calculateProfileCompletion(profile, pledgeStatus);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen">
        <div className="border-b border-neutral-800 bg-neutral-950">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-neutral-800 animate-pulse" />
            <div className="mt-2 h-4 w-64 bg-neutral-900 animate-pulse" />
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
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
        <div className="mb-8 border border-amber-900/50 bg-amber-950/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">Profile {profileCompletion}% Complete</h3>
              <p className="mt-1 text-sm text-neutral-400">
                {profileCompletion < 100
                  ? "Complete your profile to improve visibility to employers."
                  : "Your profile is complete!"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-white">{profileCompletion}%</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-neutral-800">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="border border-neutral-800 p-8">
            <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-6">
              Basic Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Full Name"
                value={profile.full_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                placeholder="Your full name"
              />
              <Input
                label="Email"
                type="email"
                value={profile.email || ""}
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
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
              />
              <Input
                label="Location"
                value={profile.location || ""}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                placeholder="City, State"
              />
              <div className="md:col-span-2">
                <Input
                  label="Headline"
                  value={profile.headline || ""}
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
                  value={profile.bio || ""}
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
                checked={profile.willing_to_relocate || false}
                onChange={(checked) =>
                  setProfile({ ...profile, willing_to_relocate: checked })
                }
              />
            </div>
          </div>

          <div className="border border-neutral-800 p-8">
            <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-6">
              Links
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="LinkedIn URL"
                value={profile.linkedin_url || ""}
                onChange={(e) =>
                  setProfile({ ...profile, linkedin_url: e.target.value })
                }
                placeholder="https://linkedin.com/in/yourprofile"
              />
              <Input
                label="Portfolio/Website URL"
                value={profile.portfolio_url || ""}
                onChange={(e) =>
                  setProfile({ ...profile, portfolio_url: e.target.value })
                }
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

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
              {profile.resume_url ? (
                <p className="mt-4 text-neutral-400">
                  <span className="text-white font-semibold">Resume uploaded</span>
                </p>
              ) : (
                <p className="mt-4 text-neutral-400">
                  No resume uploaded yet
                </p>
              )}
              <button className="btn btn-secondary mt-4 px-6 py-2 text-sm">
                {profile.resume_url ? "Replace Resume" : "Upload Resume"}
              </button>
            </div>
          </div>

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
                      You signed the pledge
                      {pledgeStatus.date && (
                        <> on <span className="text-white">{pledgeStatus.date}</span></>
                      )}
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {pledgeStatus.commitments.relocate && (
                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          Willing to relocate anywhere
                        </div>
                      )}
                      {pledgeStatus.commitments.hours && (
                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          Ready for 60+ hour weeks
                        </div>
                      )}
                      {pledgeStatus.commitments.immediate && (
                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          Available to start immediately
                        </div>
                      )}
                      {pledgeStatus.commitments.twoYears && (
                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          Committed for 2+ years
                        </div>
                      )}
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

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              isLoading={isSaving}
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

function calculateProfileCompletion(
  profile: Partial<UserProfile>,
  pledgeStatus: PledgeStatus
): number {
  const fields = [
    profile.full_name,
    profile.email,
    profile.phone,
    profile.headline,
    profile.location,
    profile.bio,
    profile.linkedin_url,
    profile.portfolio_url,
    profile.resume_url,
    pledgeStatus.signed,
  ];

  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
}
