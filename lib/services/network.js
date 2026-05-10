"use server";

import { prisma } from "@/lib/prisma";

export async function getNetworkData(universityID) {
  const sentCollaborations = await prisma.collaboration.findMany({
    where: { senderID: universityID },
    include: {
      project: {
        include: {
          creator: {
            select: { name: true, profilePhoto: true, universityID: true },
          },
        },
      },
      receiver: {
        select: { name: true, department: true, profilePhoto: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const receivedCollaborations = await prisma.collaboration.findMany({
    where: { receiverID: universityID },
    include: {
      project: {
        include: {
          creator: {
            select: { name: true, profilePhoto: true, universityID: true },
          },
        },
      },
      sender: { select: { name: true, department: true, profilePhoto: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const workingProjects = await prisma.academicProject.findMany({
    where: { teamMembers: { some: { universityID } } },
    include: {
      creator: {
        select: { name: true, profilePhoto: true, universityID: true },
      },
      teamMembers: { select: { name: true, universityID: true } },
    },
  });

  const following = await prisma.follows.findMany({
    // ... rest unchanged
    where: { followerID: universityID },
    include: {
      following: {
        select: {
          name: true,
          department: true,
          profilePhoto: true,
          followers: {
            where: { requestStatus: "ACCEPTED" },
            select: { followerID: true },
          },
        },
      },
    },
  });

  const followers = await prisma.follows.findMany({
    where: { followingID: universityID },
    include: {
      follower: {
        select: {
          name: true,
          department: true,
          profilePhoto: true,
          followers: {
            where: { requestStatus: "ACCEPTED" },
            select: { followerID: true },
          },
        },
      },
    },
  });

  const currentUser = await prisma.user.findUnique({
    where: { universityID },
    select: { name: true, universityID: true, role: true },
  });

  return {
    currentUser,
    sentCollaborations,
    receivedCollaborations,
    workingProjects,
    following,
    followers,
  };
}

export async function manageFollow(action, params) {
  const { followerID, followingID, followID, requestStatus } = params;

  if (action === "FOLLOW") {
    return await prisma.follows.upsert({
      where: {
        followerID_followingID: { followerID, followingID },
      },
      update: { requestStatus: requestStatus || "PENDING" },
      create: {
        followerID,
        followingID,
        requestStatus: requestStatus || "PENDING",
      },
    });
  }

  if (action === "UPDATE") {
    const followReq = await prisma.follows.findUnique({ where: { followID } });
    if (!followReq || followReq.followingID !== followerID) {
      // Reuse followerID param for auth check
      throw new Error("Not authorized");
    }
    return await prisma.follows.update({
      where: { followID },
      data: { requestStatus },
    });
  }

  if (action === "UNFOLLOW") {
    const where = followID ? { followID } : { followerID, followingID };
    return await prisma.follows.deleteMany({ where });
  }
}

export async function manageCollaboration(action, data, universityID) {
  if (action === "CREATE") {
    const { projectID, receiverID } = data;
    const existing = await prisma.collaboration.findFirst({
      where: { projectID, senderID: universityID, receiverID },
    });
    if (existing) throw new Error("Collaboration request already sent");

    return await prisma.collaboration.create({
      data: {
        projectID,
        senderID: universityID,
        receiverID,
        requestStatus: "PENDING",
      },
    });
  }

  if (action === "UPDATE") {
    const { requestID, requestStatus } = data;
    const collabReq = await prisma.collaboration.findUnique({
      where: { requestID },
      include: { project: true },
    });

    if (!collabReq || collabReq.receiverID !== universityID) {
      throw new Error("Not authorized or request not found");
    }

    const updated = await prisma.collaboration.update({
      where: { requestID },
      data: { requestStatus },
    });

    if (requestStatus === "ACCEPTED") {
      const isInvite = collabReq.senderID === collabReq.project?.universityID;
      const newMemberID = isInvite ? collabReq.receiverID : collabReq.senderID;

      await prisma.academicProject.update({
        where: { projectID: collabReq.projectID },
        data: { teamMembers: { connect: { universityID: newMemberID } } },
      });
    }
    return updated;
  }

  if (action === "DELETE") {
    const { requestID } = data;
    const collabReq = await prisma.collaboration.findUnique({
      where: { requestID },
    });
    if (!collabReq) throw new Error("Request not found");

    if (
      collabReq.senderID !== universityID &&
      collabReq.receiverID !== universityID
    ) {
      throw new Error("Not authorized");
    }

    return await prisma.collaboration.delete({ where: { requestID } });
  }
}
