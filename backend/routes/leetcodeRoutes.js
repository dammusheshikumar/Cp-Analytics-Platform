// routes/leetcodeRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProfile,
  getSubmissions,
  getContestHistory,
  getHeatmap
} = require('../controllers/leetcodeController');
const { protect } = require('../middleware/authMiddleware');

// All LeetCode lookups require the user to be logged in.
router.get('/:username/profile', protect, getProfile);
router.get('/:username/submissions', protect, getSubmissions);
router.get('/:username/contests', protect, getContestHistory);
router.get('/:username/heatmap', protect, getHeatmap);

module.exports = router;
