import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";

export async function GET(request) {
  try {
    const { universityID: sessionID } = await getAuthContext();
    // We allow guests to browse users but with limited features in UI

    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const interests = searchParams.get("interests");

    const whereClause = {
      accountStatus: "APPROVED",
    };

    if (sessionID) {
      whereClause.universityID = { not: sessionID };
    }

    if (interests) {
      const topics = interests
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (topics.length > 0) {
        whereClause.academicProfile = {
          OR: topics.map((topic) => ({
            researchInterests: {
              contains: topic,
              mode: "insensitive",
            },
          })),
        };
      }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        universityID: true,
        name: true,
        role: true,
        department: true,
        profilePhoto: true,
        academicProfile: {
          select: {
            researchInterests: true,
            biography: true,
          },
        },
        _count: {
          select: {
            createdProjects: true,
            workingProjects: true,
          },
        },
      },
      ...(!all && { take: 5 }),
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Users GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
