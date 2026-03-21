import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
      },
      take: 5,
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
