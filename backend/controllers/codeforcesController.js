// controllers/codeforcesController.js

const asyncHandler = require('../utils/asyncHandler');
const cfApi = require('../utils/codeforcesApi');

/**
 * @route   GET /api/codeforces/:handle/profile
 * @access  Private
 * Returns current rating, max rating, rank, and max rank.
 */
const getProfile = asyncHandler(async (req, res) => {
  const { handle } = req.params;
  const info = await cfApi.getUserInfo(handle);

  res.json({
    handle: info.handle,
    rating: info.rating || 0,
    maxRating: info.maxRating || 0,
    rank: info.rank || 'unrated',
    maxRank: info.maxRank || 'unrated',
    contribution: info.contribution || 0,
    avatar: info.titlePhoto || info.avatar || null,
    country: info.country || null,
    organization: info.organization || null
  });
});

/**
 * @route   GET /api/codeforces/:handle/contests
 * @access  Private
 * Returns full contest history (for table + rating graph).
 */
const getContestHistory = asyncHandler(async (req, res) => {
  const { handle } = req.params;
  const ratingHistory = await cfApi.getRatingHistory(handle);

  const history = ratingHistory.map((c) => ({
    contestName: c.contestName,
    rank: c.rank,
    ratingChange: c.newRating - c.oldRating,
    oldRating: c.oldRating,
    newRating: c.newRating,
    date: new Date(c.ratingUpdateTimeSeconds * 1000).toISOString()
  }));

  res.json({ history });
});

/**
 * @route   GET /api/codeforces/:handle/submissions
 * @access  Private
 * Returns recent submissions + a difficulty-style breakdown by verdict.
 */
const getSubmissions = asyncHandler(async (req, res) => {
  const { handle } = req.params;
  const limit = Number(req.query.limit) || 50;
  const submissions = await cfApi.getUserSubmissions(handle, limit);

  const formatted = submissions.map((s) => ({
    problemName: s.problem.name,
    rating: s.problem.rating || null,
    verdict: s.verdict,
    language: s.programmingLanguage,
    submittedAt: new Date(s.creationTimeSeconds * 1000).toISOString()
  }));

  res.json({ submissions: formatted });
});

module.exports = { getProfile, getContestHistory, getSubmissions };
