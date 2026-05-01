import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { projectID } = resolvedParams;

    const project = await prisma.academicProject.findUnique({
      where: { projectID: projectID },
      include: {
        creator: { select: { name: true, department: true } },
        collaborations: {
          where: { requestStatus: "ACCEPTED" },
          include: {
            sender: { select: { name: true, role: true, department: true } },
          },
        },
        teamMembers: {
          select: {
            universityID: true,
            name: true,
            role: true,
            department: true,
          },
        },
      },
    });

    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Project GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { projectID } = resolvedParams;

    // Verify ownership
    const existing = await prisma.academicProject.findUnique({
      where: { projectID },
    });
    if (
      !existing ||
      (existing.universityID !== session.universityID &&
        session.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.academicProject.delete({
      where: { projectID },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { projectID } = resolvedParams;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.academicProject.findUnique({
      where: { projectID: projectID },
    });
    if (
      !existing ||
      (existing.universityID !== session.universityID &&
        session.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.academicProject.update({
      where: { projectID: projectID },
      data: {
        title: body.title,
        description: body.description,
        projectDomain: body.domain ? body.domain.toLowerCase() : "",
        projectStatus:
          body.projectStatus === "Active"
            ? "ACTIVE"
            : body.projectStatus === "On Hold"
              ? "ON_HOLD"
              : body.projectStatus === "Proposed"
                ? "PROPOSED"
                : body.projectStatus === "Archived"
                  ? "ARCHIVED"
                  : "COMPLETED",
        requirements: Array.isArray(body.requirements)
          ? body.requirements.map((r) => r.toLowerCase())
          : [],
        externalLinks: body.externalLinks.map((l) => l.url || l),
        ...(existing.moderationStatus === "REJECTED"
          ? {
              moderationStatus: "PENDING",
              adminFeedback: "No feedback yet",
            }
          : {}),
      },
    });

    if (body.removedMembers && body.removedMembers.length > 0) {
      await prisma.collaboration.deleteMany({
        where: {
          requestID: { in: body.removedMembers },
          projectID: projectID,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Project PUT Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
