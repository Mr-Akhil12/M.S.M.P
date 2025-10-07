const crypto = require('crypto');
const smsService = require('../services/smsService');

// In-memory OTP storage (use Redis in production for scalability)
const otpStore = new Map();

/**
 * Generate and send OTP via SMS
 * @param {string} msisdn - User's mobile number (format: 27XXXXXXXXX)
 * @returns {string} Generated 6-digit OTP (for development/testing)
 */
const generateOTP = async (msisdn) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  
  // Store OTP with expiry and attempt counter
  otpStore.set(msisdn, { otp, expiry, attempts: 0 });
  
  // Send SMS (will be logged to terminal in test mode)
  try {
    const smsResult = await smsService.sendOTP(msisdn, otp);
    
    if (!smsResult.success && !smsResult.mock) {
      console.error(`[OTP] SMS failed for ${msisdn}:`, smsResult.error);
    }
  } catch (error) {
    console.error('[OTP] SMS error:', error.message);
  }
  
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