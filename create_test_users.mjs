import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://1027338e3b67aea4800a2ea0d98e226e568b00a868e8806ace696e6a55e8a3d4:sk_K3oRAeBJCNe8H3EXpl5EU@db.prisma.io:5432/postgres?sslmode=require",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Clean up any existing user
  await prisma.user.deleteMany({ where: { email: "amit.patel@gmail.com" } });

  await prisma.user.create({
    data: {
      universityID: "browser_test_id",
      name: "Amit Patel",
      email: "amit.patel@gmail.com",
      password: hashedPassword,
      role: "STUDENT",
      department: "Computer Science",
      accountStatus: "APPROVED",
    },
  });

  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.deleteMany({ where: { email: "suresh.nair@gmail.com" } });
  await prisma.admin.create({
    data: {
      adminID: "browser_admin_id",
      name: "Suresh Nair",
      email: "suresh.nair@gmail.com",
      password: hashedAdminPassword,
    },
  });

  console.log("Test users created successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
