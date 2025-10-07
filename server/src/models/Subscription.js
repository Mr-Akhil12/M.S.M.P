const mongoose = require('mongoose');

/**
 * Subscription Model
 * Represents a user's subscription to a service
 */
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active',
    index: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Prevent duplicate active subscriptions
subscriptionSchema.index({ userId: 1, serviceId: 1, status: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);