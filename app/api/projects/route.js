import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getProjectRecommendations } from "@/lib/recommendations/engine";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const universityID = searchParams.get("universityID");
    const moderationStatus = searchParams.get("moderationStatus");
    const projectDomain = searchParams.get("projectDomain");

    const whereClause = {};
    if (universityID) whereClause.universityID = universityID;
    if (moderationStatus) whereClause.moderationStatus = moderationStatus;
    if (projectDomain) whereClause.projectDomain = projectDomain;

    const projects = await prisma.academicProject.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { name: true, department: true, profilePhoto: true },
        },
        teamMembers: {
          select: {
            name: true,
            universityID: true,
            email: true,
            role: true,
            department: true,
            profilePhoto: true,
          },
        },
        collaborations: {
          where: { requestStatus: "ACCEPTED" },
          select: {
            sender: {
              select: {
                name: true,
                universityID: true,
                profilePhoto: true,
              },
            },
            receiver: {
              select: {
                name: true,
                universityID: true,
                profilePhoto: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Add match scores if a session exists
    const session = await getSession();
    if (session && session.universityID) {
      const projectsWithScores = await getProjectRecommendations(
        session.universityID,
        projects,
      );
      return NextResponse.json(projectsWithScores);
    }

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
    const {
      title,
      description,
      projectDomain: domain,
      externalLinks,
      projectStatus,
    } = data;

    const projectDomain = domain ? domain.toLowerCase() : "";

    if (!title || !description || !projectDomain) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newProject = await prisma.academicProject.create({
      data: {
        title,
        description,
        projectDomain,
        externalLinks: Array.isArray(externalLinks) ? externalLinks : [],
        requirements: Array.isArray(data.requirements)
          ? data.requirements.map((r) => r.toLowerCase())
          : [],
        universityID: session.universityID,
        moderationStatus: "PENDING",
        projectStatus:
          projectStatus === "On Hold"
            ? "ON_HOLD"
            : projectStatus
              ? projectStatus.toUpperCase()
              : "PROPOSED",
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
