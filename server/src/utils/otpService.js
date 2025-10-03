const crypto = require('crypto');

// In-memory store for OTPs (use Redis in production)
const otpStore = new Map();

const generateOTP = (msisdn) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(msisdn, { otp, expiry, attempts: 0 });
  console.log(`OTP for ${msisdn}: ${otp}`); // Remove in production
  return otp;
};

const verifyOTP = (msisdn, inputOtp) => {
  const record = otpStore.get(msisdn);
  if (!record) return { valid: false, message: 'OTP not found' };
  
  if (Date.now() > record.expiry) {
    otpStore.delete(msisdn);
    return { valid: false, message: 'OTP expired' };
  }
  
  if (record.attempts >= 3) {
    return { valid: false, message: 'Too many attempts' };
  }
  
  if (record.otp === inputOtp) {
    otpStore.delete(msisdn);
    return { valid: true };
  } else {
    record.attempts++;
    return { valid: false, message: 'Invalid OTP' };
  }
};

module.exports = { generateOTP, verifyOTP };