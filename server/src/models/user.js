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
    trim: true,
    index: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);