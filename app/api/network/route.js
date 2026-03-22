import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(_request) {
  try {
    const session = await getSession();
    if (!session || !session.universityID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { universityID } = session;

    const sentCollaborations = await prisma.collaboration.findMany({
      where: { senderID: universityID },
      include: {
        project: true,
        receiver: { select: { name: true, department: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const receivedCollaborations = await prisma.collaboration.findMany({
      where: { receiverID: universityID },
      include: {
        project: true,
        sender: { select: { name: true, department: true } },
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
            followers: {
              where: { requestStatus: "ACCEPTED" },
              select: { followerID: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
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
