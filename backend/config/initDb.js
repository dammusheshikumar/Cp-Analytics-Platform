// config/initDb.js
// Run with: npm run init-db

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// -------------------------
// Load .env safely (IMPORTANT)
// -------------------------
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log("📦 Loading .env from:", envPath);

// -------------------------
// Debug env (DO NOT REMOVE UNTIL WORKS)
// -------------------------
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

// -------------------------
// Safety check
// -------------------------
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.log("❌ Environment variables missing. Check your .env file.");
  process.exit(1);
}

async function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  let connection;

  try {
    console.log("⏳ Connecting to MySQL...");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log("⏳ Running schema.sql...");

    await connection.query(schemaSql);

    console.log("✅ Database and tables created successfully!");
  } catch (err) {
    console.error("❌ Failed to initialize database:", err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

initDb();