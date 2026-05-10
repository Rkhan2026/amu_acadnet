"use server";

import { prisma } from "@/lib/prisma";

export async function getFullProfile(universityID) {
  return await prisma.user.findUnique({
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
          teamMembers: { select: { name: true, universityID: true } },
          collaborations: {
            where: { requestStatus: "ACCEPTED" },
            select: {
              sender: { select: { name: true, universityID: true } },
              receiver: { select: { name: true, universityID: true } },
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
              creator: { select: { name: true, universityID: true } },
            },
          },
          receiver: { select: { name: true, universityID: true } },
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
              creator: { select: { name: true, universityID: true } },
            },
          },
          sender: { select: { name: true, universityID: true } },
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
          creator: { select: { name: true, universityID: true } },
        },
      },
    },
  });
}

export async function filterProfileData(userData, session) {
  const isOwner = session?.universityID === userData.universityID;
  const isAdmin = session?.role?.toUpperCase() === "ADMIN";

  if (!isOwner && !isAdmin) {
    delete userData.identityProof;

    userData.createdProjects = (userData.createdProjects || []).filter(
      (p) => p.moderationStatus === "APPROVED",
    );
    userData.workingProjects = (userData.workingProjects || []).filter(
      (p) => p.moderationStatus === "APPROVED",
    );

    if (userData._count) {
      userData._count.createdProjects = userData.createdProjects.length;
      userData._count.workingProjects = userData.workingProjects.length;
    }

    userData.sentCollaborations = (userData.sentCollaborations || []).filter(
      (c) => c.project.moderationStatus === "APPROVED",
    );
    userData.receivedCollaborations = (
      userData.receivedCollaborations || []
    ).filter((c) => c.project.moderationStatus === "APPROVED");
  }

  return userData;
}

export async function resubmitProfile(universityID, data) {
  const {
    name,
    email,
    role,
    department,
    biography,
    interestsSkills,
    profilePhoto,
    identityProof,
  } = data;
  const user = await prisma.user.findUnique({ where: { universityID } });

  let profilePhotoUrl = profilePhoto || user.profilePhoto;
  let identityProofUrl = identityProof || user.identityProof;

  await prisma.user.update({
    where: { universityID },
    data: {
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      department: department || user.department,
      accountStatus: "PENDING",
      profilePhoto: profilePhotoUrl,
      identityProof: identityProofUrl,
    },
  });

  await prisma.academicProfile.upsert({
    where: { universityID },
    create: { universityID, biography: biography || "", interestsSkills },
    update: { biography, interestsSkills },
  });

  return { success: true };
}

export async function updateProfile(universityID, data) {
  const { name, department, interestsSkills, biography, profilePhotoUrl } =
    data;

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
      ...(interestsSkills !== undefined && { interestsSkills }),
      ...(biography !== undefined && { biography }),
    },
    create: {
      universityID,
      interestsSkills: interestsSkills || [],
      biography: biography || "",
    },
  });

  const fullUser = await prisma.user.findUnique({
    where: { universityID },
    include: { academicProfile: true },
  });

  const { password: _password, ...safeUser } = fullUser;
  return safeUser;
}

export async function searchUsers(filters, currentUniversityID) {
  const { all, interests } = filters;

  const whereClause = {
    accountStatus: "APPROVED",
  };

  if (currentUniversityID) {
    whereClause.universityID = { not: currentUniversityID };
  }

  if (interests && interests.length > 0) {
    whereClause.academicProfile = {
      OR: interests.map((topic) => ({
        interestsSkills: { has: topic },
      })),
    };
  }

  return await prisma.user.findMany({
    where: whereClause,
    select: {
      universityID: true,
      name: true,
      role: true,
      department: true,
      profilePhoto: true,
      academicProfile: {
        select: {
          interestsSkills: true,
          biography: true,
        },
      },
      _count: {
        select: {
          createdProjects: true,
          workingProjects: true,
        },
      },
    },
    ...(!all && { take: 5 }),
  });
}
