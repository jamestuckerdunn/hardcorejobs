import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  Bell,
  User,
  Settings,
  FileText,
} from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/applications", label: "Applications", icon: Briefcase },
  { href: "/dashboard/saved", label: "Saved Jobs", icon: Bookmark },
  { href: "/dashboard/alerts", label: "Job Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/profile/resume", label: "Resume", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-neutral-800 bg-neutral-950">
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
