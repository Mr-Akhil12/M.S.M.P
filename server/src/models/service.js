const mongoose = require('mongoose');

/**
 * Service Model
 * Represents a subscription service offered to users
 */
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['entertainment', 'education', 'news', 'health', 'lifestyle', 'business', 'other'],
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  imageUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Index for querying active services by category
serviceSchema.index({ isActive: 1, category: 1 });

module.exports = mongoose.model('Service', serviceSchema);