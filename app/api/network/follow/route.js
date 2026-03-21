import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !session.universityID)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { targetID } = await request.json();
    if (!targetID)
      return NextResponse.json(
        { error: "Missing target user ID" },
        { status: 400 },
      );

    const existing = await prisma.follows.findUnique({
      where: {
        followerID_followingID: {
          followerID: session.universityID,
          followingID: targetID,
        },
      },
    });

    if (existing)
      return NextResponse.json({ error: "Already following" }, { status: 409 });

    const follow = await prisma.follows.create({
      data: {
        followerID: session.universityID,
        followingID: targetID,
        requestStatus: "ACCEPTED",
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    console.error("Follow POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session || !session.universityID)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { targetID } = await request.json();
    if (!targetID)
      return NextResponse.json(
        { error: "Missing target user ID" },
        { status: 400 },
      );

    await prisma.follows.deleteMany({
      where: { followerID: session.universityID, followingID: targetID },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Follow DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
