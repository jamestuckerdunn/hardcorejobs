import { ChevronRight } from "lucide-react";

const faqs = [
  {
    q: "Do I really need zero experience?",
    a: "Yes! All jobs on HARDCOREJOBS are entry-level positions that don't require prior work experience in the field. Employers are looking for drive and willingness to learn.",
  },
  {
    q: "What types of jobs pay $100K+ without experience?",
    a: "Sales roles (SDRs, AEs), field service technicians, insurance agents, real estate, equipment operators, and many more. The common thread is they reward hustle.",
  },
  {
    q: "What is the Hardcore Pledge?",
    a: "It's a commitment that signals to employers you're serious. Pledge-takers agree to relocate anywhere, work hard, start immediately, and commit for at least 2 years.",
  },
  {
    q: "Is the Hardcore Pledge mandatory?",
    a: "No, but pledge-takers get priority visibility to employers and often receive faster responses. It's a competitive advantage.",
  },
  {
    q: "How do I apply to jobs?",
    a: "Create a free account, browse jobs, and apply directly through the employer's application. Some featured jobs have one-click apply.",
  },
];

export function FAQSection() {
  return (
    <section className="border-b border-neutral-800 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="card group p-6 cursor-pointer"
            >
              <summary className="flex items-center justify-between font-semibold text-white list-none">
                {faq.q}
                <ChevronRight className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-4 text-neutral-400 pr-8">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
