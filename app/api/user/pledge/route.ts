import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pledges = await sql`
      SELECT * FROM pledges WHERE user_id = ${userId}
    `;

    const pledge = pledges[0];
    if (!pledge) {
      return NextResponse.json({
        pledge: {
          signed: false,
          commitments: {
            relocate: false,
            hours: false,
            immediate: false,
            twoYears: false,
          },
        },
      });
    }

    return NextResponse.json({
      pledge: {
        signed: true,
        date: pledge.signed_at,
        commitments: {
          relocate: pledge.relocate,
          hours: pledge.hours,
          immediate: pledge.immediate,
          twoYears: pledge.two_years,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pledge", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { relocate, hours, immediate, twoYears } = body;

    const existingPledges = await sql`
      SELECT id FROM pledges WHERE user_id = ${userId}
    `;

    if (existingPledges[0]) {
      await sql`
        UPDATE pledges
        SET
          relocate = ${relocate},
          hours = ${hours},
          immediate = ${immediate},
          two_years = ${twoYears},
          signed_at = NOW()
        WHERE user_id = ${userId}
      `;
    } else {
      await sql`
        INSERT INTO pledges (user_id, relocate, hours, immediate, two_years)
        VALUES (${userId}, ${relocate}, ${hours}, ${immediate}, ${twoYears})
      `;
    }

    return NextResponse.json({
      pledge: {
        signed: true,
        date: new Date().toISOString(),
        commitments: { relocate, hours, immediate, twoYears },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save pledge", details: String(error) },
      { status: 500 }
    );
  }
}
