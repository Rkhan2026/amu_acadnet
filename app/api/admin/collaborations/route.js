import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collaborativeProjects = await prisma.academicProject.findMany({
      where: {
        teamMembers: {
          some: {},
        },
      },
      select: {
        title: true,
        projectID: true,
        projectDomain: true,
        description: true,
        moderationStatus: true,
        projectStatus: true,
        createdAt: true,
        creator: {
          select: {
            name: true,
            email: true,
            role: true,
            department: true,
            universityID: true,
          },
        },
        teamMembers: {
          select: {
            name: true,
            email: true,
            role: true,
            department: true,
            universityID: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(collaborativeProjects);
  } catch (error) {
    console.error("Admin Collaborations Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
