// config/initDb.js
// Run with: npm run init-db
// Reads schema.sql and executes it against MySQL to create the database
// and all tables. Safe to re-run (uses CREATE TABLE IF NOT EXISTS).

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Connect WITHOUT specifying a database first, since schema.sql creates it.
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'DSh@2006',
    multipleStatements: true // required to run the whole .sql file in one go
  });

  try {
    console.log('⏳ Running schema.sql against MySQL...');
    await connection.query(schemaSql);
    console.log('✅ Database and tables created successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

initDb();
