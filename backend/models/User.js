const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    passwordHash: {
        type:String,
        required:true,
    },
    role: {
        type:String,
        enum:['company','researcher'],
        required:true,
    },
    walletId : {
        type:String,
        default:null, //only for researcher
    },
    paymanApiKey: {
        type:String,
        default:null, //only for company
    },
    createdAt: {
        type:Date,
        default:Date.now,
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
  
  module.exports = mongoose.model('User', UserSchema);