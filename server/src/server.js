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

// CORS helper - allows localhost and local network IPs
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow requests with no origin (mobile apps, Postman)
  if (origin.startsWith('http://localhost:')) return true;
  if (origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/)) return true; // Local network
  return false;
};

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      isAllowedOrigin(origin) 
        ? callback(null, true) 
        : callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }
  
  try {
    const decoded = tokenService.verifyToken(token);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Invalid authentication token'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`[SOCKET] User connected: ${socket.userId}`);
  
  socket.on('disconnect', () => {
    console.log(`[SOCKET] User disconnected: ${socket.userId}`);
  });
});

// Connect to MongoDB
connectDB();

// Security and parsing middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    isAllowedOrigin(origin)
      ? callback(null, true)
      : callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Initialize Socket.IO in subscriptions controller for real-time updates
const subscriptionsController = require('./controllers/subscriptions');
subscriptionsController.initializeSocket(io);

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
    timestamp: new Date().toISOString() 
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`);
  console.log(`[ENV] Mode: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('[SERVER] Server closed');
    process.exit(0);
  });
});

module.exports.io = io;