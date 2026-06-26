// models/profileModel.js
// SQL for the `linked_profiles` table — stores each user's
// LeetCode / Codeforces handles so they don't have to retype them.

const { pool } = require('../config/db');

async function getLinkedProfile(userId) {
  const [rows] = await pool.query(
    `SELECT leetcode_username, codeforces_username
     FROM linked_profiles WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Upsert: insert if no row exists for this user yet, otherwise update.
 * Only overwrites fields that are explicitly passed (not undefined).
 */
async function upsertLinkedProfile(userId, { leetcodeUsername, codeforcesUsername }) {
  const existing = await getLinkedProfile(userId);

  if (!existing) {
    await pool.query(
      `INSERT INTO linked_profiles (user_id, leetcode_username, codeforces_username)
       VALUES (?, ?, ?)`,
      [userId, leetcodeUsername || null, codeforcesUsername || null]
    );
  } else {
    await pool.query(
      `UPDATE linked_profiles
       SET leetcode_username = ?, codeforces_username = ?
       WHERE user_id = ?`,
      [
        leetcodeUsername !== undefined ? leetcodeUsername : existing.leetcode_username,
        codeforcesUsername !== undefined ? codeforcesUsername : existing.codeforces_username,
        userId
      ]
    );
  }

  return getLinkedProfile(userId);
}

module.exports = { getLinkedProfile, upsertLinkedProfile };
