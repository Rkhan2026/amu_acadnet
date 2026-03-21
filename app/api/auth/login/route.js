import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Attempt to log in as Admin first
    const adminUser = await prisma.admin.findUnique({ where: { email } });
    if (adminUser) {
      const match = await bcrypt.compare(password, adminUser.password);
      if (match) {
        const sessionUser = {
          adminID: adminUser.adminID,
          name: adminUser.name,
          email: adminUser.email,
          role: "ADMIN",
        };
        await setSession({ adminID: adminUser.adminID, role: "ADMIN" });
        return NextResponse.json({ user: sessionUser }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }
    }

    // If not Admin, check User table
    const standardUser = await prisma.user.findUnique({ where: { email } });
    if (standardUser) {
      const match = await bcrypt.compare(password, standardUser.password);
      if (match) {
        // Prevent login if rejected or pending?
        // Wait, often pending users can't fully login, but let's just authenticate them and let UI handle lockouts
        if (standardUser.accountStatus === "REJECTED") {
          return NextResponse.json(
            { error: "Your account has been rejected" },
            { status: 403 },
          );
        }

        const sessionUser = {
          universityID: standardUser.universityID,
          name: standardUser.name,
          email: standardUser.email,
          role: standardUser.role,
          accountStatus: standardUser.accountStatus,
          department: standardUser.department,
        };
        await setSession({
          universityID: standardUser.universityID,
          role: standardUser.role,
        });
        return NextResponse.json({ user: sessionUser }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 },
    );
  }
}
