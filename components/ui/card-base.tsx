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
