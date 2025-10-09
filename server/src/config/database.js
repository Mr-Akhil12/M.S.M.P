const mongoose = require('mongoose');

/**
 * Connect to MongoDB and setup connection event listeners
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    // DEBUG: Show connection string (hide password)
    console.log('[DEBUG] Full URI:', uri);
    console.log('[DEBUG] Masked URI:', uri?.replace(/:[^:@]+@/, ':****@'));
    
 
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    
    });
    
    console.log('[DB] Connected:', conn.connection.host);
    console.log('[DB] Database:', conn.connection.name);
    
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
    console.error('[DB] Connection error:', error.message);
    console.error('[DB] Error code:', error.code);
    console.error('[DB] Error name:', error.name);
    throw error;
  }
};

module.exports = connectDB;