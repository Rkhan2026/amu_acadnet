import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      universityID,
      name,
      email,
      password,
      role,
      department,
      profilePhoto,
      identityProof,
    } = data;

    if (
      !universityID ||
      !name ||
      !email ||
      !password ||
      !role ||
      !department ||
      !identityProof
    ) {
      return NextResponse.json(
        { error: "Missing required fields. Only profile photo is optional." },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { universityID }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or ID already exists" },
        { status: 409 },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let identityProofUrl = null;
    if (identityProof) {
      const identityPublicId = `${universityID}_Identity_Proof`;
      identityProofUrl = await uploadToCloudinary(
        identityProof,
        "acadnet/identity_proofs",
        identityPublicId,
      );
    }

    let profilePhotoUrl = "/default-avatar.svg";
    if (profilePhoto) {
      const profilePublicId = `${universityID}_Profile_Photo`;
      profilePhotoUrl = await uploadToCloudinary(
        profilePhoto,
        "acadnet/profile_photos",
        profilePublicId,
      );
    }

    // Create the user with academic profile
    await prisma.user.create({
      data: {
        universityID,
        name,
        email,
        password: hashedPassword,
        role,
        department,
        accountStatus: "PENDING",
        identityProof: identityProofUrl,
        profilePhoto: profilePhotoUrl,
        academicProfile: {
          create: {
            interestsSkills: data.domain ? [data.domain.toLowerCase()] : [],
            biography: data.biography || "",
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Registration successful! Awaiting admin approval." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 },
    );
  }
}
