import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !session.universityID)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projectID, receiverID } = await request.json();

    if (!projectID || !receiverID) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existing = await prisma.collaboration.findFirst({
      where: { projectID, senderID: session.universityID, receiverID },
    });

    console.log("Creating collaboration request:", {
      projectID,
      senderID: session.universityID,
      receiverID,
    });

    if (existing) {
      console.log("Collaboration request already exists:", existing.requestID);
      return NextResponse.json(
        { error: "Collaboration request already sent" },
        { status: 409 },
      );
    }

    const collab = await prisma.collaboration.create({
      data: {
        projectID,
        senderID: session.universityID,
        receiverID,
        requestStatus: "PENDING",
      },
    });

    console.log(
      "Collaboration request created successfully:",
      collab.requestID,
    );
    return NextResponse.json(collab, { status: 201 });
  } catch (error) {
    console.error("Collaboration POST error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session || !session.universityID)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { requestID, requestStatus } = await request.json();

    if (!requestID || !["ACCEPTED", "REJECTED"].includes(requestStatus)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const collabReq = await prisma.collaboration.findUnique({
      where: { requestID },
    });
    if (!collabReq || collabReq.receiverID !== session.universityID) {
      return NextResponse.json(
        { error: "Not authorized or request not found" },
        { status: 403 },
      );
    }

    const updatedCollab = await prisma.collaboration.update({
      where: { requestID },
      data: { requestStatus },
    });

    return NextResponse.json(updatedCollab);
  } catch (error) {
    console.error("Collaboration PATCH error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
