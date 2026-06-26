// config/db.js
// Creates and exports a MySQL connection pool using mysql2/promise.
// A pool is used (instead of a single connection) so the app can handle
// multiple concurrent requests efficiently.

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'DSh@2006',
  database: process.env.DB_NAME || 'contest_analytics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

// Quick helper to test the connection on startup.
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('   Check your .env DB_HOST / DB_USER / DB_PASSWORD / DB_NAME values.');
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
