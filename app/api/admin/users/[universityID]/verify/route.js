import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const resolvedParams = await params;
    const { universityID } = resolvedParams;
    const { accountStatus, adminFeedback } = await request.json();

    if (!["APPROVED", "REJECTED"].includes(accountStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { universityID },
      data: {
        accountStatus,
        ...(adminFeedback !== undefined && { adminFeedback }),
      },
      select: {
        universityID: true,
        name: true,
        email: true,
        accountStatus: true,
        adminFeedback: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
