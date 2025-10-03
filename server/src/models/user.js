const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  msisdn: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);