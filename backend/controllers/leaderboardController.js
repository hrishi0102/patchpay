// controllers/leaderboardController.js
const User = require('../models/User');

// @desc    Get top researchers by earnings
// @route   GET /api/leaderboard/earnings
// @access  Public
const getTopEarners = async (req, res) => {
  try {
    // Get limit from query params or default to 10
    const limit = parseInt(req.query.limit) || 10;
    
    // Find researchers and sort by total earnings
    const topEarners = await User.find({ role: 'researcher' })
      .select('name totalEarnings successfulSubmissions totalSubmissions successRate')
      .sort({ totalEarnings: -1 })
      .limit(limit);
    
    res.json(topEarners);
  } catch (error) {
    console.error('Get top earners error:', error);
    res.status(500).json({ message: 'Failed to fetch top earners', error: error.message });
  }
};

// @desc    Get top researchers by success rate
// @route   GET /api/leaderboard/success-rate
// @access  Public
const getTopSuccessRates = async (req, res) => {
  try {
    // Get limit from query params or default to 10
    const limit = parseInt(req.query.limit) || 10;
    
    // Minimum submissions required to qualify
    const minSubmissions = parseInt(req.query.minSubmissions) || 3;
    
    // Find researchers with at least minSubmissions and sort by success rate
    const topSuccessRates = await User.find({ 
      role: 'researcher',
      totalSubmissions: { $gte: minSubmissions }
    })
      .select('name totalEarnings successfulSubmissions totalSubmissions successRate')
      .sort({ successRate: -1 })
      .limit(limit);
    
    res.json(topSuccessRates);
  } catch (error) {
    console.error('Get top success rates error:', error);
    res.status(500).json({ message: 'Failed to fetch top success rates', error: error.message });
  }
};

// @desc    Get researcher's rank (personal stats)
// @route   GET /api/leaderboard/my-rank
// @access  Private/Researcher
const getMyRank = async (req, res) => {
  try {
    // Get the researcher
    const researcher = await User.findById(req.user._id).select(
      'name totalEarnings successfulSubmissions totalSubmissions successRate'
    );
    
    if (!researcher) {
      return res.status(404).json({ message: 'Researcher not found' });
    }
    
    // Get researcher's rank by earnings
    const earningsRank = await User.countDocuments({
      role: 'researcher',
      totalEarnings: { $gt: researcher.totalEarnings }
    }) + 1;
    
    // Get researcher's rank by success rate (if they have minimum submissions)
    const minSubmissions = 3;
    let successRateRank = null;
    
    if (researcher.totalSubmissions >= minSubmissions) {
      successRateRank = await User.countDocuments({
        role: 'researcher',
        totalSubmissions: { $gte: minSubmissions },
        successRate: { $gt: researcher.successRate }
      }) + 1;
    }
    
    res.json({
      researcher,
      ranks: {
        byEarnings: earningsRank,
        bySuccessRate: successRateRank
      }
    });
  } catch (error) {
    console.error('Get my rank error:', error);
    res.status(500).json({ message: 'Failed to fetch your rank', error: error.message });
  }
};

module.exports = {
  getTopEarners,
  getTopSuccessRates,
  getMyRank
};