const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const Service = require('../models/service');
const { createTelcoProvider, getProviderFromMSISDN } = require('../config/telco.config');

let io; // Socket.IO instance for real-time updates

/**
 * Initialize Socket.IO (called from server.js)
 */
const initializeSocket = (socketIO) => {
  io = socketIO;
};

/**
 * Subscribe user to a service
 * Charges via telco provider and creates subscription + transaction records
 */
const subscribe = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user.id;
    const userMsisdn = req.user.msisdn;
    
    // Check for existing active subscription
    const existing = await Subscription.findOne({ userId, serviceId, status: 'active' });
    if (existing) {
      return res.status(400).json({ message: 'Already subscribed to this service' });
    }
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Charge via telco provider
    const providerName = getProviderFromMSISDN(userMsisdn);
    const telcoProvider = createTelcoProvider(providerName);
    const chargeResult = await telcoProvider.charge(userMsisdn, service.price, serviceId);
    
    if (!chargeResult.success) {
      return res.status(400).json({ message: `Billing failed: ${chargeResult.error}` });
    }
    
    // Calculate expiry based on billing cycle
    const expiresAt = new Date();
    switch (service.billingCycle) {
      case 'daily':
        expiresAt.setDate(expiresAt.getDate() + 1);
        break;
      case 'weekly':
        expiresAt.setDate(expiresAt.getDate() + 7);
        break;
      case 'yearly':
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        break;
      default: // monthly
        expiresAt.setMonth(expiresAt.getMonth() + 1);
    }
    
    const subscription = new Subscription({ userId, serviceId, expiresAt });
    const transaction = new Transaction({
      userId,
      serviceId,
      type: 'subscription',
      amount: service.price,
      status: 'success'
    });
    
    await subscription.save();
    await transaction.save();
    
    // Emit real-time update
    if (io) {
      io.emit('subscription:created', { userId, subscription, transaction });
    }
    
    res.status(201).json({ 
      subscription, 
      transaction, 
      telcoTransactionId: chargeResult.transactionId 
    });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error:', error.message);
    res.status(500).json({ message: 'Subscription failed' });
  }
};

/**
 * Unsubscribe user from a service
 * Cancels subscription and creates unsubscription transaction
 */
const unsubscribe = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user.id;
    
    const subscription = await Subscription.findOne({ userId, serviceId, status: 'active' });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    const service = await Service.findById(serviceId);
    
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();
    
    const transaction = new Transaction({
      userId,
      serviceId,
      type: 'unsubscription',
      amount: service.price,
      status: 'success'
    });
    await transaction.save();
    
    // Emit real-time update
    if (io) {
      io.emit('subscription:cancelled', { userId, subscription, transaction });
    }
    
    res.json({ message: 'Unsubscribed successfully', transaction });
  } catch (error) {
    console.error('[SUBSCRIPTION] Unsubscribe error:', error.message);
    res.status(500).json({ message: 'Unsubscription failed' });
  }
};

/**
 * Get all subscriptions for authenticated user
 */
const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await Subscription.find({ userId }).populate('serviceId');
    res.json(subscriptions);
  } catch (error) {
    console.error('[SUBSCRIPTION] Get error:', error.message);
    res.status(500).json({ message: 'Failed to get subscriptions' });
  }
};

module.exports = { subscribe, getUserSubscriptions, unsubscribe, initializeSocket };