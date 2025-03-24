// routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createSubmission, 
  getSubmissionsByBug, 
  getResearcherSubmissions, 
  reviewSubmission 
} = require('../controllers/submissionController');
const { protect, isCompany, isResearcher } = require('../middleware/auth');

// Researcher routes
router.post('/', protect, isResearcher, createSubmission);
router.get('/researcher', protect, isResearcher, getResearcherSubmissions);

// Company routes
router.get('/bug/:bugId', protect, isCompany, getSubmissionsByBug);
router.put('/:id/review', protect, isCompany, reviewSubmission);

module.exports = router;