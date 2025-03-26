// routes/bugRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createBug,
  getAllBugs,
  getBugs, 
  getBugById, 
  getBugsWithFilters,
  updateBugStatus, 
  getCompanyBugs 
} = require('../controllers/bugController');
const { protect, isCompany } = require('../middleware/auth');

// Public routes
router.get('/all', getAllBugs);
router.get('/filters', getBugsWithFilters); // Moving this BEFORE the '/:id' route
router.get('/', getBugs);
router.get('/company/list', protect, isCompany, getCompanyBugs);
router.get('/:id', getBugById);

// Company routes
router.post('/', protect, isCompany, createBug);
router.put('/:id/status', protect, isCompany, updateBugStatus);

module.exports = router;