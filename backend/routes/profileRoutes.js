// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getLinks, updateLinks } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/links', protect, getLinks);
router.put('/links', protect, updateLinks);

module.exports = router;
