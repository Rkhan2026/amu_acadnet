import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();

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
        await setSession(sessionUser, rememberMe);
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
        // Block login if account status is still PENDING
        if (standardUser.accountStatus === "PENDING") {
          return NextResponse.json(
            { error: "Admin approval still pending" },
            { status: 403 },
          );
        }

        // Allow REJECTED users to login so they can view the rejection reason and resubmit
        // We will just set their session normally. The UI will redirect them.

        const sessionUser = {
          universityID: standardUser.universityID,
          name: standardUser.name,
          email: standardUser.email,
          role: standardUser.role,
          accountStatus: standardUser.accountStatus,
          department: standardUser.department,
        };
        await setSession(sessionUser, rememberMe);
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
