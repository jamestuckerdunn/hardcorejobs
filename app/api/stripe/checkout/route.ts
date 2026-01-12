import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  createFeaturedJobCheckout,
  createResumeDatabaseCheckout,
} from "@/lib/stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, jobId } = body;

    // Get employer profile
    const employers = await sql`
      SELECT ep.id, ep.stripe_customer_id
      FROM employer_profiles ep
      JOIN users u ON ep.user_id = u.id
      WHERE u.clerk_id = ${userId}
    `;

    if (employers.length === 0) {
      return NextResponse.json(
        { error: "Employer profile not found. Please complete your profile first." },
        { status: 400 }
      );
    }

    const employer = employers[0];

    let session;

    switch (type) {
      case "featured_job":
        session = await createFeaturedJobCheckout({
          employerId: employer.id,
          jobId,
          successUrl: `${APP_URL}/employer/jobs?success=featured`,
          cancelUrl: `${APP_URL}/employer/jobs?canceled=true`,
        });
        break;

      case "resume_subscription":
        session = await createResumeDatabaseCheckout({
          employerId: employer.id,
          customerId: employer.stripe_customer_id || undefined,
          successUrl: `${APP_URL}/employer/candidates?success=subscription`,
          cancelUrl: `${APP_URL}/pricing?canceled=true`,
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid checkout type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
