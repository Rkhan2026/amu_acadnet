const BASE_URL = "http://localhost:3000/api";

// Create helper to generate the session cookie
function getCookieHeader(sessionData) {
  return `session=${encodeURIComponent(JSON.stringify(sessionData))}`;
}

const adminSession = {
  universityID: "ADM001",
  role: "ADMIN",
  name: "Admin Tester",
  email: "admin@test.com",
  department: "Administration",
};

const userSession = {
  universityID: "test_user_1",
  role: "STUDENT",
  name: "Test Student",
  email: "student@test.com",
  department: "Computer Science",
};

const userSession2 = {
  universityID: "test_user_2",
  role: "FACULTY",
  name: "Test Faculty",
  email: "faculty@test.com",
  department: "Physics",
};

async function testEndpoint(name, url, options, expectedStatus) {
  console.log(`\nTesting: ${name}`);
  console.log(`${options.method || "GET"} ${url}`);
  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (_e) {
      data = text;
    }

    if (
      response.status === expectedStatus ||
      (response.ok && !expectedStatus)
    ) {
      console.log(`✅ SUCCESS (${response.status})`);
      return data;
    } else {
      console.error(
        `❌ FAILED. Expected ${expectedStatus || "2xx"}, got ${response.status}`,
      );
      console.error(`Response:`, data);
      return null;
    }
  } catch (error) {
    console.error(`❌ ERROR:`, error.message);
    return null;
  }
}

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://1027338e3b67aea4800a2ea0d98e226e568b00a868e8806ace696e6a55e8a3d4:sk_K3oRAeBJCNe8H3EXpl5EU@db.prisma.io:5432/postgres?sslmode=require",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function setupDatabase() {
  console.log("--- Setting up test data in database ---");
  try {
    for (const session of [adminSession, userSession, userSession2]) {
      const exists = await prisma.user.findUnique({
        where: { universityID: session.universityID },
      });
      if (!exists) {
        await prisma.user.create({
          data: {
            universityID: session.universityID,
            name: session.name,
            email: session.email,
            password: "testpassword",
            role: session.role,
            department: session.department,
            accountStatus: "APPROVED",
          },
        });
        console.log(`Created test user: ${session.universityID}`);
      }
    }
  } catch (e) {
    console.error("Error creating users:", e);
  }
}

async function runTests() {
  await setupDatabase();
  console.log("--- Starting API Route Tests ---");

  // 1. Admin Pending Users
  await testEndpoint(
    "Admin Pending Users (Authorized)",
    "/admin/users/pending",
    {
      headers: { Cookie: getCookieHeader(adminSession) },
    },
    200,
  );

  await testEndpoint(
    "Admin Pending Users (Unauthorized)",
    "/admin/users/pending",
    {
      headers: { Cookie: getCookieHeader(userSession) },
    },
    403,
  );

  // 2. Network Info
  await testEndpoint(
    "Network GET",
    "/network",
    {
      headers: { Cookie: getCookieHeader(userSession) },
    },
    200,
  );

  // 3. Network Follow
  const targetID = "test_user_2";

  await testEndpoint(
    "Network POST Follow",
    "/network/follow",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: getCookieHeader(userSession),
      },
      body: JSON.stringify({ targetID }),
    },
    201,
  ); // Created

  // Trying to follow again should give conflict 409
  await testEndpoint(
    "Network POST Follow (Already following)",
    "/network/follow",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: getCookieHeader(userSession),
      },
      body: JSON.stringify({ targetID }),
    },
    409,
  );

  await testEndpoint(
    "Network DELETE Follow",
    "/network/follow",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: getCookieHeader(userSession),
      },
      body: JSON.stringify({ targetID }),
    },
    200,
  );

  // 4. Projects
  await testEndpoint(
    "Projects POST (Create)",
    "/projects",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: getCookieHeader(userSession),
      },
      body: JSON.stringify({
        title: "Test Project " + Date.now(),
        description: "A test project created by automated script.",
        researchDomain: "Computer Science",
        externalLinks: [],
      }),
    },
    201,
  );

  await testEndpoint(
    "Projects GET",
    "/projects?moderationStatus=PENDING",
    {
      headers: { Cookie: getCookieHeader(userSession) },
    },
    200,
  );

  // 5. Auth Logout
  await testEndpoint(
    "Auth POST Logout",
    "/auth/logout",
    {
      method: "POST",
    },
    200,
  );

  console.log("\n--- API Route Tests Completed ---");
}

runTests();
