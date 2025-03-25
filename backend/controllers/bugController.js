// controllers/bugController.js
const Bug = require('../models/Bug');
const User = require('../models/User');
const { createPaymanClient, getBalance } = require('../utils/paymanService');

// @desc    Create a new bug
// @route   POST /api/bugs
// @access  Private/Company
const createBug = async (req, res) => {
  try {
    const { title, description, severity, reward } = req.body;
    
    // Check if company has PaymanAI API key
    const company = await User.findById(req.user._id);
    if (!company.paymanApiKey) {
      return res.status(400).json({ 
        message: 'Please add your Payman API key before posting bugs' 
      });
    }
    
    // Verify company has sufficient balance
    try {
      const paymanClient = await createPaymanClient(company.paymanApiKey);
      const balance = await getBalance(paymanClient);
      
      if (balance < reward) {
        return res.status(400).json({ 
          message: `Insufficient balance. Available: ${balance} TSD, Required: ${reward} TSD` 
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        message: 'Failed to verify wallet balance. Please check your Payman API key.' 
      });
    }
    
    // Create bug
    const bug = await Bug.create({
      title,
      description,
      severity,
      reward,
      companyId: req.user._id
    });
    
    res.status(201).json(bug);
  } catch (error) {
    console.error('Create bug error:', error);
    res.status(500).json({ message: 'Failed to create bug', error: error.message });
  }
};

// @desc    Get all bugs (regardless of status)
// @route   GET /api/bugs/all
// @access  Public
const getAllBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({})
      .populate('companyId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(bugs);
  } catch (error) {
    console.error('Get all bugs error:', error);
    res.status(500).json({ message: 'Failed to fetch bugs', error: error.message });
  }
};

// @desc    Get all open bugs
// @route   GET /api/bugs
// @access  Public
const getBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({ status: 'open' })
      .populate('companyId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(bugs);
  } catch (error) {
    console.error('Get bugs error:', error);
    res.status(500).json({ message: 'Failed to fetch bugs', error: error.message });
  }
};

// @desc    Get bugs with optional filters
// @route   GET /api/bugs
// @access  Public
const getBugsWithFilters = async (req, res) => {
  try {
    const { status, severity } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Filter by status if provided, otherwise default to open bugs
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'open';
    }
    
    // Add severity filter if provided
    if (severity) {
      filter.severity = severity;
    }
    
    const bugs = await Bug.find(filter)
      .populate('companyId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(bugs);
  } catch (error) {
    console.error('Get bugs error:', error);
    res.status(500).json({ message: 'Failed to fetch bugs', error: error.message });
  }
};

// @desc    Get bug by ID
// @route   GET /api/bugs/:id
// @access  Public
const getBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('companyId', 'name email');
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    res.json(bug);
  } catch (error) {
    console.error('Get bug by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch bug', error: error.message });
  }
};

// @desc    Update bug status
// @route   PUT /api/bugs/:id/status
// @access  Private/Company
const updateBugStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Check valid status values
    if (!['open', 'in_progress', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Find bug
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    // Check if user is the company that created the bug
    if (bug.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this bug' });
    }
    
    // Update bug
    bug.status = status;
    await bug.save();
    
    res.json(bug);
  } catch (error) {
    console.error('Update bug status error:', error);
    res.status(500).json({ message: 'Failed to update bug status', error: error.message });
  }
};

// @desc    Get bugs posted by the company
// @route   GET /api/bugs/company
// @access  Private/Company
const getCompanyBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({ companyId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(bugs);
  } catch (error) {
    console.error('Get company bugs error:', error);
    res.status(500).json({ message: 'Failed to fetch company bugs', error: error.message });
  }
};

module.exports = {
  createBug,
  getAllBugs,
  getBugs,
  getBugsWithFilters,
  getBugById,
  updateBugStatus,
  getCompanyBugs
};