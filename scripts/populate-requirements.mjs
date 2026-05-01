import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const requirementTemplates = [
  {
    keywords: [
      "AI",
      "Intelligence",
      "ML",
      "Machine Learning",
      "Neural",
      "Deep Learning",
      "Vision",
      "NLP",
    ],
    skills: [
      "python",
      "pytorch",
      "tensorflow",
      "scikit-learn",
      "numpy",
      "pandas",
      "neural networks",
      "deep learning",
    ],
  },
  {
    keywords: [
      "IoT",
      "Internet of Things",
      "Sensor",
      "Arduino",
      "Raspberry",
      "Embedded",
      "Hardware",
    ],
    skills: [
      "c++",
      "micro-python",
      "arduino",
      "raspberry pi",
      "mqtt",
      "lorawan",
      "circuit design",
      "embedded systems",
    ],
  },
  {
    keywords: [
      "Medical",
      "Health",
      "Disease",
      "Clinical",
      "Bio",
      "Genetics",
      "CRISPR",
    ],
    skills: [
      "bioinformatics",
      "genomic analysis",
      "biomedical ethics",
      "data privacy",
      "lab protocols",
      "statistics",
    ],
  },
  {
    keywords: [
      "Cryptograph",
      "Security",
      "Quantum",
      "Privacy",
      "Lattice",
      "Cyber",
    ],
    skills: [
      "cryptography",
      "network security",
      "cybersecurity",
      "quantum computing",
      "abstract algebra",
      "secure coding",
    ],
  },
  {
    keywords: [
      "Energy",
      "Sustainability",
      "Power",
      "Green",
      "Solar",
      "Environmental",
    ],
    skills: [
      "renewable energy",
      "sustainability",
      "energy modeling",
      "environmental policy",
      "solar technology",
      "efficiency analysis",
    ],
  },
  {
    keywords: [
      "Web",
      "App",
      "Platform",
      "Software",
      "System",
      "Development",
      "Full Stack",
    ],
    skills: [
      "javascript",
      "react",
      "next.js",
      "node.js",
      "postgresql",
      "prisma",
      "git",
      "full-stack",
      "api design",
    ],
  },
];

const defaultSkills = [
  "technical writing",
  "critical thinking",
  "research methodology",
  "collaboration",
  "git",
];

async function main() {
  console.log("Fetching all academic projects...");

  let projects;
  projects = await prisma.academicProject.findMany();

  console.log(`Found ${projects.length} projects.`);

  for (const project of projects) {
    let selectedSkills = new Set();
    const content = (project.title + " " + project.description).toLowerCase();
    const domain = (project.projectDomain || "").toLowerCase();

    for (const template of requirementTemplates) {
      if (
        template.keywords.some(
          (keyword) =>
            content.includes(keyword.toLowerCase()) ||
            domain.includes(keyword.toLowerCase()),
        )
      ) {
        template.skills.forEach((skill) =>
          selectedSkills.add(skill.toLowerCase()),
        );
      }
    }

    // Limit or supplement
    let skillsArray = Array.from(selectedSkills);

    if (skillsArray.length === 0) {
      skillsArray = [...defaultSkills];
    }

    // Take a max of 6 relevant skills
    if (skillsArray.length > 6) {
      skillsArray = skillsArray.sort(() => 0.5 - Math.random()).slice(0, 6);
    }

    console.log(
      `Updating project [${project.title}] with skills: [${skillsArray.join(", ")}]`,
    );

    await prisma.academicProject.update({
      where: { projectID: project.projectID },
      data: {
        requirements: skillsArray,
      },
    });
  }

  console.log(
    "\nSuccess: All projects updated with lowercase skill-based requirements.",
  );
}

main()
  .catch((e) => {
    console.error("Error updating projects:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
