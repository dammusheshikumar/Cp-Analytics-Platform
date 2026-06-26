// controllers/profileController.js
// Lets a logged-in user save which LeetCode / Codeforces usernames belong
// to them, so the dashboard can auto-load their stats without retyping.

const asyncHandler = require('../utils/asyncHandler');
const { getLinkedProfile, upsertLinkedProfile } = require('../models/profileModel');

/**
 * @route   GET /api/profile/links
 * @access  Private
 */
const getLinks = asyncHandler(async (req, res) => {
  const profile = await getLinkedProfile(req.user.id);
  res.json({
    leetcodeUsername: profile?.leetcode_username || null,
    codeforcesUsername: profile?.codeforces_username || null
  });
});

/**
 * @route   PUT /api/profile/links
 * @access  Private
 * Body: { leetcodeUsername?, codeforcesUsername? }
 */
const updateLinks = asyncHandler(async (req, res) => {
  const { leetcodeUsername, codeforcesUsername } = req.body;

  const updated = await upsertLinkedProfile(req.user.id, {
    leetcodeUsername,
    codeforcesUsername
  });

  res.json({
    message: 'Profile links updated',
    leetcodeUsername: updated.leetcode_username,
    codeforcesUsername: updated.codeforces_username
  });
});

module.exports = { getLinks, updateLinks };
