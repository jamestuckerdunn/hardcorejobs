"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  Shield,
  CheckCircle2,
  Upload,
  MapPin,
  Building2,
} from "lucide-react";
import { Input, Textarea, Checkbox } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const steps = [
  { id: "role", title: "Choose Your Role" },
  { id: "profile", title: "Your Profile" },
  { id: "pledge", title: "The Pledge" },
  { id: "complete", title: "All Done" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState<"job_seeker" | "employer" | null>(null);
  const [profile, setProfile] = useState({
    fullName: "",
    headline: "",
    location: "",
    willingToRelocate: true,
    companyName: "",
    companyWebsite: "",
  });
  const [pledge, setPledge] = useState({
    relocate: false,
    hours: false,
    immediate: false,
    twoYears: false,
  });

  const allPledgesSigned = Object.values(pledge).every(Boolean);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "role":
        return (
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Welcome to HARDCOREJOBS
            </h2>
            <p className="mt-4 text-neutral-400">
              Let&apos;s get you set up. First, tell us who you are.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
              <button
                onClick={() => setRole("job_seeker")}
                className={`p-8 border text-left transition-all ${
                  role === "job_seeker"
                    ? "border-white bg-neutral-950"
                    : "border-neutral-800 hover:border-neutral-600"
                }`}
              >
                <User className="h-8 w-8 text-white mb-4" />
                <h3 className="text-lg font-bold text-white">
                  I&apos;m Looking for a Job
                </h3>
                <p className="mt-2 text-sm text-neutral-400">
                  Find $100K+ positions that don&apos;t require a degree or experience
                </p>
                {role === "job_seeker" && (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mt-4" />
                )}
              </button>

              <button
                onClick={() => setRole("employer")}
                className={`p-8 border text-left transition-all ${
                  role === "employer"
                    ? "border-white bg-neutral-950"
                    : "border-neutral-800 hover:border-neutral-600"
                }`}
              >
                <Building2 className="h-8 w-8 text-white mb-4" />
                <h3 className="text-lg font-bold text-white">
                  I&apos;m Hiring
                </h3>
                <p className="mt-2 text-sm text-neutral-400">
                  Find committed, hardworking candidates ready to prove themselves
                </p>
                {role === "employer" && (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mt-4" />
                )}
              </button>
            </div>

            <Button
              onClick={handleNext}
              disabled={!role}
              className="mt-12"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Continue
            </Button>
          </div>
        );

      case "profile":
        return (
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl text-center">
              {role === "job_seeker" ? "Tell Us About Yourself" : "Tell Us About Your Company"}
            </h2>
            <p className="mt-4 text-neutral-400 text-center">
              {role === "job_seeker"
                ? "This information will be visible to employers."
                : "This helps job seekers learn about your company."}
            </p>

            <div className="mt-12 space-y-6">
              {role === "job_seeker" ? (
                <>
                  <Input
                    label="Full Name"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    placeholder="Your full name"
                  />
                  <Input
                    label="Headline"
                    value={profile.headline}
                    onChange={(e) =>
                      setProfile({ ...profile, headline: e.target.value })
                    }
                    placeholder="e.g., Ambitious professional ready to prove myself"
                    hint="A short tagline about yourself"
                  />
                  <Input
                    label="Location"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    placeholder="City, State"
                  />
                  <Checkbox
                    label="I'm willing to relocate anywhere for the right opportunity"
                    checked={profile.willingToRelocate}
                    onChange={(checked) =>
                      setProfile({ ...profile, willingToRelocate: checked })
                    }
                  />
                </>
              ) : (
                <>
                  <Input
                    label="Company Name"
                    value={profile.companyName}
                    onChange={(e) =>
                      setProfile({ ...profile, companyName: e.target.value })
                    }
                    placeholder="Your company name"
                  />
                  <Input
                    label="Company Website"
                    value={profile.companyWebsite}
                    onChange={(e) =>
                      setProfile({ ...profile, companyWebsite: e.target.value })
                    }
                    placeholder="https://yourcompany.com"
                  />
                </>
              )}
            </div>

            <div className="mt-12 flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  role === "job_seeker"
                    ? !profile.fullName
                    : !profile.companyName
                }
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "pledge":
        if (role === "employer") {
          // Skip pledge for employers
          handleNext();
          return null;
        }

        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <Shield className="h-12 w-12 text-amber-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                The Hardcore Pledge
              </h2>
              <p className="mt-4 text-neutral-400">
                Stand out to employers by committing to these principles.
                Pledge-takers get 47% more profile views.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {[
                {
                  key: "relocate",
                  title: "I'm willing to relocate anywhere",
                  description: "Opportunity doesn't wait. Neither do I.",
                },
                {
                  key: "hours",
                  title: "I'm ready for 60+ hour weeks",
                  description: "Success demands sacrifice. I understand that.",
                },
                {
                  key: "immediate",
                  title: "I'm available to start immediately",
                  description: "When they call, I'm ready.",
                },
                {
                  key: "twoYears",
                  title: "I'm committed for 2+ years",
                  description: "I'm building a career, not padding a resume.",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() =>
                    setPledge({
                      ...pledge,
                      [item.key]: !pledge[item.key as keyof typeof pledge],
                    })
                  }
                  className={`w-full flex items-start gap-4 p-6 border text-left transition-all ${
                    pledge[item.key as keyof typeof pledge]
                      ? "border-emerald-500 bg-emerald-950/20"
                      : "border-neutral-800 hover:border-neutral-600"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center border transition-all ${
                      pledge[item.key as keyof typeof pledge]
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-neutral-600"
                    }`}
                  >
                    {pledge[item.key as keyof typeof pledge] && (
                      <CheckCircle2 className="h-4 w-4 text-black" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center text-sm text-neutral-500">
              <p>
                The pledge is optional but strongly recommended. You can skip
                this step.
              </p>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={handleNext}>
                  Skip for Now
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!allPledgesSigned}
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Sign the Pledge
                </Button>
              </div>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="text-center max-w-xl mx-auto">
            <div className="flex h-20 w-20 items-center justify-center bg-emerald-500 mx-auto mb-8">
              <CheckCircle2 className="h-10 w-10 text-black" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              You&apos;re All Set!
            </h2>
            <p className="mt-4 text-neutral-400">
              {role === "job_seeker"
                ? "Your profile is ready. Start browsing $100K+ jobs and apply with confidence."
                : "Your company profile is ready. Start posting jobs and finding great candidates."}
            </p>

            {role === "job_seeker" && allPledgesSigned && (
              <div className="mt-8 p-6 border border-emerald-900/50 bg-emerald-950/20">
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Hardcore Pledge Signed</span>
                </div>
                <p className="mt-2 text-sm text-neutral-400">
                  You now have priority visibility with employers
                </p>
              </div>
            )}

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button onClick={handleComplete} size="lg">
                {role === "job_seeker" ? "Browse Jobs" : "Post a Job"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="secondary" onClick={handleComplete} size="lg">
                Go to Dashboard
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Progress bar */}
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center text-sm font-bold ${
                    i <= currentStep
                      ? "bg-white text-black"
                      : "bg-neutral-800 text-neutral-500"
                  }`}
                >
                  {i < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-24 h-px mx-2 ${
                      i < currentStep ? "bg-white" : "bg-neutral-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-sm text-neutral-500">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
        </div>
      </div>

      {/* Step content */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {renderStep()}
      </div>
    </div>
  );
}
