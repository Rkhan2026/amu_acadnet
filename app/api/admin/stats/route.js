import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all users to calculate distribution in-memory for better robustness
    const [users, projects] = await Promise.all([
      prisma.user.findMany({
        select: { role: true, accountStatus: true },
      }),
      prisma.researchProject.findMany({
        select: { moderationStatus: true },
      }),
    ]);

    const totalUsers = users.length;
    const pendingVerifications = users.filter(
      (u) => u.accountStatus === "PENDING",
    ).length;
    const totalPublications = projects.length;
    const pendingModerations = projects.filter(
      (p) => p.moderationStatus === "PENDING",
    ).length;

    // Dynamically calculate distribution based on current roles in DB
    const students = users.filter((u) => u.role === "STUDENT").length;
    const faculty = users.filter((u) => u.role === "FACULTY").length;
    const scholars = users.filter((u) => u.role === "RESEARCH SCHOLAR").length;

    return NextResponse.json({
      totalUsers,
      pendingVerifications,
      totalPublications,
      pendingModerations,
      profileDistribution: [
        { label: "Students", value: students, color: "bg-amu-green" },
        { label: "Faculty", value: faculty, color: "bg-amu-gold" },
        { label: "Research Scholars", value: scholars, color: "bg-blue-500" },
      ],
    });
  } catch (error) {
    console.error("Admin Stats GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
