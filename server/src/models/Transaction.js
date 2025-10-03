const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  type: { type: String, enum: ['subscription', 'unsubscription'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);