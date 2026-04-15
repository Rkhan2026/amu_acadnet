require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");

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
  console.log("--- Data Extraction Started ---");

  try {
    await client.connect();
    console.log("Connected to database.");

    // Get all table names
    const tablesRes = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);

    const tables = tablesRes.rows;
    console.log(`Found ${tables.length} tables.`);

    const dbData = {};

    // Loop through each table and extract data
    for (const { tablename } of tables) {
      console.log(`Extracting: ${tablename}`);

      const res = await client.query(`SELECT * FROM "${tablename}";`);

      dbData[tablename] = res.rows;
    }

    // Save to JSON file
    fs.writeFileSync("db-export.json", JSON.stringify(dbData, null, 2));

    console.log("--- Data Exported to db-export.json ---");
  } catch (error) {
    console.error("Error during extraction:", error);
  } finally {
    await client.end();
  }
}

main();
