// routes/bugRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createBug, 
  getBugs, 
  getBugById, 
  updateBugStatus, 
  getCompanyBugs 
} = require('../controllers/bugController');
const { protect, isCompany } = require('../middleware/auth');

// Public routes
router.get('/', getBugs);
router.get('/:id', getBugById);

// Company routes
router.post('/', protect, isCompany, createBug);
router.put('/:id/status', protect, isCompany, updateBugStatus);
router.get('/company/list', protect, isCompany, getCompanyBugs);

module.exports = router;