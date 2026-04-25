const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const project = await prisma.researchProject.findFirst({
    where: { title: { contains: "AI-Powered Diagnostic Tool" } },
    include: {
      teamMembers: true,
      collaborations: {
        include: {
          sender: true,
          receiver: true,
        },
      },
    },
  });

  if (!project) {
    console.log("Project not found");
    return;
  }

  console.log("Project:", project.title);
  console.log("Creator ID:", project.universityID);

  console.log("\nTeam Members (Direct):");
  project.teamMembers.forEach((m) => {
    console.log(`- ${m.name} (${m.universityID})`);
  });

  console.log("\nCollaborations (Accepted):");
  project.collaborations
    .filter((c) => c.requestStatus === "ACCEPTED")
    .forEach((c) => {
      console.log(`- Sender: ${c.sender.name} (${c.sender.universityID})`);
      console.log(
        `  Receiver: ${c.receiver.name} (${c.receiver.universityID})`,
      );
    });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
