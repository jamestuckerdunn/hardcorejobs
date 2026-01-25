import { DollarSign, GraduationCap, Briefcase, Globe } from "lucide-react";

const valueProps = [
  {
    icon: DollarSign,
    title: "$100K+ Minimum",
    description: "Every job pays at least $100,000 per year. No lowball offers.",
  },
  {
    icon: GraduationCap,
    title: "No Degree Required",
    description: "Skip the student debt. Skills and drive over credentials.",
  },
  {
    icon: Briefcase,
    title: "Zero Experience",
    description: "Entry-level doesn't mean entry pay. Start at the top.",
  },
  {
    icon: Globe,
    title: "Remote & On-site",
    description: "Work from anywhere or relocate for the right opportunity.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="border-b border-neutral-800 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Why HARDCOREJOBS?
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            We&apos;re not like other job boards. We focus exclusively on
            high-paying opportunities that don&apos;t require traditional credentials.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop) => (
            <div key={prop.title} className="card card-glow p-8 text-center hover-lift">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-neutral-800 text-white">
                <prop.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-lg font-bold uppercase tracking-tight text-white">
                {prop.title}
              </h3>
              <p className="mt-3 text-sm text-neutral-400">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
