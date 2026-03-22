import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const universityID = searchParams.get("universityID");
    const moderationStatus = searchParams.get("moderationStatus");

    const whereClause = {};
    if (universityID) whereClause.universityID = universityID;
    if (moderationStatus) whereClause.moderationStatus = moderationStatus;

    const projects = await prisma.researchProject.findMany({
      where: whereClause,
      include: {
        creator: { select: { name: true, department: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (
      !session ||
      (session.role !== "USER" &&
        session.role !== "FACULTY" &&
        session.role !== "STUDENT")
    ) {
      // Allow any user role except maybe Admin? Let's just check if session has universityID
      if (!session?.universityID) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const data = await request.json();
    const { title, description, researchDomain, externalLinks, projectStatus } =
      data;

    if (!title || !description || !researchDomain) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newProject = await prisma.researchProject.create({
      data: {
        title,
        description,
        researchDomain,
        externalLinks: Array.isArray(externalLinks) ? externalLinks : [],
        universityID: session.universityID,
        moderationStatus: "PENDING",
        projectStatus: projectStatus ? projectStatus.toUpperCase() : "PROPOSED",
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Projects POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
