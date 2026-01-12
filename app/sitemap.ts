import { MetadataRoute } from "next";

/**
 * Dynamic sitemap generation for SEO.
 * Returns static pages and could be extended to include job pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hardcorejobs.com";

  // Static pages
  const staticPages = [
    "",
    "/jobs",
    "/about",
    "/pricing",
    "/sign-in",
    "/sign-up",
  ];

  const sitemap: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/jobs" ? 0.9 : 0.7,
  }));

  return sitemap;
}
