import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createCustomerPortalSession, hasStripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/env";

export async function POST() {
  const APP_URL = getAppUrl();
  // Check if Stripe is configured
  if (!hasStripe()) {
    return NextResponse.json(
      { error: "Payment processing is not configured" },
      { status: 503 }
    );
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get employer's Stripe customer ID
    const employers = await sql`
      SELECT ep.stripe_customer_id
      FROM employer_profiles ep
      JOIN users u ON ep.user_id = u.id
      WHERE u.clerk_id = ${userId}
    ` as unknown as { stripe_customer_id?: string }[];

    if (employers.length === 0 || !employers[0].stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 400 }
      );
    }

    const session = await createCustomerPortalSession({
      customerId: employers[0].stripe_customer_id,
      returnUrl: `${APP_URL}/employer/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
