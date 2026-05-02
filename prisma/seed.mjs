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
      universityID: "GL1001",
      name: "Ahmed Khan",
      email: "ahmed.khan@sharklasers.com",
      password: userPassword,
      role: "STUDENT",
      department: "Computer Science",
      accountStatus: "APPROVED",
    },
  });

  const bob = await prisma.user.create({
    data: {
      universityID: "GL1002",
      name: "Fatima Zahra",
      email: "fatima.zahra@sharklasers.com",
      password: userPassword,
      role: "FACULTY",
      department: "Electrical Engineering",
      accountStatus: "APPROVED",
    },
  });

  const carol = await prisma.user.create({
    data: {
      universityID: "GL1003",
      name: "Omar Farooq",
      email: "omar.farooq@sharklasers.com",
      password: userPassword,
      role: "STUDENT",
      department: "Biotechnology",
      accountStatus: "APPROVED",
    },
  });

  const dave = await prisma.user.create({
    data: {
      universityID: "GL1004",
      name: "Zainab Ali",
      email: "zainab.ali@sharklasers.com",
      password: userPassword,
      role: "STUDENT",
      department: "Physics",
      accountStatus: "PENDING",
    },
  });

  const eve = await prisma.user.create({
    data: {
      universityID: "GL1005",
      name: "Ibrahim Hassan",
      email: "ibrahim.hassan@sharklasers.com",
      password: userPassword,
      role: "FACULTY",
      department: "Mathematics",
      accountStatus: "APPROVED",
    },
  });

  const mohd = await prisma.user.create({
    data: {
      universityID: "GL1006",
      name: "Maryam Siddiqui",
      email: "maryam.s@sharklasers.com",
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
    { name: "Mustafa Kamal", email: "mustafa.kamal@sharklasers.com" },
    { name: "Aisha Noori", email: "aisha.noori@sharklasers.com" },
    { name: "Bilal Ahmed", email: "bilal.ahmed@sharklasers.com" },
    { name: "Khadija Bano", email: "khadija.bano@sharklasers.com" },
  ];

  studentData.forEach((student, index) => {
    additionalUsers.push({
      universityID: `GL2${String(index + 1).padStart(3, "0")}`,
      name: student.name,
      email: student.email,
      password: userPassword,
      role: "STUDENT",
      department: "Computer Science",
      accountStatus: "APPROVED",
    });
  });

  const facultyData = [
    { name: "Dr. Yusuf Mansoor", email: "yusuf.mansoor@sharklasers.com" },
    { name: "Dr. Hassan Ali", email: "hassan.ali@sharklasers.com" },
    { name: "Dr. Sara Qureshi", email: "sara.qureshi@sharklasers.com" },
    { name: "Dr. Abdullah Aziz", email: "abdullah.aziz@sharklasers.com" },
    { name: "Dr. Nadia Sheikh", email: "nadia.sheikh@sharklasers.com" },
    { name: "Dr. Hamza Malik", email: "hamza.malik@sharklasers.com" },
    { name: "Dr. Laila Rashid", email: "laila.rashid@sharklasers.com" },
    { name: "Dr. Hussein Rizvi", email: "hussein.rizvi@sharklasers.com" },
    { name: "Dr. Maryam Jamil", email: "maryam.jamil@sharklasers.com" },
    { name: "Dr. Faisal Shah", email: "faisal.shah@sharklasers.com" },
  ];

  facultyData.forEach((faculty, index) => {
    additionalUsers.push({
      universityID: `GL3${String(index + 1).padStart(3, "0")}`,
      name: faculty.name,
      email: faculty.email,
      password: userPassword,
      role: "FACULTY",
      department: "Mathematics",
      accountStatus: "APPROVED",
    });
  });

  const scholarData = [
    { name: "Syed Ali", email: "syed.ali@sharklasers.com" },
    { name: "Razia Sultan", email: "razia.sultan@sharklasers.com" },
    { name: "Mohammed Anas", email: "mohammed.anas@sharklasers.com" },
    { name: "Sumaiya Khan", email: "sumaiya.khan@sharklasers.com" },
    { name: "Zaid Mansoori", email: "zaid.mansoori@sharklasers.com" },
    { name: "Hiba Fatima", email: "hiba.fatima@sharklasers.com" },
    { name: "Arshad Madni", email: "arshad.madni@sharklasers.com" },
    { name: "Sana Parveen", email: "sana.parveen@sharklasers.com" },
    { name: "Rayyan Ahmed", email: "rayyan.ahmed@sharklasers.com" },
    { name: "Bushra Tahseen", email: "bushra.tahseen@sharklasers.com" },
  ];

  scholarData.forEach((scholar, index) => {
    additionalUsers.push({
      universityID: `GL4${String(index + 1).padStart(3, "0")}`,
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
      requirements: ["python", "tensorflow", "medical imaging basics"],
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
      requirements: [
        "iot hardware",
        "data analytics",
        "wireless sensor networks",
      ],
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
      requirements: [
        "molecular biology",
        "crispr-cas9 labs",
        "genomics research",
      ],
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
      requirements: [
        "advanced mathematics",
        "cryptography",
        "quantum algorithms",
      ],
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
      reqs: ["quantum mechanics", "linear algebra", "python"],
    },
    {
      title: "Neuromorphic Computing Architectures",
      domain: "Computer Architecture",
      desc: "Designing brain-inspired computing hardware for low-power AI applications.",
      reqs: ["vlsi design", "computer architecture", "fpga"],
    },
    {
      title: "Sustainable Urban Drainage Systems",
      domain: "Civil Engineering",
      desc: "Analyzing the impact of permeable pavements on urban flood mitigation.",
      reqs: ["hydrology", "gis", "environmental engineering"],
    },
    {
      title: "Biodegradable Polymers from Agricultural Waste",
      domain: "Materials Science",
      desc: "Synthesizing and characterizing new biodegradable plastics using corn stover.",
      reqs: ["organic chemistry", "polymer science", "lab experience"],
    },
    {
      title: "Privacy-Preserving Federated Learning",
      domain: "Cybersecurity",
      desc: "Creating frameworks for secure multi-party machine learning without exposing raw data.",
      reqs: ["machine learning", "network security", "python"],
    },
    {
      title: "Next-Generation Perovskite Solar Cells",
      domain: "Renewable Energy",
      desc: "Improving the stability and efficiency of perovskite-based photovoltaic cells.",
      reqs: ["solid state physics", "materials characterization", "chemistry"],
    },
    {
      title: "Natural Language Processing for Low-Resource Languages",
      domain: "Artificial Intelligence",
      desc: "Building robust NLP models for regional Indian languages with limited datasets.",
      reqs: ["nlp", "pytorch", "linguistics basics"],
    },
    {
      title: "Microplastic Contamination in Groundwater",
      domain: "Environmental Science",
      desc: "Tracking the transport and degradation of microplastics in subsurface aquifers.",
      reqs: ["hydrogeology", "analytical chemistry", "field sampling"],
    },
    {
      title: "Blockchain for Supply Chain Transparency",
      domain: "Information Technology",
      desc: "Implementing decentralized ledgers to trace pharmaceutical supply chains.",
      reqs: ["solidity", "node.js", "supply chain knowledge"],
    },
    {
      title: "Islamic Banking and Fintech Integration",
      domain: "Finance & Economics",
      desc: "Exploring how blockchain and smart contracts can be used in Sharia-compliant financial systems.",
      reqs: ["islamic finance", "smart contracts", "economics"],
    },
    {
      title: "Arabic Calligraphy Recognition using CNNs",
      domain: "Computer Vision",
      desc: "Developing deep learning models to identify and categorize classical Arabic script styles.",
      reqs: ["deep learning", "opencv", "arabic script knowledge"],
    },
    {
      title: "Impact of Air Pollution on Aligarh Monuments",
      domain: "Historical Preservation",
      desc: "Chemical analysis of stone degradation in 19th-century structures due to local emissions.",
      reqs: ["chemical analysis", "architecture", "environmental science"],
    },
    {
      title: "Zero-Knowledge Proofs for Academic Credentials",
      domain: "Cryptography",
      desc: "Securing university degree verification using ZK-SNARKs for privacy and authenticity.",
      reqs: ["cryptography", "zk-snarks", "web development"],
    },
    {
      title: "Smart Irrigation Systems for Semi-Arid Regions",
      domain: "Agricultural Engineering",
      desc: "IoT-based moisture sensing and automated irrigation for water conservation in farming.",
      reqs: ["iot", "agriculture basics", "arduino/esp32"],
    },
  ];

  pendingProjectData.forEach((data, index) => {
    additionalProjects.push({
      title: data.title,
      description: data.desc,
      projectDomain: data.domain.toLowerCase(),
      moderationStatus: "PENDING",
      projectStatus: "ACTIVE",
      requirements: data.reqs || ["general research", "good communication"],
      universityID:
        additionalUsers[index % additionalUsers.length].universityID,
    });
  });

  const approvedProjectData = [
    {
      title: "Targeted Drug Delivery via Nanoparticles",
      domain: "Nanotechnology",
      desc: "Engineering lipid nanoparticles for precise delivery of chemotherapeutics.",
      reqs: ["nanotechnology", "drug delivery systems", "biochemistry"],
    },
    {
      title: "Autonomous Swarm Robotics for Search and Rescue",
      domain: "Robotics",
      desc: "Developing coordination protocols for robot swarms in disaster zones.",
      reqs: ["robotics", "ros", "control systems"],
    },
    {
      title: "Deep Learning for Climate Modeling",
      domain: "Climate Science",
      desc: "Applying neural networks to predict localized climate change impacts.",
      reqs: ["python", "climate science", "deep learning"],
    },
    {
      title: "Advanced Materials for Solid-State Batteries",
      domain: "Materials Engineering",
      desc: "Investigating solid electrolytes for safer and higher-capacity lithium batteries.",
      reqs: ["electrochemistry", "materials science", "lab work"],
    },
    {
      title: "Explainable AI in Medical Diagnostics",
      domain: "Healthcare AI",
      desc: "Designing interpretability methods for deep learning models used in radiology.",
      reqs: ["xai", "medical imaging", "pytorch"],
    },
    {
      title: "Smart Grid Resilience Against Cyber Attacks",
      domain: "Cyber-Physical Systems",
      desc: "Formulating defense mechanisms to protect smart electrical grids from intrusions.",
      reqs: ["cybersecurity", "power systems", "network protocols"],
    },
    {
      title: "Precision Agriculture using Drone Imagery",
      domain: "Agricultural Tech",
      desc: "Using computer vision to analyze multispectral drone imagery for crop health assessment.",
      reqs: ["computer vision", "drones", "remote sensing"],
    },
    {
      title: "5G Network Optimization via Machine Learning",
      domain: "Telecommunications",
      desc: "Applying reinforcement learning to optimize resource allocation in 5G networks.",
      reqs: ["5g networks", "reinforcement learning", "networking"],
    },
    {
      title: "Cognitive Behavioral Therapy via Chatbots",
      domain: "Human-Computer Interaction",
      desc: "Evaluating the effectiveness of conversational agents in delivering initial mental health support.",
      reqs: ["hci", "nlp", "psychology basics"],
    },
    {
      title: "Genetic Basis of Drought Tolerance in Wheat",
      domain: "Plant Genetics",
      desc: "Identifying key genes responsible for drought resilience in various wheat cultivars.",
      reqs: ["genetics", "bioinformatics", "plant science"],
    },
    {
      title: "Advanced Quantum Error Correction",
      domain: "Quantum Physics",
      desc: "Developing novel codes to mitigate decoherence in superconducting qubits.",
      reqs: ["quantum physics", "error correction codes", "math"],
    },
    {
      title: "Sociological Impact of Remote Education",
      domain: "Social Science",
      desc: "Studying the long-term effects of online learning on student social development in India.",
      reqs: ["sociology", "data collection", "statistics"],
    },
    {
      title: "Hybrid Electric VTOL Aircraft Design",
      domain: "Aerospace Engineering",
      desc: "Optimizing the propulsion and aerodynamics of vertical takeoff and landing vehicles.",
      reqs: ["aerodynamics", "electrical propulsion", "cfd"],
    },
    {
      title: "Waste-to-Energy Conversion in Aligarh",
      domain: "Energy Management",
      desc: "Feasibility study of a municipal solid waste incineration plant for power generation.",
      reqs: [
        "renewable energy",
        "environmental policy",
        "mechanical engineering",
      ],
    },
  ];

  approvedProjectData.forEach((data, index) => {
    additionalProjects.push({
      title: data.title,
      description: data.desc,
      projectDomain: data.domain.toLowerCase(),
      moderationStatus: "APPROVED",
      projectStatus: "ACTIVE",
      requirements: data.reqs || ["academic research", "documentation"],
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
      domain: "Biomedical Engineering",
      desc: "Engineering affordable 3D-printed prosthetic limbs for underprivileged communities.",
      status: "ON_HOLD",
      creator: carol,
      members: [additionalUsers[20], additionalUsers[21]],
    },
    {
      title: "Aligarh Smart City Data Analytics",
      domain: "Urban Planning",
      desc: "Aggregating traffic and utility data to improve city resource allocation.",
      reqs: ["data science", "urban planning", "python"],
      status: "ACTIVE",
      creator: additionalUsers[3],
      members: [additionalUsers[4], additionalUsers[5], additionalUsers[6]],
    },
    {
      title: "Urdu Poetry Sentiment Analysis",
      domain: "Computational Linguistics",
      desc: "Classifying emotional tones in classical Ghazals using transformers.",
      reqs: ["urdu literature", "transformers", "python"],
      status: "ACTIVE",
      creator: additionalUsers[10],
      members: [additionalUsers[11], mohd],
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
        requirements: (
          proj.reqs || ["team collaboration", "research skills"]
        ).map((r) => r.toLowerCase()),
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
    {
      followerID: additionalUsers[0].universityID,
      followingID: alice.universityID,
      requestStatus: "ACCEPTED",
    },
    {
      followerID: additionalUsers[5].universityID,
      followingID: additionalUsers[0].universityID,
      requestStatus: "ACCEPTED",
    },
    {
      followerID: additionalUsers[10].universityID,
      followingID: additionalUsers[5].universityID,
      requestStatus: "PENDING",
    },
    {
      followerID: additionalUsers[15].universityID,
      followingID: additionalUsers[10].universityID,
      requestStatus: "ACCEPTED",
    },
    {
      followerID: additionalUsers[20].universityID,
      followingID: additionalUsers[15].universityID,
      requestStatus: "ACCEPTED",
    },
  ];

  await prisma.follows.createMany({ data: followPairs });
  console.log(`✅ Follows created: ${followPairs.length} records.`);

  console.log("\n🎉 Seed complete! Summary:");
  console.log("   Admin  → rajesh.kumar@gmail.com      / admin123");
  console.log("   Users  → *@sharklasers.com         / password123");
  console.log(
    "   APPROVED: Ahmed, Fatima, Omar, Ibrahim, Maryam  |  PENDING: Zainab",
  );
  console.log(
    `   Projects: ${4 + additionalProjects.length + collaborationProjects.length}  |  Collaborations: ${3 + extraCollabs.length}  |  Follows: ${followPairs.length}`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
