// routes/githubRoutes.js
const express = require('express');
const router = express.Router();
const { summarizeGitHubCode } = require('../controllers/githubController');
const { protect, isResearcher } = require('../middleware/auth');

// Protected researcher routes
router.post('/summarize', protect, isResearcher, summarizeGitHubCode);

module.exports = router;