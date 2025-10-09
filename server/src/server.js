require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const tokenService = require('./utils/tokenService');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');

const app = express();
const server = createServer(app);

// Trust proxy - Set to 1 for local dev with Docker, or when behind reverse proxy
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.CLIENT_URL,
  'https://m-s-m-p.vercel.app'
].filter(Boolean);

console.log('[CORS] Allowed origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('[CORS] ❌ Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global request logger
app.use((req, res, next) => {
  console.log('\n🌐 INCOMING REQUEST');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Origin:', req.headers.origin);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  console.log('---');
  next();
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('✅ [Socket.IO] Client connected:', socket.id);

  // Extract token from auth handshake
  const token = socket.handshake.auth?.token;
  
  if (token) {
    try {
      // Verify JWT and extract user ID
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      
      // Join user-specific room
      socket.join(userId);
      console.log('✅ [Socket.IO] User', userId, 'joined room');
      
      // Store userId in socket for later use
      socket.userId = userId;
      
      // Send confirmation to client
      socket.emit('authenticated', { userId });
      
    } catch (error) {
      console.error('❌ [Socket.IO] JWT verification failed:', error.message);
      socket.emit('authentication_error', { message: 'Invalid token' });
    }
  } else {
    console.warn('⚠️ [Socket.IO] No token provided in handshake');
  }

  socket.on('disconnect', () => {
    console.log('❌ [Socket.IO] Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Health check (BEFORE routes, no /api prefix)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/admin', require('./routes/admin'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server AFTER database connects
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Then start server
    server.listen(PORT, '0.0.0.0', () => {
      console.log('========================================');
      console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
      console.log(`[ENV] Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[ENV] Client URL: ${process.env.CLIENT_URL}`);
      console.log(`[ENV] Trust Proxy: ${app.get('trust proxy')}`);
      console.log('[CORS] Allowed origins:', allowedOrigins);
      console.log('========================================');
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = { app, io };

