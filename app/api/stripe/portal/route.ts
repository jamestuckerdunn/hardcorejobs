import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createCustomerPortalSession } from "@/lib/stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get employer's Stripe customer ID
    const employers = await sql`
      SELECT ep.stripe_customer_id
      FROM employer_profiles ep
      JOIN users u ON ep.user_id = u.id
      WHERE u.clerk_id = ${userId}
    `;

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
