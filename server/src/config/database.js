const mongoose = require('mongoose');

/**
 * Connect to MongoDB and setup connection event listeners
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`[DB] Connected: ${conn.connection.host}`);
    console.log(`[DB] Database: ${conn.connection.name}`);
    
    // Monitor connection health
    mongoose.connection.on('error', (err) => {
      console.error('[DB] Connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] Disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('[DB] Reconnected');
    });
    
  } catch (error) {
    console.error('[DB] Failed to connect:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;