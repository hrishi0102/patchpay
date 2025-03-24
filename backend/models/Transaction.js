const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  researcherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  bugId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Bug", 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  }, // Payment amount in USD
  currency: { 
    type: String, 
    default: "USD" 
  }, // Supports USDC, ACH, etc.
  paymanTransactionId: { 
    type: String, 
    required: true 
  }, // Store Payman AI transaction ID
  status: { 
    type: String, 
    enum: ["processing", "completed", "failed"], 
    default: "processing" 
  },
  processedAt: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);