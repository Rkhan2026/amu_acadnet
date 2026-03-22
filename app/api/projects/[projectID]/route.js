import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { projectID } = resolvedParams;

    const project = await prisma.researchProject.findUnique({
      where: { projectID: projectID },
      include: {
        creator: { select: { name: true, department: true } },
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

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { projectID } = resolvedParams;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.researchProject.findUnique({
      where: { projectID: projectID },
    });
    if (
      !existing ||
      (existing.universityID !== session.universityID &&
        session.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.researchProject.update({
      where: { projectID: projectID },
      data: {
        title: body.title,
        description: body.description,
        researchDomain: body.domain,
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
        externalLinks: body.externalLinks.map((l) => l.url || l),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Project PUT Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
