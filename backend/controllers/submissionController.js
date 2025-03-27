// controllers/submissionController.js
const Submission = require('../models/Submission');
const Bug = require('../models/Bug');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { createPaymanClient, createPayee, sendPayment } = require('../utils/paymanService');
const { processGitHubUrl } = require('../utils/githubService');
const { evaluateCodeAgainstTestCases } = require('../utils/codeEvaluationService');

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
    
    let evaluationScore = 0;
    let evaluationDetails = null;
    let autoApproved = false;

    // Only evaluate if the bug has test cases
    if (bug.testCases && bug.testCases.length > 0) {
      try {
        // Extract GitHub URL from proofOfFix if it contains a GitHub URL
        const githubUrlMatch = proofOfFix.match(/(https:\/\/github\.com\/[^\/]+\/[^\/]+\/blob\/[^\/]+\/[^?\s]+)/);
        
        if (githubUrlMatch) {
          const githubUrl = githubUrlMatch[1];
          
          // Process GitHub URL to get code
          const githubResult = await processGitHubUrl(githubUrl);
          const code = githubResult.code || githubResult; // Handle different return formats
          const language = githubResult.language;
          console.log(`Code: ${code}`);
          console.log(`Language: ${language}`);
          
          // Evaluate code against test cases
          const evaluation = await evaluateCodeAgainstTestCases(code, bug.testCases, language);
          console.log(`Evaluation: ${evaluation}`);
          
          evaluationScore = evaluation.overallScore;
          evaluationDetails = JSON.stringify(evaluation);
          console.log(`Evaluation Score: ${evaluationScore}`);
          console.log(`Evaluation Details: ${evaluationDetails}`);
          
          // Auto-approve if score exceeds threshold
          if (evaluationScore >= bug.autoApprovalThreshold) {
            autoApproved = true;
          }
        }
      } catch (error) {
        console.error('Code evaluation error:', error);
        // Continue with submission without evaluation if there's an error
      }
    }

    // Create submission
    const submission = await Submission.create({
      bugId,
      researcherId: req.user._id,
      fixDescription,
      proofOfFix,
      evaluationScore,
      evaluationDetails,
      // If auto-approved, set status to approved
      status: autoApproved ? 'approved' : 'pending',
      autoApproved
    });
    
    // If not auto-approved, update bug status to in_progress
    if (!autoApproved) {
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
    } else {
      // If auto-approved, process payment and update status
      await processPaymentForApprovedSubmission(submission, bug, req.user._id);
    }
    
    res.status(201).json(submission);
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ message: 'Failed to create submission', error: error.message });
  }
};

// Helper function for processing payment for auto-approved submissions
const processPaymentForApprovedSubmission = async (submission, bug, reviewerId) => {
  try {
    // Get the researcher
    const researcher = await User.findById(submission.researcherId);
    
    // Get company
    const company = await User.findById(bug.companyId);
    
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
      memo: `Auto-approved payment for bug fix: ${bug.title} (Score: ${submission.evaluationScore}%)`,
      metadata: {
        bugId: bug._id.toString(),
        submissionId: submission._id.toString(),
        autoApproved: true
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
      message: `Your submission for "${bug.title}" has been auto-approved with a score of ${submission.evaluationScore}%!`,
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
    
    // Notify company about auto-approval
    await Notification.create({
      userId: bug.companyId,
      type: 'submission_approved',
      message: `A submission for "${bug.title}" was auto-approved with a score of ${submission.evaluationScore}%.`,
      relatedId: submission._id,
      onModel: 'Submission'
    });
    
    // Close the bug
    bug.status = 'closed';
    await bug.save();
    
    // Update researcher's reputation metrics
    researcher.totalSubmissions += 1;
    researcher.successfulSubmissions += 1;
    researcher.totalEarnings += bug.reward;
    await researcher.updateReputation();
  } catch (error) {
    console.error('Auto-approval payment processing error:', error);
    // If payment fails, revert to pending status
    submission.status = 'pending';
    submission.autoApproved = false;
    await submission.save();
    
    // Create notification about failed auto-approval
    await Notification.create({
      userId: bug.companyId,
      type: 'payment_failed',
      message: `Auto-approval payment failed for submission to "${bug.title}". Manual review required.`,
      relatedId: submission._id,
      onModel: 'Submission'
    });
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
      .populate('bugId', 'title status severity reward autoApprovalThreshold testCases')
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
    
    // Check if submission is already auto-approved
    if (submission.autoApproved && submission.status === 'approved') {
      return res.status(400).json({ message: 'This submission has already been auto-approved and cannot be modified' });
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
    
    // Get the researcher
    const researcher = await User.findById(submission.researcherId);
    
    // Update researcher's reputation metrics
    researcher.totalSubmissions += 1;
    
    // If approved, process payment and update successful submissions
    if (status === 'approved') {
      const bug = submission.bugId;
      
      // Update researcher's reputation for approved submission
      researcher.successfulSubmissions += 1;
      researcher.totalEarnings += bug.reward;
      
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
    
    // Update reputation metrics
    await researcher.updateReputation();
    await researcher.save();
    
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