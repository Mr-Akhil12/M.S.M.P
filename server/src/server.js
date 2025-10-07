require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const tokenService = require('./utils/tokenService');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = createServer(app);

// CORS configuration - Allow both production and development origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.CLIENT_URL // Your Vercel URL from environment variable
].filter(Boolean); // Remove undefined values

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('[CORS] Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Socket.IO configuration with updated CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Connect to MongoDB
connectDB();

// Socket.IO authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  try {
    const decoded = tokenService.verifyToken(token);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('[Socket.IO] User connected:', socket.userId);

  socket.on('disconnect', () => {
    console.log('[Socket.IO] User disconnected:', socket.userId);
  });
});

// Make io accessible to routes
app.set('io', io);

// API Routes (with /api prefix)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/admin', require('./routes/admin'));

// Health check (no prefix)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    allowedOrigins: allowedOrigins
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  console.log(`[ENV] Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[ENV] MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
  console.log(`[ENV] Client URL: ${process.env.CLIENT_URL || 'Not set'}`);
  console.log(`[CORS] Allowed origins:`, allowedOrigins);
  console.log('========================================');
});

module.exports = { app, io };