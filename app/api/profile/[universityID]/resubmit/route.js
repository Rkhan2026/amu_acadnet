import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request, { params }) {
  try {
    const session = await getSession();
    const resolvedParams = await params;
    const { universityID } = resolvedParams;

    if (!session || session.universityID !== universityID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { universityID } });
    if (!user || user.accountStatus !== "REJECTED") {
      return NextResponse.json(
        { error: "Not eligible for resubmission" },
        { status: 400 },
      );
    }

    const body = await request.json();
    console.log(
      `Resubmit POST Request: body size ~${JSON.stringify(body).length / 1024} KB`,
    );
    const {
      name,
      email,
      role,
      department,
      biography,
      researchInterests,
      profilePhoto,
      identityProof,
      universityID: newUniversityID,
    } = body;

    let profilePhotoUrl = user.profilePhoto;
    if (profilePhoto) {
      const profilePublicId = `${newUniversityID || universityID}_Profile_Photo`;
      console.log(
        `Resubmit: Uploading profile photo to acadnet/profile_photos/${profilePublicId}`,
      );
      profilePhotoUrl =
        (await uploadToCloudinary(
          profilePhoto,
          "acadnet/profile_photos",
          profilePublicId,
        )) || profilePhotoUrl;
      console.log(`Resubmit: Profile photo success: ${profilePhotoUrl}`);
    }

    let identityProofUrl = user.identityProof;
    if (identityProof) {
      const identityPublicId = `${newUniversityID || universityID}_Identity_Proof`;
      console.log(
        `Resubmit: Uploading identity proof to acadnet/identity_proofs/${identityPublicId}`,
      );
      identityProofUrl =
        (await uploadToCloudinary(
          identityProof,
          "acadnet/identity_proofs",
          identityPublicId,
        )) || identityProofUrl;
      console.log(`Resubmit: Identity proof success: ${identityProofUrl}`);
    }

    // Since we are updating universityID (which is a primary key) we might need to recreate AcademicProfile or rely on DB cascading if available.
    // However, if Prisma allows it directly, we will try. If it fails due to FK constraints, it's a known DB limitation.
    await prisma.user.update({
      where: { universityID },
      data: {
        universityID: newUniversityID || user.universityID,
        name: name || user.name,
        email: email || user.email,
        role: role || user.role,
        department: department || user.department,
        accountStatus: "PENDING",
        profilePhoto: profilePhotoUrl,
        identityProof: identityProofUrl,
      },
    });

    const targetUniversityID = newUniversityID || universityID;
    const lowerInterests = researchInterests
      ? researchInterests.toLowerCase()
      : "";

    await prisma.academicProfile.upsert({
      where: { universityID: targetUniversityID },
      create: {
        universityID: targetUniversityID,
        biography: biography || "",
        researchInterests: lowerInterests,
      },
      update: {
        biography: biography,
        researchInterests: lowerInterests,
      },
    });

    return NextResponse.json(
      { message: "Resubmitted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resubmit Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
