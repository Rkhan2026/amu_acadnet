import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // ─── Clean up existing data (in dependency order) ────────────────────────
  await prisma.collaboration.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.researchProject.deleteMany();
  await prisma.academicProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();
  console.log("🗑️  Cleared existing data.");

  // ─── Admin ───────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.create({
    data: {
      adminID: "admin-001",
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@gmail.com",
      password: adminPassword,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ─── Users ───────────────────────────────────────────────────────────────
  const userPassword = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.create({
    data: {
      universityID: "AU-2024-001",
      name: "Aarav Sharma",
      email: "aarav.sharma@gmail.com",
      password: userPassword,
      role: "STUDENT",
      department: "Computer Science",
      accountStatus: "APPROVED",
    },
  });

  const bob = await prisma.user.create({
    data: {
      universityID: "AU-2024-002",
      name: "Bhavya Gupta",
      email: "bhavya.gupta@gmail.com",
      password: userPassword,
      role: "FACULTY",
      department: "Electrical Engineering",
      accountStatus: "APPROVED",
    },
  });

  const carol = await prisma.user.create({
    data: {
      universityID: "AU-2024-003",
      name: "Chitra Iyer",
      email: "chitra.iyer@gmail.com",
      password: userPassword,
      role: "STUDENT",
      department: "Biotechnology",
      accountStatus: "APPROVED",
    },
  });

  const dave = await prisma.user.create({
    data: {
      universityID: "AU-2024-004",
      name: "Deepak Verma",
      email: "deepak.verma@gmail.com",
      password: userPassword,
      role: "STUDENT",
      department: "Physics",
      accountStatus: "PENDING",
    },
  });

  const eve = await prisma.user.create({
    data: {
      universityID: "AU-2024-005",
      name: "Esha Reddy",
      email: "esha.reddy@gmail.com",
      password: userPassword,
      role: "FACULTY",
      department: "Mathematics",
      accountStatus: "APPROVED",
    },
  });

  console.log(
    `✅ Users created: ${[alice, bob, carol, dave, eve].map((u) => u.name).join(", ")}`,
  );

  // ─── Academic Profiles ───────────────────────────────────────────────────
  await prisma.academicProfile.createMany({
    data: [
      {
        universityID: alice.universityID,
        researchInterests: "Machine Learning, Computer Vision, NLP",
        biography:
          "Final year CS student passionate about AI applications in healthcare and education.",
      },
      {
        universityID: bob.universityID,
        researchInterests: "IoT, Embedded Systems, Signal Processing",
        biography:
          "Faculty member with 10+ years of industry experience in smart grid technology.",
      },
      {
        universityID: carol.universityID,
        researchInterests: "Genomics, Bioinformatics, CRISPR",
        biography:
          "Postgraduate researcher exploring gene-editing techniques for disease prevention.",
      },
      {
        universityID: eve.universityID,
        researchInterests: "Graph Theory, Cryptography, Quantum Algorithms",
        biography:
          "Associate Professor specializing in applied mathematics and theoretical computer science.",
      },
    ],
  });
  console.log("✅ Academic profiles created.");

  // ─── Research Projects ───────────────────────────────────────────────────
  const project1 = await prisma.researchProject.create({
    data: {
      title: "AI-Powered Diagnostic Tool for Early Disease Detection",
      description:
        "Developing a machine-learning pipeline that analyses medical imaging data to detect diseases at an early stage with high accuracy.",
      researchDomain: "Artificial Intelligence & Healthcare",
      moderationStatus: "APPROVED",
      projectStatus: "ACTIVE",
      externalLinks: [
        "https://github.com/amu/ai-diagnostics",
        "https://arxiv.org/example",
      ],
      universityID: alice.universityID,

      teamMembers: { connect: [{ universityID: bob.universityID }] },
    },
  });

  const project2 = await prisma.researchProject.create({
    data: {
      title: "Smart Campus Energy Management via IoT",
      description:
        "Designing an IoT-based framework to monitor, analyse, and optimise energy consumption across AMU campus buildings.",
      researchDomain: "Internet of Things & Sustainability",
      moderationStatus: "APPROVED",
      projectStatus: "ON_HOLD",
      externalLinks: ["https://doi.org/example-iot"],
      universityID: bob.universityID,

      teamMembers: {
        connect: [
          { universityID: alice.universityID },
          { universityID: eve.universityID },
        ],
      },
    },
  });

  const project3 = await prisma.researchProject.create({
    data: {
      title: "CRISPR-Based Therapeutics for Genetic Disorders",
      description:
        "Investigating gene-editing strategies using CRISPR-Cas9 frameworks to target inherited genetic disorders.",
      researchDomain: "Biotechnology & Genomics",
      moderationStatus: "PENDING",
      projectStatus: "COMPLETED",
      externalLinks: [],
      universityID: carol.universityID,
    },
  });

  const project4 = await prisma.researchProject.create({
    data: {
      title: "Post-Quantum Cryptographic Protocols",
      description:
        "Researching lattice-based cryptographic schemes resilient to quantum computing attacks.",
      researchDomain: "Cryptography & Quantum Computing",
      moderationStatus: "APPROVED",
      projectStatus: "ACTIVE",
      externalLinks: ["https://eprint.iacr.org/example"],
      universityID: eve.universityID,
    },
  });

  console.log(
    `✅ Research projects created: "${project1.title}", "${project2.title}", "${project3.title}", "${project4.title}"`,
  );

  // ─── Collaborations ──────────────────────────────────────────────────────
  // Carol asks to join Alice's AI project
  const collab1 = await prisma.collaboration.create({
    data: {
      projectID: project1.projectID,
      senderID: carol.universityID,
      receiverID: alice.universityID,
      requestStatus: "PENDING",
    },
  });

  // Alice asks to join Eve's crypto project
  const collab2 = await prisma.collaboration.create({
    data: {
      projectID: project4.projectID,
      senderID: alice.universityID,
      receiverID: eve.universityID,
      requestStatus: "ACCEPTED",
    },
  });

  // Bob asks to join Carol's bio project
  const collab3 = await prisma.collaboration.create({
    data: {
      projectID: project3.projectID,
      senderID: bob.universityID,
      receiverID: carol.universityID,
      requestStatus: "REJECTED",
    },
  });

  console.log(
    `✅ Collaborations created: ${[collab1, collab2, collab3].length} records.`,
  );

  // ─── Follows ─────────────────────────────────────────────────────────────
  // Alice follows Bob, Carol, Eve
  // Bob follows Eve
  // Carol follows Alice
  const followPairs = [
    {
      followerID: alice.universityID,
      followingID: bob.universityID,
      requestStatus: "ACCEPTED",
    },
    {
      followerID: alice.universityID,
      followingID: carol.universityID,
      requestStatus: "ACCEPTED",
    },
    {
      followerID: alice.universityID,
      followingID: eve.universityID,
      requestStatus: "PENDING",
    },
    {
      followerID: bob.universityID,
      followingID: eve.universityID,
      requestStatus: "ACCEPTED",
    },
    {
      followerID: carol.universityID,
      followingID: alice.universityID,
      requestStatus: "ACCEPTED",
    },
    {
      followerID: eve.universityID,
      followingID: bob.universityID,
      requestStatus: "ACCEPTED",
    },
  ];

  await prisma.follows.createMany({ data: followPairs });
  console.log(`✅ Follows created: ${followPairs.length} records.`);

  console.log("\n🎉 Seed complete! Summary:");
  console.log("   Admin  → rajesh.kumar@gmail.com      / admin123");
  console.log("   Users  → *@gmail.com              / password123");
  console.log("   APPROVED: Aarav, Bhavya, Chitra, Esha  |  PENDING: Deepak");
  console.log("   Projects: 4  |  Collaborations: 3  |  Follows: 6");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
