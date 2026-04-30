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
    const { projectID } = resolvedParams;
    const body = await request.json();
    const { moderationStatus, adminFeedback } = body; // 'APPROVED' | 'REJECTED'

    if (
      !moderationStatus ||
      !["APPROVED", "REJECTED", "PENDING"].includes(moderationStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid moderation status" },
        { status: 400 },
      );
    }

    const updatedProject = await prisma.researchProject.update({
      where: { projectID },
      data: {
        moderationStatus,
        projectStatus: moderationStatus === "APPROVED" ? "ACTIVE" : "ON_HOLD",
        ...(adminFeedback !== undefined && { adminFeedback }),
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Project Moderation Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
