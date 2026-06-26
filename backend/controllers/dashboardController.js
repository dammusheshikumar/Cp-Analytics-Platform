// controllers/dashboardController.js


const asyncHandler = require('../utils/asyncHandler');
const { getLinkedProfile } = require('../models/profileModel');
const leetcodeApi = require('../utils/leetcodeApi');
const cfApi = require('../utils/codeforcesApi');

/**
 * @route   GET /api/dashboard/summary
 * @access  Private
 * Returns a combined snapshot: total solved, current rating(s),
 * recent submissions, and contest counts — pulled live from whichever
 * platforms this user has linked in their profile.
 */
const getSummary = asyncHandler(async (req, res) => {
  const links = await getLinkedProfile(req.user.id);

  const summary = {
    leetcode: null,
    codeforces: null
  };

  // Run both lookups in parallel where possible, but don't let one
  // platform's failure (e.g. bad username) break the other's data.
  const tasks = [];

  if (links?.leetcode_username) {
    tasks.push(
      leetcodeApi
        .getLeetCodeProfile(links.leetcode_username)
        .then((data) => {
          const acStats = data.matchedUser.submitStatsGlobal.acSubmissionNum;
          const findCount = (arr, difficulty) =>
            arr.find((d) => d.difficulty === difficulty)?.count || 0;

          summary.leetcode = {
            username: links.leetcode_username,
            totalSolved: findCount(acStats, 'All'),
            easySolved: findCount(acStats, 'Easy'),
            mediumSolved: findCount(acStats, 'Medium'),
            hardSolved: findCount(acStats, 'Hard'),
            ranking: data.matchedUser.profile.ranking
          };
        })
        .catch((err) => {
          summary.leetcode = { error: err.message };
        })
    );
  }

  if (links?.codeforces_username) {
    tasks.push(
      cfApi
        .getUserInfo(links.codeforces_username)
        .then((info) => {
          summary.codeforces = {
            handle: links.codeforces_username,
            rating: info.rating || 0,
            maxRating: info.maxRating || 0,
            rank: info.rank || 'unrated'
          };
        })
        .catch((err) => {
          summary.codeforces = { error: err.message };
        })
    );
  }

  await Promise.all(tasks);

  res.json({
    linkedProfiles: {
      leetcodeUsername: links?.leetcode_username || null,
      codeforcesUsername: links?.codeforces_username || null
    },
    summary
  });
});

module.exports = { getSummary };
