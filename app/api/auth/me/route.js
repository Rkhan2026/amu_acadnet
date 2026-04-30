import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = null;
    if (session.role === "ADMIN") {
      user = await prisma.admin.findUnique({
        where: { adminID: session.adminID },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { universityID: session.universityID },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        ...session,
        profilePhoto: user.profilePhoto,
        accountStatus: user.accountStatus, // Always fresh
      },
    });
  } catch (error) {
    console.error("Session GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
