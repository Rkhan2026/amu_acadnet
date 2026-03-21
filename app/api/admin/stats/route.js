import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalUsers,
      pendingUsers,
      totalProjects,
      pendingProjects,
      students,
      faculty,
      alumni,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { accountStatus: "PENDING" } }),
      prisma.researchProject.count(),
      prisma.researchProject.count({ where: { moderationStatus: "PENDING" } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "FACULTY" } }),
      prisma.user.count({ where: { role: "ALUMNI" } }),
    ]);

    return NextResponse.json({
      totalUsers,
      pendingVerifications: pendingUsers,
      totalPublications: totalProjects,
      pendingModerations: pendingProjects,
      profileDistribution: [
        { label: "Students", value: students, color: "bg-amu-green" },
        { label: "Faculty", value: faculty, color: "bg-amu-gold" },
        { label: "Alumni", value: alumni, color: "bg-blue-500" },
        {
          label: "Staff",
          value: totalUsers - (students + faculty + alumni),
          color: "bg-purple-500",
        },
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
