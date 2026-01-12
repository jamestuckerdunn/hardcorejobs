import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

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
          email: user?.emailAddresses[0]?.emailAddress,
          fullName: user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile", details: String(error) },
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
    const {
      fullName,
      phone,
      headline,
      location,
      willingToRelocate,
      linkedinUrl,
      portfolioUrl,
      bio,
    } = body;

    const existingProfiles = await sql`
      SELECT id FROM job_seeker_profiles WHERE clerk_user_id = ${userId}
    `;

    let profile;
    if (existingProfiles[0]) {
      const results = await sql`
        UPDATE job_seeker_profiles
        SET
          full_name = ${fullName},
          phone = ${phone || null},
          headline = ${headline || null},
          location = ${location || null},
          willing_to_relocate = ${willingToRelocate ?? true},
          linkedin_url = ${linkedinUrl || null},
          portfolio_url = ${portfolioUrl || null},
          bio = ${bio || null},
          updated_at = NOW()
        WHERE clerk_user_id = ${userId}
        RETURNING *
      `;
      profile = results[0];
    } else {
      const user = await currentUser();
      const email = user?.emailAddresses[0]?.emailAddress || "";

      const results = await sql`
        INSERT INTO job_seeker_profiles (
          clerk_user_id, email, full_name, phone, headline, location,
          willing_to_relocate, linkedin_url, portfolio_url, bio
        ) VALUES (
          ${userId}, ${email}, ${fullName}, ${phone || null}, ${headline || null},
          ${location || null}, ${willingToRelocate ?? true}, ${linkedinUrl || null},
          ${portfolioUrl || null}, ${bio || null}
        )
        RETURNING *
      `;
      profile = results[0];
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile", details: String(error) },
      { status: 500 }
    );
  }
}
