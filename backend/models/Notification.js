const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  type: { 
    type: String, 
    enum: [
      "bug_posted", 
      "submission_received", 
      "submission_approved", 
      "submission_rejected", 
      "payment_sent", 
      "payment_received"
    ], 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  relatedId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'onModel' 
  },
  onModel: { 
    type: String, 
    enum: ['Bug', 'Submission', 'Transaction'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);