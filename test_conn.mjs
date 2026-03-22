import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Testing connection...");
    console.log(
      "DB URL starts with:",
      process.env.DATABASE_URL?.substring(0, 20),
    );
    const count = await prisma.user.count();
    console.log("Connection successful. User count:", count);
  } catch (error) {
    console.error("Connection failed!");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
