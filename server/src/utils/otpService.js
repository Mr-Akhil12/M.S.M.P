const crypto = require('crypto');

// In-memory OTP storage (use Redis in production for scalability)
const otpStore = new Map();

/**
 * Generate 6-digit OTP
 * @returns {string} Generated 6-digit OTP
 */
const generateOTP = () => {
  // Simple synchronous OTP generation
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

/**
 * Verify OTP entered by user
 * @param {string} msisdn - User's mobile number
 * @param {string} inputOtp - OTP entered by user
 * @returns {Object} { valid: boolean, message?: string }
 */
const verifyOTP = (msisdn, inputOtp) => {
  const record = otpStore.get(msisdn);
  
  if (!record) {
    return { valid: false, message: 'OTP not found' };
  }
  
  // Check if OTP expired
  if (Date.now() > record.expiry) {
    otpStore.delete(msisdn);
    return { valid: false, message: 'OTP expired' };
  }
  
  // Check attempt limit (max 3 tries)
  if (record.attempts >= 3) {
    return { valid: false, message: 'Too many attempts' };
  }
  
  // Verify OTP
  if (record.otp === inputOtp) {
    otpStore.delete(msisdn);
    return { valid: true };
  }
  
  record.attempts++;
  return { valid: false, message: 'Invalid OTP' };
};

module.exports = { generateOTP, verifyOTP };