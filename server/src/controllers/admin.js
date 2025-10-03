const User = require('../models/user');
const Subscription = require('../models/Subscription');
const Service = require('../models/service');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    
    const serviceStats = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$serviceId', count: { $sum: 1 } } },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { name: '$service.name', activeUsers: '$count' } },
    ]);
    
    res.json({
      totalUsers,
      activeSubscriptions,
      serviceBreakdown: serviceStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

module.exports = { getStats };