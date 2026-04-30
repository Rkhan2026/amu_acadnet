import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountStatus = searchParams.get("accountStatus");

    const whereClause = {};
    if (accountStatus && accountStatus !== "ALL") {
      whereClause.accountStatus = accountStatus;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        universityID: true,
        name: true,
        email: true,
        department: true,
        role: true,
        accountStatus: true,
        adminFeedback: true,
        identityProof: true,
        profilePhoto: true,
        academicProfile: {
          select: {
            biography: true,
            researchInterests: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin Users GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
