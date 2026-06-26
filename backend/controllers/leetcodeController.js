// controllers/leetcodeController.js
// Endpoints that fetch & shape LeetCode profile data for the frontend.

const asyncHandler = require('../utils/asyncHandler');
const leetcodeApi = require('../utils/leetcodeApi');

/**
 * @route   GET /api/leetcode/:username/profile
 * @access  Private
 * Returns Easy/Medium/Hard solved counts, acceptance rate, and ranking.
 */
const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const data = await leetcodeApi.getLeetCodeProfile(username);

  const acStats = data.matchedUser.submitStatsGlobal.acSubmissionNum;
  const totalStats = data.matchedUser.submitStatsGlobal.totalSubmissionNum;

  // The API returns an array with difficulty: "All" | "Easy" | "Medium" | "Hard"
  const findCount = (arr, difficulty) =>
    arr.find((d) => d.difficulty === difficulty)?.count || 0;

  const solved = {
    easy: findCount(acStats, 'Easy'),
    medium: findCount(acStats, 'Medium'),
    hard: findCount(acStats, 'Hard'),
    total: findCount(acStats, 'All')
  };

  const totalSubmitted = findCount(totalStats, 'All');
  const acceptanceRate =
    totalSubmitted > 0 ? Number(((solved.total / totalSubmitted) * 100).toFixed(2)) : 0;

  res.json({
    username: data.matchedUser.username,
    ranking: data.matchedUser.profile.ranking,
    reputation: data.matchedUser.profile.reputation,
    solved,
    acceptanceRate,
    totalQuestions: data.allQuestionsCount // [{difficulty, count}] for Easy/Medium/Hard totals available on the platform
  });
});

/**
 * @route   GET /api/leetcode/:username/submissions
 * @access  Private
 * Returns the user's most recent submissions (any verdict).
 */
const getSubmissions = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const limit = Number(req.query.limit) || 20;
  const submissions = await leetcodeApi.getRecentSubmissions(username, limit);

  const formatted = submissions.map((s) => ({
    title: s.title,
    slug: s.titleSlug,
    verdict: s.statusDisplay,
    language: s.lang,
    submittedAt: new Date(Number(s.timestamp) * 1000).toISOString()
  }));

  res.json({ submissions: formatted });
});

/**
 * @route   GET /api/leetcode/:username/contests
 * @access  Private
 * Returns contest rating summary + full history (for rating graph).
 */
const getContestHistory = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { summary, history } = await leetcodeApi.getContestHistory(username);

  const formattedHistory = history.map((c) => ({
    contestName: c.contest.title,
    date: new Date(Number(c.contest.startTime) * 1000).toISOString(),
    rank: c.ranking,
    rating: Math.round(c.rating)
  }));

  res.json({
    summary: summary
      ? {
          attendedContests: summary.attendedContestsCount,
          rating: Math.round(summary.rating),
          globalRanking: summary.globalRanking,
          totalParticipants: summary.totalParticipants,
          topPercentage: summary.topPercentage
        }
      : null,
    history: formattedHistory
  });
});

/**
 * @route   GET /api/leetcode/:username/heatmap
 * @access  Private
 * Returns { "YYYY-MM-DD": submissionCount } for the problem-solving heatmap.
 */
const getHeatmap = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const calendar = await leetcodeApi.getSubmissionCalendar(username);

  // calendar is { "<unixTimestamp>": count } — convert keys to ISO dates
  const heatmap = {};
  for (const [timestamp, count] of Object.entries(calendar)) {
    const dateKey = new Date(Number(timestamp) * 1000).toISOString().split('T')[0];
    heatmap[dateKey] = count;
  }

  res.json({ heatmap });
});

module.exports = { getProfile, getSubmissions, getContestHistory, getHeatmap };
