import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BASE_URL = "http://localhost:3000/api";

function getCookieHeader(sessionData) {
  return `session=${encodeURIComponent(JSON.stringify(sessionData))}`;
}

const aliceSession = {
  universityID: "AU-2024-001",
  role: "STUDENT",
  name: "Alice Rahman",
  email: "alice.rahman@amu.ac.in",
  department: "Computer Science",
};

async function verify() {
  try {
    console.log("--- Starting Project Visibility Verification ---");

    // 1. Get Alice's first project
    const project = await prisma.researchProject.findFirst({
      where: { universityID: aliceSession.universityID },
    });

    if (!project) {
      console.error("❌ No project found for Alice. Please run seed first.");
      return;
    }

    const projectId = project.projectID;
    console.log(`Found project: ${project.title} (ID: ${projectId})`);

    // 2. Test GET /api/projects/[id]
    console.log(`\nTesting GET /api/projects/${projectId}...`);
    const resp = await fetch(`${BASE_URL}/projects/${projectId}`, {
      headers: { Cookie: getCookieHeader(aliceSession) },
    });

    const data = await resp.json();
    if (resp.ok && data.projectID === projectId) {
      console.log("✅ GET SUCCESS: Fetched by UUID string");
    } else {
      console.error("❌ GET FAILED", data);
    }

    // 3. Test PUT /api/projects/[id] with archived status
    console.log(
      `\nTesting PUT /api/projects/${projectId} (Status: Archived)...`,
    );
    const putResp = await fetch(`${BASE_URL}/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: getCookieHeader(aliceSession),
      },
      body: JSON.stringify({
        title: project.title + " (Modified)",
        description: project.description,
        domain: project.researchDomain,
        projectStatus: "Archived",
        externalLinks: [],
      }),
    });

    const putData = await putResp.json();
    if (putResp.ok && putData.projectStatus === "ARCHIVED") {
      console.log("✅ PUT SUCCESS: Updated status to ARCHIVED using UUID");
    } else {
      console.error("❌ PUT FAILED", putData);
    }
  } catch (error) {
    console.error("Verification error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
