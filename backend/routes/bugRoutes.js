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
router.get('/', getBugs);
router.get('/:id', getBugById);
router.get('/filters', getBugsWithFilters);

// Company routes
router.post('/', protect, isCompany, createBug);
router.put('/:id/status', protect, isCompany, updateBugStatus);
router.get('/company/list', protect, isCompany, getCompanyBugs);

module.exports = router;