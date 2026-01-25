import { clsx } from "clsx";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={clsx(
        "relative border p-8 transition-all duration-200",
        highlighted
          ? "border-white bg-neutral-950"
          : "border-neutral-800 bg-black hover:border-neutral-600"
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider text-black">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-xl font-bold uppercase tracking-tight text-white">
        {name}
      </h3>
      <div className="mt-4">
        <span className="text-4xl font-black text-white">{price}</span>
        {period && (
          <span className="text-neutral-500">/{period}</span>
        )}
      </div>
      <p className="mt-4 text-sm text-neutral-400">{description}</p>
      <ul className="mt-6 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-white text-xs font-bold text-black">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={clsx(
          "mt-8 block w-full py-3 text-center text-sm font-semibold uppercase tracking-wider transition-all duration-150",
          highlighted
            ? "bg-white text-black hover:bg-neutral-200"
            : "border-2 border-white text-white hover:bg-white hover:text-black"
        )}
      >
        {cta}
      </Link>
    </div>
  );
}
