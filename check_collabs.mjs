import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const collabs = await prisma.collaboration.findMany({
    include: {
      sender: { select: { name: true, universityID: true } },
      receiver: { select: { name: true, universityID: true } },
      project: { select: { title: true } },
    },
  });
  console.log(JSON.stringify(collabs, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
