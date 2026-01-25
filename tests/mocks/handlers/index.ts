import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock health endpoint
  http.get("/api/health", () => {
    return HttpResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: { status: "up", latency: 5 },
      },
      version: "test",
    });
  }),

  // Mock jobs API
  http.get("/api/jobs", ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");

    return HttpResponse.json({
      jobs: Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
        id: `job-${i + 1}`,
        title: `Test Job ${i + 1}`,
        company: `Company ${i + 1}`,
        location: "Remote",
        salary_min: 100000,
        salary_max: 150000,
        created_at: new Date().toISOString(),
      })),
      total: 100,
      page: 1,
      limit,
    });
  }),
];
