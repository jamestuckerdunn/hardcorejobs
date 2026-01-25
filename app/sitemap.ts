import { MetadataRoute } from "next";
import { sql } from "@/lib/db";

const BASE_URL = "https://hardcorejobs.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic job pages
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await sql`
      SELECT id, updated_at
      FROM jobs
      WHERE status = 'active'
      ORDER BY updated_at DESC
      LIMIT 1000
    `;

    jobPages = jobs.map((job) => ({
      url: `${BASE_URL}/jobs/${job.id}`,
      lastModified: new Date(job.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));
  } catch {
    // Database may not be available during build
    console.log("Sitemap: Unable to fetch jobs, using static pages only");
  }

  return [...staticPages, ...jobPages];
}
