"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  const [users, projects, totalCollaborations] = await Promise.all([
    prisma.user.findMany({ select: { role: true, accountStatus: true } }),
    prisma.academicProject.findMany({ select: { moderationStatus: true } }),
    prisma.academicProject.count({ where: { teamMembers: { some: {} } } }),
  ]);

  const students = users.filter((u) => u.role === "STUDENT").length;
  const faculty = users.filter((u) => u.role === "FACULTY").length;
  const scholars = users.filter((u) => u.role === "RESEARCH SCHOLAR").length;

  return {
    totalUsers: users.length,
    pendingVerifications: users.filter((u) => u.accountStatus === "PENDING")
      .length,
    totalPublications: projects.length,
    pendingModerations: projects.filter((p) => p.moderationStatus === "PENDING")
      .length,
    totalCollaborations,
    profileDistribution: [
      { label: "Students", value: students, color: "bg-amu-green" },
      { label: "Faculty", value: faculty, color: "bg-amu-gold" },
      { label: "Research Scholars", value: scholars, color: "bg-blue-500" },
    ],
  };
}

export async function getCollaborativeProjects() {
  return await prisma.academicProject.findMany({
    where: { teamMembers: { some: {} } },
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
          profilePhoto: true,
        },
      },
      teamMembers: {
        select: {
          name: true,
          email: true,
          role: true,
          department: true,
          universityID: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllUsers(status) {
  const whereClause =
    status && status !== "ALL" ? { accountStatus: status } : {};
  return await prisma.user.findMany({
    where: whereClause,
    select: {
      universityID: true,
      name: true,
      email: true,
      department: true,
      role: true,
      accountStatus: true,
      adminFeedback: true,
      identityProof: true,
      profilePhoto: true,
      academicProfile: {
        select: { biography: true, interestsSkills: true },
      },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPendingUsers() {
  return await getAllUsers("PENDING");
}

export async function verifyUser(universityID, data) {
  const { accountStatus, adminFeedback } = data;
  return await prisma.user.update({
    where: { universityID },
    data: {
      accountStatus,
      ...(adminFeedback !== undefined && { adminFeedback }),
    },
    select: {
      universityID: true,
      name: true,
      email: true,
      accountStatus: true,
      adminFeedback: true,
    },
  });
}

export async function moderateProject(projectID, data) {
  const { moderationStatus, adminFeedback } = data;
  return await prisma.academicProject.update({
    where: { projectID },
    data: {
      moderationStatus,
      projectStatus: moderationStatus === "APPROVED" ? "ACTIVE" : "ON_HOLD",
      ...(adminFeedback !== undefined && { adminFeedback }),
    },
  });
}
