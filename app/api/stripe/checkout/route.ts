import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql, isDatabaseAvailable } from "@/lib/db";
import {
  createFeaturedJobCheckout,
  createResumeDatabaseCheckout,
  hasStripe,
} from "@/lib/stripe";
import { checkoutSchema, parseBody, formatZodError } from "@/lib/validations";
import { getAppUrl } from "@/lib/env";

export async function POST(request: Request) {
  const APP_URL = getAppUrl();
  // Check if Stripe is configured
  if (!hasStripe()) {
    return NextResponse.json(
      { error: "Payment processing is not configured" },
      { status: 503 }
    );
  }

  // Check database availability
  if (!isDatabaseAvailable()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate request body
    const validation = await parseBody(request, checkoutSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: "Invalid request", details: formatZodError(validation.error) },
        { status: 400 }
      );
    }

    const { type, jobId } = validation.data;

    // Validate jobId is provided for featured_job type
    if (type === "featured_job" && !jobId) {
      return NextResponse.json(
        { error: "Job ID is required for featured job checkout" },
        { status: 400 }
      );
    }

    // Get employer profile
    const employers = await sql`
      SELECT ep.id, ep.stripe_customer_id
      FROM employer_profiles ep
      JOIN users u ON ep.user_id = u.id
      WHERE u.clerk_id = ${userId}
    ` as unknown as { id: string; stripe_customer_id?: string }[];

    if (employers.length === 0) {
      return NextResponse.json(
        { error: "Employer profile not found. Please complete your profile first." },
        { status: 403 }
      );
    }

    const employer = employers[0];

    let session;

    if (type === "featured_job") {
      // Verify the job exists and belongs to this employer
      const jobs = await sql`
        SELECT id FROM jobs WHERE id = ${jobId} AND employer_id = ${employer.id}
      ` as unknown as { id: string }[];

      if (jobs.length === 0) {
        return NextResponse.json(
          { error: "Job not found or you don't have permission to feature it" },
          { status: 404 }
        );
      }

      session = await createFeaturedJobCheckout({
        employerId: employer.id,
        jobId,
        successUrl: `${APP_URL}/employer/jobs?success=featured`,
        cancelUrl: `${APP_URL}/employer/jobs?canceled=true`,
      });
    } else {
      session = await createResumeDatabaseCheckout({
        employerId: employer.id,
        customerId: employer.stripe_customer_id,
        successUrl: `${APP_URL}/employer/candidates?success=subscription`,
        cancelUrl: `${APP_URL}/pricing?canceled=true`,
      });
    }

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
