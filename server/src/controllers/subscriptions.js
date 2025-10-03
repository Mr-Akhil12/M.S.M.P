const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const Service = require('../models/service');

const subscribe = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user.id;
    
    // Check if already subscribed
    const existing = await Subscription.findOne({ userId, serviceId, status: 'active' });
    if (existing) {
      return res.status(400).json({ message: 'Already subscribed to this service' });
    }
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Calculate expiry (e.g., monthly)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    
    const subscription = new Subscription({
      userId,
      serviceId,
      expiresAt,
    });
    await subscription.save();
    
    // Create transaction
    const transaction = new Transaction({
      userId,
      serviceId,
      type: 'subscription',
      amount: service.price,
    });
    await transaction.save();
    
    res.status(201).json({ subscription, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Subscription failed' });
  }
};

const getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user.id, status: 'active' })
      .populate('serviceId');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscriptions' });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user.id;
    
    const subscription = await Subscription.findOne({ userId, serviceId, status: 'active' });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();
    
    // Create transaction
    const service = await Service.findById(serviceId);
    const transaction = new Transaction({
      userId,
      serviceId,
      type: 'unsubscription',
      amount: service.price,
    });
    await transaction.save();
    
    res.json({ message: 'Unsubscribed successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Unsubscription failed' });
  }
};

module.exports = { subscribe, getUserSubscriptions, unsubscribe };