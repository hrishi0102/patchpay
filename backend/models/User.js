const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['company', 'researcher'],
        required: true,
    },
    walletId: {
        type: String,
        default: null, // only for researcher
    },
    paymanApiKey: {
        type: String,
        default: null, // only for company
    },
    // Reputation metrics for researchers
    totalEarnings: {
        type: Number,
        default: 0, // only for researchers
    },
    successfulSubmissions: {
        type: Number,
        default: 0, // only for researchers
    },
    totalSubmissions: {
        type: Number,
        default: 0, // only for researchers
    },
    successRate: {
        type: Number,
        default: 0, // calculated field (successful/total)
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};
  
// Method to hash password
UserSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Method to update reputation metrics
UserSchema.methods.updateReputation = async function() {
    if (this.totalSubmissions > 0) {
        this.successRate = (this.successfulSubmissions / this.totalSubmissions) * 100;
    }
    await this.save();
};
  
module.exports = mongoose.model('User', UserSchema);