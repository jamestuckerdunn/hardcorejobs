import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Find $100K+ jobs that don't require a degree or experience. Browse remote, hybrid, and on-site positions from companies that value hustle over credentials.",
  openGraph: {
    title: "Browse $100K+ Jobs | HARDCOREJOBS",
    description:
      "Find high-paying jobs that don't require a degree. Remote, hybrid, and on-site positions available.",
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
