import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const { universityID, name, email, password, role, department } = data;

    if (!universityID || !name || !email || !password || !role || !department) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
        academicProfile: {
          create: {
            researchInterests: data.domain || "",
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
