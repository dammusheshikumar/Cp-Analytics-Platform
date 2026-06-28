// models/userModel.js
// All raw SQL related to the `users` table lives here.
// Controllers call these functions instead of writing SQL inline,
// which keeps query logic in one place and easy to test/change.

const { pool } = require('../config/db');

/**
 * Create a new user. Returns the inserted user's id.
 */
// Create a new user. Returns inserted user id.
async function createUser({ name, email, passwordHash, mobile }) {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, mobile)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, mobile]
  );

  return result.insertId;
}
/**
 * Find a user by email (used during login + duplicate-check on register).
 */
async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

/**
 * Find a user by id (used by auth middleware + profile endpoints).
 * Never returns password_hash.
 */
async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Search users by name or email (used for the "add friend" search box).
 * Excludes the requesting user from results.
 */
async function searchUsers(query, excludeUserId) {
  const [rows] = await pool.query(
    `SELECT id, name, email FROM users
     WHERE (name LIKE ? OR email LIKE ?) AND id != ?
     LIMIT 10`,
    [`%${query}%`, `%${query}%`, excludeUserId]
  );
  return rows;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  searchUsers
};
