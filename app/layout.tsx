import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HARDCOREJOBS",
    title: "HARDCOREJOBS - $100K+ Jobs, Zero Experience Required",
    description:
      "Find high-paying jobs ($100k+) that require zero experience and no degree.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HARDCOREJOBS - $100K+ Jobs, Zero Experience Required",
    description:
      "Find high-paying jobs ($100k+) that require zero experience and no degree.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
