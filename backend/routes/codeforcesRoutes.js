// routes/codeforcesRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProfile,
  getContestHistory,
  getSubmissions
} = require('../controllers/codeforcesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:handle/profile', protect, getProfile);
router.get('/:handle/contests', protect, getContestHistory);
router.get('/:handle/submissions', protect, getSubmissions);

module.exports = router;
