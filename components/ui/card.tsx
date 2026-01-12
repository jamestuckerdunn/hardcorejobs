import { clsx } from "clsx";
import Link from "next/link";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-black border border-neutral-800 transition-all duration-200",
        hover && "hover:border-neutral-600",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardLinkProps extends CardProps {
  href: string;
}

export function CardLink({ href, children, className, hover = true }: CardLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "block bg-black border border-neutral-800 transition-all duration-200",
        hover && "hover:border-neutral-600 hover:bg-neutral-950",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("px-6 py-4 border-b border-neutral-800", className)}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("px-6 py-4", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("px-6 py-4 border-t border-neutral-800", className)}>
      {children}
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
}

export function StatsCard({ label, value, change, icon }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
          {change && (
            <p
              className={clsx(
                "mt-1 text-xs font-medium",
                change.type === "increase" ? "text-emerald-400" : "text-red-400"
              )}
            >
              {change.type === "increase" ? "+" : "-"}
              {Math.abs(change.value)}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center bg-neutral-900 text-neutral-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-8 group">
      <div className="flex h-12 w-12 items-center justify-center border border-neutral-800 text-white group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-200">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold uppercase tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-3 text-neutral-400">{description}</p>
    </Card>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  company,
  image,
}: TestimonialCardProps) {
  return (
    <Card className="p-8">
      <blockquote className="text-lg text-neutral-300 italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-4">
        {image ? (
          <img
            src={image}
            alt={author}
            className="h-12 w-12 object-cover grayscale"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center bg-neutral-800 text-lg font-bold text-white">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-neutral-500">
            {role}, {company}
          </p>
        </div>
      </div>
    </Card>
  );
}

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
