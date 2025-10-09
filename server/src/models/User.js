const mongoose = require('mongoose');

/**
 * User Model
 * Represents a user authenticated via MSISDN (mobile number)
 */
const userSchema = new mongoose.Schema({
  msisdn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  otp: {
    type: String,
    trim: true
  },
  otpExpiry: {
    type: Number, 
    default: null
  },
  otpAttempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);