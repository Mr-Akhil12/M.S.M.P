const User = require('../models/user');
const Subscription = require('../models/Subscription');
const Service = require('../models/service');

/**
 * Get platform statistics (total users, subscriptions, revenue)
 */
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActiveSubscriptions = await Subscription.countDocuments({ status: 'active' });
    
    // Aggregate revenue by service
    const serviceBreakdown = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$serviceId', count: { $sum: 1 } } },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { 
        name: '$service.name', 
        activeSubscriptions: '$count',
        revenue: { $multiply: ['$count', '$service.price'] }
      } }
    ]);
    
    // Round revenue values to 2 decimal places
    serviceBreakdown.forEach(service => {
      service.revenue = parseFloat(service.revenue.toFixed(2));
    });
    
    // Calculate total revenue with proper rounding
    const totalRevenue = parseFloat(
      serviceBreakdown.reduce((sum, s) => sum + s.revenue, 0).toFixed(2)
    );
    
    res.json({
      totalUsers,
      totalActiveSubscriptions,
      totalRevenue,
      serviceBreakdown
    });
  } catch (error) {
    console.error('[ADMIN] Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

/**
 * Get per-user statistics (subscriptions and revenue contribution)
 */
const getUserStats = async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $lookup: {
          from: 'subscriptions',
          localField: '_id',
          foreignField: 'userId',
          as: 'allSubscriptions'
        }
      },
      {
        $addFields: {
          userSubscriptions: {
            $filter: {
              input: '$allSubscriptions',
              cond: { $eq: ['$$this.status', 'active'] }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'userSubscriptions.serviceId',
          foreignField: '_id',
          as: 'services'
        }
      },
      {
        $addFields: {
          subscriptions: '$services.name',
          totalRevenue: { $sum: '$services.price' }
        }
      },
      {
        $project: {
          msisdn: 1,
          subscriptions: 1,
          totalRevenue: 1
        }
      }
    ]);
    
    // Round revenue to 2 decimal places for each user
    userStats.forEach(user => {
      user.totalRevenue = parseFloat(user.totalRevenue.toFixed(2));
    });
    
    res.json(userStats);
  } catch (error) {
    console.error('[ADMIN] User stats error:', error);
    res.status(500).json({ message: 'Failed to fetch user stats' });
  }
};

/**
 * Verify admin password for dashboard access
 */
const verifyAdminPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    if (password === process.env.ADMIN_PASSWORD) {
      return res.json({ valid: true });
    }
    
    res.status(401).json({ valid: false, message: 'Invalid password' });
  } catch (error) {
    console.error('[ADMIN] Password verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

module.exports = { getStats, getUserStats, verifyAdminPassword };