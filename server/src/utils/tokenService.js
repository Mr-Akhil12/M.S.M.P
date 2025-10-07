const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for authenticated user
 * @param {Object} payload - User data to encode (e.g., { id, msisdn })
 * @returns {string} JWT token valid for 24 hours
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token from Authorization header
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { generateToken, verifyToken };