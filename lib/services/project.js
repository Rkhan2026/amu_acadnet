"use server";

import { prisma } from "@/lib/prisma";

export async function getProjectsList(filters) {
  const {
    domain,
    search,
    mine,
    universityID,
    userRole,
    status,
    following,
    excludeMe,
  } = filters;

  const whereClause = {
    ...(domain && { projectDomain: domain.toLowerCase() }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  // Filter by user if requested
  if (universityID && mine !== "true" && following !== "true") {
    whereClause.universityID = universityID;
  }

  // Filter by followed users if requested
  if (following === "true" && universityID) {
    const followedUsers = await prisma.follows.findMany({
      where: { followerID: universityID, requestStatus: "ACCEPTED" },
      select: { followingID: true },
    });
    const followedIds = followedUsers.map((f) => f.followingID);

    whereClause.universityID = {
      in: followedIds,
      ...(excludeMe && { not: excludeMe }),
    };
  } else if (mine === "true" && universityID) {
    whereClause.universityID = universityID;
  } else if (excludeMe) {
    whereClause.universityID = { not: excludeMe };
  }

  // Handle visibility based on role and context
  if (userRole === "ADMIN") {
    if (status) whereClause.moderationStatus = status;
    // Admin sees all projects for the specified universityID (if any) or globally
  } else if (universityID && mine === "true") {
    // Owner sees all their own projects
  } else {
    // Everyone else (including viewing other's profile) only sees approved projects
    whereClause.moderationStatus = "APPROVED";
  }

  return await prisma.academicProject.findMany({
    where: whereClause,
    include: {
      creator: { select: { name: true, profilePhoto: true } },
      teamMembers: {
        select: { universityID: true, name: true, profilePhoto: true },
      },
      collaborations: {
        where: { requestStatus: "ACCEPTED" },
        select: {
          sender: { select: { universityID: true, name: true } },
          receiver: { select: { universityID: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectDetail(projectID, universityID) {
  const project = await prisma.academicProject.findUnique({
    where: { projectID },
    include: {
      creator: { select: { name: true, department: true, profilePhoto: true } },
      collaborations: {
        where: { requestStatus: "ACCEPTED" },
        include: {
          sender: {
            select: {
              name: true,
              role: true,
              department: true,
              profilePhoto: true,
            },
          },
        },
      },
      teamMembers: {
        select: {
          universityID: true,
          name: true,
          role: true,
          department: true,
          profilePhoto: true,
        },
      },
    },
  });

  if (!project) return null;

  let userCollaboration = null;
  if (universityID) {
    userCollaboration = await prisma.collaboration.findFirst({
      where: {
        projectID,
        OR: [{ senderID: universityID }, { receiverID: universityID }],
      },
      select: { requestID: true, requestStatus: true },
    });
  }

  return { ...project, userCollaboration };
}

export async function updateProject(projectID, body, session) {
  const existing = await prisma.academicProject.findUnique({
    where: { projectID },
  });
  if (!existing) throw new Error("Project not found");

  if (
    existing.universityID !== session.universityID &&
    session.role !== "ADMIN"
  ) {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.academicProject.update({
    where: { projectID },
    data: {
      title: body.title,
      description: body.description,
      projectDomain: body.projectDomain ? body.projectDomain.toLowerCase() : "",
      projectStatus:
        body.projectStatus?.toUpperCase().replace(" ", "_") || "PROPOSED",
      requirements: body.requirements,
      externalLinks: (body.externalLinks || []).map((l) => l.url || l),
      ...(existing.moderationStatus === "REJECTED"
        ? { moderationStatus: "PENDING", adminFeedback: "No feedback yet" }
        : {}),
    },
  });

  if (body.removedMembers?.length > 0) {
    await prisma.collaboration.deleteMany({
      where: {
        requestID: { in: body.removedMembers },
        projectID,
      },
    });
  }

  return updated;
}

export async function createProject(universityID, data) {
  const {
    title,
    description,
    projectDomain,
    requirements,
    externalLinks,
    projectStatus,
  } = data;

  return await prisma.academicProject.create({
    data: {
      universityID,
      title,
      description,
      projectDomain: projectDomain.toLowerCase(),
      requirements: requirements || [],
      externalLinks: (externalLinks || []).map((l) => l.url || l),
      projectStatus: projectStatus
        ? projectStatus.toUpperCase().replace(" ", "_")
        : "PROPOSED",
      moderationStatus: "PENDING",
    },
  });
}

export async function deleteProject(projectID, session) {
  const existing = await prisma.academicProject.findUnique({
    where: { projectID },
  });
  if (!existing) throw new Error("Project not found");

  if (
    existing.universityID !== session.universityID &&
    session.role !== "ADMIN"
  ) {
    throw new Error("Unauthorized");
  }

  return await prisma.academicProject.delete({ where: { projectID } });
}
