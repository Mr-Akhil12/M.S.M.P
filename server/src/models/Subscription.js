const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  subscribedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, // Set based on billing cycle
  cancelledAt: { type: Date },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);