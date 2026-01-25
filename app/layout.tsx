import type { Metadata } from "next";
import { ConditionalClerkProvider } from "@/components/providers/clerk-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://hardcorejobs.com"),
  title: {
    default: "HARDCOREJOBS - $100K+ Jobs, Zero Experience Required",
    template: "%s | HARDCOREJOBS",
  },
  description:
    "Find high-paying jobs ($100k+) that require zero experience and no degree. For those willing to work hard and relocate anywhere.",
  keywords: [
    "jobs",
    "high paying jobs",
    "no experience",
    "no degree",
    "entry level",
    "100k salary",
    "remote jobs",
  ],
  authors: [{ name: "HARDCOREJOBS" }],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HARDCOREJOBS",
    title: "HARDCOREJOBS - $100K+ Jobs, Zero Experience Required",
    description:
      "Find high-paying jobs ($100k+) that require zero experience and no degree.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HARDCOREJOBS - $100K+ Jobs, Zero Experience Required",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HARDCOREJOBS - $100K+ Jobs, Zero Experience Required",
    description:
      "Find high-paying jobs ($100k+) that require zero experience and no degree.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ConditionalClerkProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:font-semibold"
          >
            Skip to main content
          </a>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
        </ConditionalClerkProvider>
      </body>
    </html>
  );
}
