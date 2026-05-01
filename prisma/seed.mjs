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
  await prisma.academicProject.deleteMany();
  await prisma.academicProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();
  console.log("🗑️  Cleared existing data.");

  // ─── Admin ───────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.create({
    data: {
      adminID: "admin-001",
      name: "Rajesh Kumar",
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
      email: "aarav.sharma@sharklasers.com",
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

  const mohd = await prisma.user.create({
    data: {
      universityID: "AU-2024-006",
      name: "Mohammad",
      email: "mohd1234@sharklasers.com",
      password: userPassword,
      role: "STUDENT",
      department: "Computer Science",
      accountStatus: "APPROVED",
    },
  });

  console.log(
    `✅ Users created: ${[alice, bob, carol, dave, eve, mohd].map((u) => u.name).join(", ")}`,
  );

  // ─── Generate Additional Users ───────────────────────────────────────────
  const additionalUsers = [];

  const studentData = [
    { name: "Rohan Mehra", email: "rohan.mehra@sharklasers.com" },
    { name: "Anjali Patel", email: "anjali.patel@sharklasers.com" },
    { name: "Vikram Singh", email: "vikram.singh@sharklasers.com" },
    { name: "Neha Kapoor", email: "neha.kapoor@sharklasers.com" },
  ];

  studentData.forEach((student, index) => {
    additionalUsers.push({
      universityID: `AU-2024-10${index + 1}`,
      name: student.name,
      email: student.email,
      password: userPassword,
      role: "STUDENT",
      department: "Computer Science",
      accountStatus: "APPROVED",
    });
  });

  const facultyData = [
    { name: "Dr. Ramesh Rao", email: "ramesh.rao@sharklasers.com" },
    { name: "Dr. Sunita Menon", email: "sunita.menon@sharklasers.com" },
    { name: "Dr. Arvind Kumar", email: "arvind.k@sharklasers.com" },
    { name: "Dr. Lakshmi Iyer", email: "lakshmi.iyer@sharklasers.com" },
    { name: "Dr. Prakash Desai", email: "prakash.desai@sharklasers.com" },
    { name: "Dr. Kavita Krishnan", email: "kavita.krishnan@sharklasers.com" },
    { name: "Dr. Sanjay Dutt", email: "sanjay.dutt@sharklasers.com" },
    { name: "Dr. Meena Kumari", email: "meena.kumari@sharklasers.com" },
    { name: "Dr. Anand Bhatia", email: "anand.bhatia@sharklasers.com" },
    { name: "Dr. Ritu Nanda", email: "ritu.nanda@sharklasers.com" },
  ];

  facultyData.forEach((faculty, index) => {
    additionalUsers.push({
      universityID: `AU-2024-20${index + 1}`,
      name: faculty.name,
      email: faculty.email,
      password: userPassword,
      role: "FACULTY",
      department: "Mathematics",
      accountStatus: "APPROVED",
    });
  });

  const scholarData = [
    { name: "Amit Joshi", email: "amit.joshi@sharklasers.com" },
    { name: "Pooja Chawla", email: "pooja.chawla@sharklasers.com" },
    { name: "Rahul Khanna", email: "rahul.khanna@sharklasers.com" },
    { name: "Sneha Reddy", email: "sneha.reddy@sharklasers.com" },
    { name: "Karan Singh", email: "karan.singh@sharklasers.com" },
    { name: "Divya Agarwal", email: "divya.agarwal@sharklasers.com" },
    { name: "Sameer Nair", email: "sameer.nair@sharklasers.com" },
    { name: "Priya Das", email: "priya.das@sharklasers.com" },
    { name: "Tarun Kumar", email: "tarun.kumar@sharklasers.com" },
    { name: "Swati Mishra", email: "swati.mishra@sharklasers.com" },
  ];

  scholarData.forEach((scholar, index) => {
    additionalUsers.push({
      universityID: `AU-2024-30${index + 1}`,
      name: scholar.name,
      email: scholar.email,
      password: userPassword,
      role: "RESEARCH SCHOLAR",
      department: "Physics",
      accountStatus: "APPROVED",
    });
  });

  await prisma.user.createMany({ data: additionalUsers });
  console.log(
    `✅ Generated 24 additional users (4 Students, 10 Faculty, 10 Research Scholars).`,
  );

  // ─── Academic Profiles ───────────────────────────────────────────────────
  await prisma.academicProfile.createMany({
    data: [
      {
        universityID: alice.universityID,
        researchInterests: "machine learning, computer vision, nlp",
        biography:
          "Final year CS student passionate about AI applications in healthcare and education.",
      },
      {
        universityID: bob.universityID,
        researchInterests: "iot, embedded systems, signal processing",
        biography:
          "Faculty member with 10+ years of industry experience in smart grid technology.",
      },
      {
        universityID: carol.universityID,
        researchInterests: "genomics, bioinformatics, crispr",
        biography:
          "Postgraduate researcher exploring gene-editing techniques for disease prevention.",
      },
      {
        universityID: eve.universityID,
        researchInterests: "graph theory, cryptography, quantum algorithms",
        biography:
          "Associate Professor specializing in applied mathematics and theoretical computer science.",
      },
    ],
  });
  console.log("✅ Academic profiles created.");

  // ─── Research Projects ───────────────────────────────────────────────────
  const project1 = await prisma.academicProject.create({
    data: {
      title: "AI-Powered Diagnostic Tool for Early Disease Detection",
      description:
        "Developing a machine-learning pipeline that analyses medical imaging data to detect diseases at an early stage with high accuracy.",
      projectDomain: "artificial intelligence & healthcare",
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

  const project2 = await prisma.academicProject.create({
    data: {
      title: "Smart Campus Energy Management via IoT",
      description:
        "Designing an IoT-based framework to monitor, analyse, and optimise energy consumption across AMU campus buildings.",
      projectDomain: "internet of things & sustainability",
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

  const project3 = await prisma.academicProject.create({
    data: {
      title: "CRISPR-Based Therapeutics for Genetic Disorders",
      description:
        "Investigating gene-editing strategies using CRISPR-Cas9 frameworks to target inherited genetic disorders.",
      projectDomain: "biotechnology & genomics",
      moderationStatus: "PENDING",
      projectStatus: "COMPLETED",
      externalLinks: [],
      universityID: carol.universityID,
    },
  });

  const project4 = await prisma.academicProject.create({
    data: {
      title: "Post-Quantum Cryptographic Protocols",
      description:
        "Researching lattice-based cryptographic schemes resilient to quantum computing attacks.",
      projectDomain: "cryptography & quantum computing",
      moderationStatus: "APPROVED",
      projectStatus: "ACTIVE",
      externalLinks: ["https://eprint.iacr.org/example"],
      universityID: eve.universityID,
    },
  });

  console.log(
    `✅ Research projects created: "${project1.title}", "${project2.title}", "${project3.title}", "${project4.title}"`,
  );

  // ─── Generate Additional Projects ────────────────────────────────────────
  const additionalProjects = [];

  const pendingProjectData = [
    {
      title: "Quantum Error Correction Algorithms",
      domain: "Quantum Computing",
      desc: "Developing novel algorithms to mitigate errors in near-term quantum devices.",
    },
    {
      title: "Neuromorphic Computing Architectures",
      domain: "Computer Architecture",
      desc: "Designing brain-inspired computing hardware for low-power AI applications.",
    },
    {
      title: "Sustainable Urban Drainage Systems",
      domain: "Civil Engineering",
      desc: "Analyzing the impact of permeable pavements on urban flood mitigation.",
    },
    {
      title: "Biodegradable Polymers from Agricultural Waste",
      domain: "Materials Science",
      desc: "Synthesizing and characterizing new biodegradable plastics using corn stover.",
    },
    {
      title: "Privacy-Preserving Federated Learning",
      domain: "Cybersecurity",
      desc: "Creating frameworks for secure multi-party machine learning without exposing raw data.",
    },
    {
      title: "Next-Generation Perovskite Solar Cells",
      domain: "Renewable Energy",
      desc: "Improving the stability and efficiency of perovskite-based photovoltaic cells.",
    },
    {
      title: "Natural Language Processing for Low-Resource Languages",
      domain: "Artificial Intelligence",
      desc: "Building robust NLP models for regional Indian languages with limited datasets.",
    },
    {
      title: "Microplastic Contamination in Groundwater",
      domain: "Environmental Science",
      desc: "Tracking the transport and degradation of microplastics in subsurface aquifers.",
    },
    {
      title: "Blockchain for Supply Chain Transparency",
      domain: "Information Technology",
      desc: "Implementing decentralized ledgers to trace pharmaceutical supply chains.",
    },
  ];

  pendingProjectData.forEach((data, index) => {
    additionalProjects.push({
      title: data.title,
      description: data.desc,
      projectDomain: data.domain.toLowerCase(),
      moderationStatus: "PENDING",
      projectStatus: "ACTIVE",
      universityID:
        additionalUsers[index % additionalUsers.length].universityID,
    });
  });

  const approvedProjectData = [
    {
      title: "Targeted Drug Delivery via Nanoparticles",
      domain: "Nanotechnology",
      desc: "Engineering lipid nanoparticles for precise delivery of chemotherapeutics.",
    },
    {
      title: "Autonomous Swarm Robotics for Search and Rescue",
      domain: "Robotics",
      desc: "Developing coordination protocols for robot swarms in disaster zones.",
    },
    {
      title: "Deep Learning for Climate Modeling",
      domain: "Climate Science",
      desc: "Applying neural networks to predict localized climate change impacts.",
    },
    {
      title: "Advanced Materials for Solid-State Batteries",
      domain: "Materials Engineering",
      desc: "Investigating solid electrolytes for safer and higher-capacity lithium batteries.",
    },
    {
      title: "Explainable AI in Medical Diagnostics",
      domain: "Healthcare AI",
      desc: "Designing interpretability methods for deep learning models used in radiology.",
    },
    {
      title: "Smart Grid Resilience Against Cyber Attacks",
      domain: "Cyber-Physical Systems",
      desc: "Formulating defense mechanisms to protect smart electrical grids from intrusions.",
    },
    {
      title: "Precision Agriculture using Drone Imagery",
      domain: "Agricultural Tech",
      desc: "Using computer vision to analyze multispectral drone imagery for crop health assessment.",
    },
    {
      title: "5G Network Optimization via Machine Learning",
      domain: "Telecommunications",
      desc: "Applying reinforcement learning to optimize resource allocation in 5G networks.",
    },
    {
      title: "Cognitive Behavioral Therapy via Chatbots",
      domain: "Human-Computer Interaction",
      desc: "Evaluating the effectiveness of conversational agents in delivering initial mental health support.",
    },
    {
      title: "Genetic Basis of Drought Tolerance in Wheat",
      domain: "Plant Genetics",
      desc: "Identifying key genes responsible for drought resilience in various wheat cultivars.",
    },
  ];

  approvedProjectData.forEach((data, index) => {
    additionalProjects.push({
      title: data.title,
      description: data.desc,
      projectDomain: data.domain.toLowerCase(),
      moderationStatus: "APPROVED",
      projectStatus: "ACTIVE",
      universityID:
        additionalUsers[(index + 9) % additionalUsers.length].universityID,
    });
  });

  await prisma.academicProject.createMany({ data: additionalProjects });
  console.log(
    `✅ Generated ${additionalProjects.length} additional projects (9 Pending, 10 Approved).`,
  );

  // ─── Generate Additional Collaborations (Projects with Team Members) ─────
  const collaborationProjects = [
    {
      title: "AMU Neural Network Research Initiative",
      desc: "Investigating deep learning architectures for Urdu text recognition and translation.",
      domain: "AI & Linguistics",
      status: "ACTIVE",
      creator: alice,
      members: [mohd, additionalUsers[0]],
    },
    {
      title: "Smart Grid Deployment in Aligarh City",
      desc: "Pilot project for implementing smart meters and load balancing in local residential areas.",
      domain: "Electrical Engineering",
      status: "ON_HOLD",
      creator: bob,
      members: [eve, additionalUsers[5]],
    },
    {
      title: "Ethical AI Framework for Academic Research",
      desc: "Developing guidelines for the responsible use of generative AI in university environments.",
      domain: "Ethics & Technology",
      status: "ACTIVE",
      creator: additionalUsers[1],
      members: [alice, additionalUsers[2]],
    },
    {
      title: "Water Quality Monitoring in North India",
      desc: "Using sensors and satellite imagery to track pollutant levels in the Ganges basin.",
      domain: "Environmental Engineering",
      status: "ACTIVE",
      creator: additionalUsers[8],
      members: [additionalUsers[9], bob],
    },
    {
      title: "Ancient Manuscript Digitization Project",
      desc: "Preserving historical AMU library manuscripts using high-resolution scanning and OCR.",
      domain: "Digital Humanities",
      status: "COMPLETED",
      creator: additionalUsers[15],
      members: [additionalUsers[16]],
    },
    {
      title: "Low-Cost Prosthetic Development",
      desc: "Engineering affordable 3D-printed prosthetic limbs for underprivileged communities.",
      domain: "Biomedical Engineering",
      status: "ON_HOLD",
      creator: carol,
      members: [additionalUsers[20], additionalUsers[21]],
    },
  ];

  for (const proj of collaborationProjects) {
    await prisma.academicProject.create({
      data: {
        title: proj.title,
        description: proj.desc,
        projectDomain: proj.domain.toLowerCase(),
        moderationStatus: "APPROVED",
        projectStatus: proj.status,
        universityID: proj.creator.universityID,
        teamMembers: {
          connect: proj.members.map((m) => ({ universityID: m.universityID })),
        },
      },
    });
  }

  console.log(
    `✅ Generated ${collaborationProjects.length} additional collaborative projects.`,
  );

  // ─── Collaborations ──────────────────────────────────────────────────────
  // Carol asks to join Alice's AI project
  await prisma.collaboration.create({
    data: {
      projectID: project1.projectID,
      senderID: carol.universityID,
      receiverID: alice.universityID,
      requestStatus: "PENDING",
    },
  });

  // Alice asks to join Eve's crypto project
  await prisma.collaboration.create({
    data: {
      projectID: project4.projectID,
      senderID: alice.universityID,
      receiverID: eve.universityID,
      requestStatus: "ACCEPTED",
    },
  });
  // Connect Alice to project4 team
  await prisma.academicProject.update({
    where: { projectID: project4.projectID },
    data: { teamMembers: { connect: { universityID: alice.universityID } } },
  });

  // Bob asks to join Carol's bio project
  await prisma.collaboration.create({
    data: {
      projectID: project3.projectID,
      senderID: bob.universityID,
      receiverID: carol.universityID,
      requestStatus: "ACCEPTED", // Changed from REJECTED
    },
  });
  // Connect Bob to project3 team
  await prisma.academicProject.update({
    where: { projectID: project3.projectID },
    data: { teamMembers: { connect: { universityID: bob.universityID } } },
  });

  // Additional 5 collaborations
  const extraCollabs = [
    { p: project1, s: eve, r: alice, st: "ACCEPTED" },
    { p: project4, s: bob, r: eve, st: "PENDING" },
    { p: project2, s: carol, r: bob, st: "ACCEPTED" },
    { p: project1, s: additionalUsers[3], r: alice, st: "ACCEPTED" },
    { p: project4, s: additionalUsers[10], r: eve, st: "PENDING" },
  ];

  for (const c of extraCollabs) {
    await prisma.collaboration.create({
      data: {
        projectID: c.p.projectID,
        senderID: c.s.universityID,
        receiverID: c.r.universityID,
        requestStatus: c.st,
      },
    });
    if (c.st === "ACCEPTED") {
      await prisma.academicProject.update({
        where: { projectID: c.p.projectID },
        data: { teamMembers: { connect: { universityID: c.s.universityID } } },
      });
    }
  }

  console.log(`✅ Collaborations created: ${3 + extraCollabs.length} records.`);

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
  console.log(
    "   APPROVED: Aarav, Bhavya, Chitra, Esha, Mohammad  |  PENDING: Deepak",
  );
  console.log(
    `   Projects: ${4 + additionalProjects.length + collaborationProjects.length}  |  Collaborations: ${3 + extraCollabs.length}  |  Follows: 6`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
