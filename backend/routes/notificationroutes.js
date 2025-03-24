// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getUserNotifications, 
  markAsRead 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);

module.exports = router;