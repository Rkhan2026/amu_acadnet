require("dotenv").config();
const { Client } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL is not defined in the environment.");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  console.log("--- Database Cleanup Started (using pg) ---");

  try {
    await client.connect();
    console.log("Connected to database.");

    // Get all table names in the public schema
    const tablesRes = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);
    const tables = tablesRes.rows;

    // Get all enum types in the public schema
    const enumsRes = await client.query(`
      SELECT t.typname FROM pg_type t 
      JOIN pg_namespace n ON n.oid = t.typnamespace 
      WHERE n.nspname = 'public' AND t.typtype = 'e'
    `);
    const enums = enumsRes.rows;

    console.log(`Found ${tables.length} tables and ${enums.length} enums.`);

    // Drop all tables
    for (const { tablename } of tables) {
      console.log(`Dropping table: ${tablename}`);
      await client.query(`DROP TABLE IF EXISTS "${tablename}" CASCADE;`);
    }

    // Drop all enums
    for (const { typname } of enums) {
      console.log(`Dropping enum: ${typname}`);
      await client.query(`DROP TYPE IF EXISTS "${typname}" CASCADE;`);
    }

    console.log("--- Database Successfully Wiped ---");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await client.end();
  }
}

main();
