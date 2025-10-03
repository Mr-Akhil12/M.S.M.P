const User = require('../models/user');
const { generateOTP, verifyOTP } = require('../utils/otpService');
const { generateToken } = require('../utils/tokenService');

const sendOTP = async (req, res) => {
  try {
    const { msisdn } = req.body;
    const otp = generateOTP(msisdn);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyOTPAndLogin = async (req, res) => {
  try {
    const { msisdn, otp } = req.body;
    const isValid = verifyOTP(msisdn, otp);
    
    if (!isValid.valid) {
      return res.status(400).json({ message: isValid.message });
    }
    
    let user = await User.findOne({ msisdn });
    if (!user) {
      user = new User({ msisdn });
      await user.save();
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken({ id: user._id, msisdn: user.msisdn });
    res.json({ token, user: { id: user._id, msisdn: user.msisdn } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { sendOTP, verifyOTPAndLogin };