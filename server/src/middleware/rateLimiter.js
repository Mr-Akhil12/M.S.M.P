const rateLimit = require('express-rate-limit');

// OTP endpoint: 3 requests per 15 minutes
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: 'Too many OTP requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy in production, skip in development
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  trustProxy: process.env.NODE_ENV === 'production'
});

// General API: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: process.env.NODE_ENV === 'production'
});

module.exports = { otpLimiter, generalLimiter };