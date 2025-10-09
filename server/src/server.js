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

// Socket.IO authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = tokenService.verifyToken(token);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`[Socket.IO] User connected: ${socket.userId}`);
  
  socket.join(socket.userId);
  
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] User disconnected: ${socket.userId}`);
  });
});

// Make io available to routes
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

import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from '../stores/auth'

let socket = ref(null)
let isConnected = ref(false)

export function useSocket() {
  const authStore = useAuthStore()

  onMounted(() => {
    // Determine Socket.IO URL based on environment
    const socketUrl = import.meta.env.PROD 
      ? 'https://m-s-m-p.onrender.com'  // Production
      : 'http://localhost:5000'         // Local/Docker

    console.log('🔌 [Socket] Connecting to:', socketUrl)

    socket.value = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        token: authStore.token
      }
    })

    socket.value.on('connect', () => {
      console.log('✅ [Socket] Connected:', socket.value.id)
      isConnected.value = true
    })

    socket.value.on('disconnect', () => {
      console.log('❌ [Socket] Disconnected')
      isConnected.value = false
    })

    socket.value.on('connect_error', (error) => {
      console.error('❌ [Socket] Connection error:', error)
      isConnected.value = false
    })
  })

  onUnmounted(() => {
    if (socket.value) {
      console.log('🔌 [Socket] Disconnecting...')
      socket.value.disconnect()
    }
  })

  return {
    socket,
    isConnected
  }
}