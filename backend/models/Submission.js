const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  bugId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Bug", 
    required: true 
  },
  researcherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  fixDescription: { 
    type: String, 
    required: true 
  },
  proofOfFix: { 
    type: String, 
    required: true 
  }, // Could be a link to GitHub PR, document, or file
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }, // Company that reviewed it
  reviewedAt: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);