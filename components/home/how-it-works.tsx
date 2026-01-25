import { Target, Briefcase, TrendingUp } from "lucide-react";

const steps = [
  {
    num: 1,
    icon: Target,
    title: "Take the Pledge",
    description:
      "Sign up and take the Hardcore Pledge to show employers you're committed, willing to relocate, and ready to work hard.",
  },
  {
    num: 2,
    icon: Briefcase,
    title: "Apply to Jobs",
    description:
      "Browse our curated list of $100K+ jobs that don't require degrees or experience. Apply directly to employers.",
  },
  {
    num: 3,
    icon: TrendingUp,
    title: "Land Your Job",
    description:
      "Get interviews faster because employers know pledge-takers are serious. Start earning $100K+ with no degree required.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-b border-neutral-800 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Get from zero to $100K+ in three simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="relative">
              <div className="absolute -left-4 top-0 text-8xl font-black text-neutral-900">
                {step.num}
              </div>
              <div className="relative pt-4 pl-8">
                <div className="flex h-12 w-12 items-center justify-center bg-white text-black">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold uppercase tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-neutral-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
