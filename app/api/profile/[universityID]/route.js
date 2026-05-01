import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  try {
    // Await params object for Next 15 compatibility
    const resolvedParams = await params;
    const { universityID } = resolvedParams;

    const user = await prisma.user.findUnique({
      where: { universityID },
      include: {
        academicProfile: true,
        _count: {
          select: {
            followers: { where: { requestStatus: "ACCEPTED" } },
            createdProjects: true,
            workingProjects: true,
          },
        },
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
            projectDomain: true,
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
                projectDomain: true,
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
                projectDomain: true,
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
        workingProjects: {
          select: {
            projectID: true,
            universityID: true,
            title: true,
            description: true,
            projectDomain: true,
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
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Security: Only return identityProof if it's the user's own profile OR requester is admin
    const session = await getSession();
    const isOwner = session?.universityID === universityID;
    const isAdmin = session?.role?.toUpperCase() === "ADMIN";

    const { password: _password, ...userData } = user;
    if (!isOwner && !isAdmin) {
      delete userData.identityProof;

      // Filter projects to only show APPROVED ones for outsiders
      userData.createdProjects = (userData.createdProjects || []).filter(
        (p) => p.moderationStatus === "APPROVED",
      );
      userData.workingProjects = (userData.workingProjects || []).filter(
        (p) => p.moderationStatus === "APPROVED",
      );

      // Update counts to match filtered lists for outsiders
      if (userData._count) {
        userData._count.createdProjects = userData.createdProjects.length;
        userData._count.workingProjects = userData.workingProjects.length;
      }

      // Also filter collaboration lists for outsiders
      userData.sentCollaborations = (userData.sentCollaborations || []).filter(
        (c) => c.project.moderationStatus === "APPROVED",
      );
      userData.receivedCollaborations = (
        userData.receivedCollaborations || []
      ).filter((c) => c.project.moderationStatus === "APPROVED");
    }
    return NextResponse.json(userData);
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
    console.log(
      `Profile PUT Request: body size ~${JSON.stringify(body).length / 1024} KB`,
    );
    const {
      name,
      department,
      researchInterests: interests,
      biography,
      profilePhoto,
    } = body;
    const researchInterests = interests ? interests.toLowerCase() : "";

    let profilePhotoUrl = undefined;
    if (profilePhoto && profilePhoto.startsWith("data:")) {
      const profilePublicId = `${universityID}_Profile_Photo`;
      console.log(
        `Uploading to Cloudinary: folder="acadnet/profile_photos", public_id="${profilePublicId}"`,
      );
      profilePhotoUrl = await uploadToCloudinary(
        profilePhoto,
        "acadnet/profile_photos",
        profilePublicId,
      );
      console.log(`Cloudinary Upload Success: ${profilePhotoUrl}`);
    }

    // Update User model data if provided
    if (name || department || profilePhotoUrl) {
      await prisma.user.update({
        where: { universityID },
        data: {
          ...(name && { name }),
          ...(department && { department }),
          ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }),
        },
      });
    }

    await prisma.academicProfile.upsert({
      where: { universityID },
      update: {
        ...(researchInterests !== undefined && { researchInterests }),
        ...(biography !== undefined && { biography }),
      },
      create: {
        universityID,
        researchInterests: researchInterests || "",
        biography: biography || "",
      },
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
