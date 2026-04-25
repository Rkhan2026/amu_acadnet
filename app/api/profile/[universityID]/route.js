import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request, { params }) {
  try {
    // Await params object for Next 15 compatibility
    const resolvedParams = await params;
    const { universityID } = resolvedParams;

    const user = await prisma.user.findUnique({
      where: { universityID },
      include: {
        academicProfile: true,
        followers: {
          include: { follower: { select: { name: true, role: true } } },
        },
        following: {
          include: { following: { select: { name: true, role: true } } },
        },
        createdProjects: {
          select: {
            projectID: true,
            title: true,
            description: true,
            researchDomain: true,
            projectStatus: true,
            createdAt: true,
            moderationStatus: true,
            teamMembers: {
              select: {
                name: true,
                universityID: true,
              },
            },
            collaborations: {
              where: { requestStatus: "ACCEPTED" },
              select: {
                sender: {
                  select: {
                    name: true,
                    universityID: true,
                  },
                },
                receiver: {
                  select: {
                    name: true,
                    universityID: true,
                  },
                },
              },
            },
          },
        },
        sentCollaborations: {
          where: { requestStatus: "ACCEPTED" },
          include: {
            project: {
              select: {
                projectID: true,
                universityID: true,
                title: true,
                description: true,
                researchDomain: true,
                projectStatus: true,
                createdAt: true,
                moderationStatus: true,
                creator: {
                  select: {
                    name: true,
                    universityID: true,
                  },
                },
              },
            },
            receiver: {
              select: {
                name: true,
                universityID: true,
              },
            },
          },
        },
        receivedCollaborations: {
          where: { requestStatus: "ACCEPTED" },
          include: {
            project: {
              select: {
                projectID: true,
                universityID: true,
                title: true,
                description: true,
                researchDomain: true,
                projectStatus: true,
                createdAt: true,
                moderationStatus: true,
                creator: {
                  select: {
                    name: true,
                    universityID: true,
                  },
                },
              },
            },
            sender: {
              select: {
                name: true,
                universityID: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove password
    const { password: _password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    const resolvedParams = await params;
    const { universityID } = resolvedParams;

    if (!session || session.universityID !== universityID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, department, researchInterests, biography } = body;

    // Update User model data if provided
    if (name || department) {
      await prisma.user.update({
        where: { universityID },
        data: {
          ...(name && { name }),
          ...(department && { department }),
        },
      });
    }

    await prisma.academicProfile.upsert({
      where: { universityID },
      update: { researchInterests, biography },
      create: { universityID, researchInterests, biography },
    });

    // Option to fetch user with new profile to return updated complete model
    const fullUser = await prisma.user.findUnique({
      where: { universityID },
      include: {
        academicProfile: true,
      },
    });

    const { password: _password, ...safeUser } = fullUser;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
