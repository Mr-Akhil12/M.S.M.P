const User = require('../models/user');
const { generateOTP, verifyOTP } = require('../utils/otpService');
const { generateToken } = require('../utils/tokenService');

/**
 * Generate and send OTP via SMS
 */
const sendOTP = async (req, res) => {
  try {
    const { msisdn } = req.body;
    const otp = await generateOTP(msisdn);
    
    res.json({ 
      message: 'OTP sent successfully',
      // Include OTP in development for easier testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('[AUTH] Send OTP error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

/**
 * Verify OTP and authenticate user (create account if first login)
 */
const verifyOTPAndLogin = async (req, res) => {
  try {
    const { msisdn, otp } = req.body;
    const isValid = verifyOTP(msisdn, otp);
    
    if (!isValid.valid) {
      return res.status(400).json({ message: isValid.message });
    }
    
    // Find or create user
    let user = await User.findOne({ msisdn });
    if (!user) {
      user = new User({ msisdn });
      await user.save();
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken({ id: user._id, msisdn: user.msisdn });
    
    res.json({ 
      token, 
      user: { id: user._id, msisdn: user.msisdn } 
    });
  } catch (error) {
    console.error('[AUTH] Verify OTP error:', error.message);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { sendOTP, verifyOTPAndLogin };