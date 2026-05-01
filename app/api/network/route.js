import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(_request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({
        currentUser: null,
        sentCollaborations: [],
        receivedCollaborations: [],
        following: [],
        followers: [],
      });
    }

    const { universityID, adminID } = session;

    const sentCollaborations = await prisma.collaboration.findMany({
      where: { senderID: universityID },
      include: {
        project: {
          include: {
            creator: {
              select: { name: true, profilePhoto: true },
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
              select: { name: true, profilePhoto: true },
            },
          },
        },
        sender: {
          select: { name: true, department: true, profilePhoto: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const following = await prisma.follows.findMany({
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

    let currentUser = null;

    if (universityID) {
      currentUser = await prisma.user.findUnique({
        where: { universityID },
        select: { name: true, universityID: true, role: true },
      });
    } else if (adminID) {
      currentUser = {
        name: session.name,
        universityID: adminID,
        role: "ADMIN",
      };
    }

    return NextResponse.json({
      currentUser,
      sentCollaborations,
      receivedCollaborations,
      following,
      followers,
    });
  } catch (error) {
    console.error("Network GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
