import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { createApiError } from "@/lib/logger";
import {
  sanitizeString,
  sanitizeUrl,
  sanitizePhone,
  sanitizeBoolean,
} from "@/lib/validation";
import { INPUT_LIMITS } from "@/lib/constants";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await sql`
      SELECT * FROM job_seeker_profiles WHERE clerk_user_id = ${userId}
    `;

    const profile = profiles[0];
    if (!profile) {
      const user = await currentUser();
      return NextResponse.json({
        profile: null,
        clerkUser: {
          email: user?.emailAddresses?.[0]?.emailAddress ?? null,
          fullName: user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || null,
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      createApiError("Failed to fetch profile", error, { route: "/api/user/profile" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate and sanitize all inputs
    const fullName = sanitizeString(body.fullName).slice(0, INPUT_LIMITS.FULL_NAME);
    const phone = sanitizePhone(body.phone);
    const headline = sanitizeString(body.headline).slice(0, INPUT_LIMITS.HEADLINE) || null;
    const location = sanitizeString(body.location).slice(0, INPUT_LIMITS.LOCATION) || null;
    const willingToRelocate = sanitizeBoolean(body.willingToRelocate);
    const linkedinUrl = sanitizeUrl(body.linkedinUrl);
    const portfolioUrl = sanitizeUrl(body.portfolioUrl);
    const bio = sanitizeString(body.bio).slice(0, INPUT_LIMITS.BIO) || null;

    // Validate required fields
    if (!fullName) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    const existingProfiles = await sql`
      SELECT id FROM job_seeker_profiles WHERE clerk_user_id = ${userId}
    `;

    let profile;
    if (existingProfiles[0]) {
      const results = await sql`
        UPDATE job_seeker_profiles
        SET
          full_name = ${fullName},
          phone = ${phone},
          headline = ${headline},
          location = ${location},
          willing_to_relocate = ${willingToRelocate},
          linkedin_url = ${linkedinUrl},
          portfolio_url = ${portfolioUrl},
          bio = ${bio},
          updated_at = NOW()
        WHERE clerk_user_id = ${userId}
        RETURNING *
      `;
      profile = results[0];
    } else {
      const user = await currentUser();
      const email = user?.emailAddresses?.[0]?.emailAddress || "";

      const results = await sql`
        INSERT INTO job_seeker_profiles (
          clerk_user_id, email, full_name, phone, headline, location,
          willing_to_relocate, linkedin_url, portfolio_url, bio
        ) VALUES (
          ${userId}, ${email}, ${fullName}, ${phone}, ${headline},
          ${location}, ${willingToRelocate}, ${linkedinUrl},
          ${portfolioUrl}, ${bio}
        )
        RETURNING *
      `;
      profile = results[0];
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      createApiError("Failed to update profile", error, { route: "/api/user/profile" }),
      { status: 500 }
    );
  }
}
