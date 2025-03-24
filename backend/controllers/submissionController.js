// controllers/submissionController.js
const Submission = require('../models/Submission');
const Bug = require('../models/Bug');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { createPaymanClient, createPayee, sendPayment } = require('../utils/paymanService');

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Private/Researcher
const createSubmission = async (req, res) => {
  try {
    const { bugId, fixDescription, proofOfFix } = req.body;
    
    // Check if bug exists and is open
    const bug = await Bug.findById(bugId);
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    if (bug.status !== 'open') {
      return res.status(400).json({ message: 'This bug is not open for submissions' });
    }
    
    // Create submission
    const submission = await Submission.create({
      bugId,
      researcherId: req.user._id,
      fixDescription,
      proofOfFix
    });
    
    res.status(201).json(submission);
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ message: 'Failed to create submission', error: error.message });
  }
};

// @desc    Get submissions for a bug
// @route   GET /api/submissions/bug/:bugId
// @access  Private/Company
const getSubmissionsByBug = async (req, res) => {
  try {
    const { bugId } = req.params;
    
    // Find bug
    const bug = await Bug.findById(bugId);
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    // Get submissions
    const submissions = await Submission.find({ bugId })
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Get submissions by bug error:', error);
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
};

// @desc    Get submissions by researcher
// @route   GET /api/submissions/researcher
// @access  Private/Researcher
const getResearcherSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ researcherId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Get researcher submissions error:', error);
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
};

// @desc    Review submission (accept or reject)
// @route   PUT /api/submissions/:id/review
// @access  Private/Company
const reviewSubmission = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    
    // Find submission
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Update submission
    submission.status = status;
    submission.feedback = feedback || '';
    await submission.save();
    
    res.json(submission);
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: 'Failed to review submission', error: error.message });
  }
};

module.exports = {
  createSubmission,
  getSubmissionsByBug,
  getResearcherSubmissions,
  reviewSubmission
};
