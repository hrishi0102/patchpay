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
    
    // Update bug status to in_progress
    bug.status = 'in_progress';
    await bug.save();
    
    // Create notification for company
    await Notification.create({
      userId: bug.companyId,
      type: 'submission_received',
      message: `New submission received for bug: ${bug.title}`,
      relatedId: submission._id,
      onModel: 'Submission'
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
    
    // Check if user is the company that created the bug
    if (bug.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these submissions' });
    }
    
    // Get submissions
    const submissions = await Submission.find({ bugId })
      .populate('researcherId', 'name email walletId')
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
      .populate('bugId', 'title status severity reward')
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Get researcher submissions error:', error);
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
};

// @desc    Review submission (accept or reject)
// @route   PUT /api/submissions/:id/review (:id of submission)
// @access  Private/Company
const reviewSubmission = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    
    // Check valid status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
    }
    
    // Find submission
    const submission = await Submission.findById(req.params.id)
      .populate('bugId')
      .populate('researcherId');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Check if user is the company that owns the bug
    if (submission.bugId.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this submission' });
    }
    
    // Update submission
    submission.status = status;
    submission.feedback = feedback || '';
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = Date.now();
    
    // If approved, process payment
    if (status === 'approved') {
      const bug = submission.bugId;
      const researcher = await User.findById(submission.researcherId);
      
      // Get company
      const company = await User.findById(req.user._id);
      
      // Process payment
      try {
        // Create PaymanAI client
        const paymanClient = await createPaymanClient(company.paymanApiKey);
        
        // Create payee if researcher doesn't have a wallet ID
        if (!researcher.walletId) {
          const payee = await createPayee(paymanClient, {
            name: researcher.name,
            email: researcher.email
          });
          
          // Save wallet ID to researcher
          researcher.walletId = payee.id;
          await researcher.save();
        }
        
        // Send payment
        const payment = await sendPayment(paymanClient, {
          amount: bug.reward,
          payeeId: researcher.walletId,
          memo: `Payment for bug fix: ${bug.title}`,
          metadata: {
            bugId: bug._id.toString(),
            submissionId: submission._id.toString()
          }
        });
        
        // Record transaction
        const transaction = await Transaction.create({
          researcherId: researcher._id,
          bugId: bug._id,
          amount: bug.reward,
          currency: "TSD", // Test dollars
          paymanTransactionId: payment.reference,
          status: "processing"
        });
        
        // Create notifications
        await Notification.create({
          userId: researcher._id,
          type: 'submission_approved',
          message: `Your submission for "${bug.title}" has been approved!`,
          relatedId: submission._id,
          onModel: 'Submission'
        });
        
        await Notification.create({
          userId: researcher._id,
          type: 'payment_received',
          message: `You've received ${bug.reward} TSD for your bug fix!`,
          relatedId: transaction._id,
          onModel: 'Transaction'
        });
        
        // Close the bug
        bug.status = 'closed';
        await bug.save();
      } catch (error) {
        console.error('Payment processing error:', error);
        return res.status(400).json({
          message: 'Payment processing failed. Please try again or check your Payman API key.',
          error: error.message
        });
      }
    } else {
      // If rejected, create notification
      await Notification.create({
        userId: submission.researcherId,
        type: 'submission_rejected',
        message: `Your submission for bug "${submission.bugId.title}" was rejected.`,
        relatedId: submission._id,
        onModel: 'Submission'
      });
      
      // Reopen the bug
      submission.bugId.status = 'open';
      await submission.bugId.save();
    }
    
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