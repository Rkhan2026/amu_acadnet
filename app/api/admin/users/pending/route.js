import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const pendingUsers = await prisma.user.findMany({
      where: { accountStatus: "PENDING" },
      select: {
        universityID: true,
        name: true,
        email: true,
        department: true,
        role: true,
        accountStatus: true,
      },
      orderBy: { universityID: "asc" },
    });

    return NextResponse.json(pendingUsers);
  } catch (error) {
    console.error("Pending Users GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
