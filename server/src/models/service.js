const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  billingCycle: { type: String, required: true }, // e.g., 'monthly', 'weekly'
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Service', serviceSchema);