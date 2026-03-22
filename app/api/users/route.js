import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const users = await prisma.user.findMany({
      where: {
        accountStatus: "APPROVED",
        universityID: { not: session.universityID },
      },
      select: {
        universityID: true,
        name: true,
        role: true,
        department: true,
        academicProfile: {
          select: {
            researchInterests: true,
            biography: true,
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
