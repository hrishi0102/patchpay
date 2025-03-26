// routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getTopEarners,
  getTopSuccessRates,
  getMyRank
} = require('../controllers/leaderboardController');
const { protect, isResearcher } = require('../middleware/auth');

// Public routes
router.get('/earnings', getTopEarners);
router.get('/success-rate', getTopSuccessRates);

// Protected routes
router.get('/my-rank', protect, isResearcher, getMyRank);

module.exports = router;