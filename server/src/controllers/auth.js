const User = require('../models/User');
const otpService = require('../utils/otpService');
const tokenService = require('../utils/tokenService');
const smsService = require('../services/smsService');

/**
 * Send OTP to user's phone number
 */
const sendOTP = async (req, res) => {
  try {
    console.log('\n[AUTH] ===== SEND OTP REQUEST =====');
    console.log('[AUTH] Request body:', req.body);
    console.log('[AUTH] MSISDN received:', req.body?.msisdn);
    
    const { msisdn } = req.body;

    // Validate MSISDN
    if (!msisdn) {
      console.log('[AUTH] ❌ Missing MSISDN');
      return res.status(400).json({ 
        message: 'Phone number is required',
        error: 'MISSING_MSISDN' 
      });
    }

    // Validate SA phone number format (27XXXXXXXXX)
    const msisdnRegex = /^27[0-9]{9}$/;
    if (!msisdnRegex.test(msisdn)) {
      console.log('[AUTH] ❌ Invalid MSISDN format:', msisdn);
      return res.status(400).json({ 
        message: 'Invalid South African phone number. Format: 27XXXXXXXXX',
        error: 'INVALID_MSISDN' 
      });
    }

    console.log('[AUTH] ✅ MSISDN validated:', msisdn);

    // Find or create user
    let user = await User.findOne({ msisdn });
    
    if (!user) {
      console.log('[AUTH] Creating new user for:', msisdn);
      user = await User.create({ msisdn });
      console.log('[AUTH] ✅ User created:', user._id);
    } else {
      console.log('[AUTH] ✅ Existing user found:', user._id);
    }

    // Generate OTP 
    const otp = otpService.generateOTP();
    console.log('[AUTH] 🔑 OTP generated:', otp);

    // Store OTP with expiry (5 minutes from NOW)
    const otpExpiry = Date.now() + (5 * 60 * 1000); // Timestamp number
    user.otp = otp;
    user.otpExpiry = otpExpiry; // Store as number
    user.otpAttempts = 0;

    console.log('[AUTH] DEBUG - Setting expiry to:', otpExpiry);
    await user.save();
    console.log('[AUTH] ✅ OTP saved to database');

    // Send OTP via SMS
    try {
      const smsEnabled = process.env.SMS_ENABLED === 'true';
      console.log('[AUTH] SMS Enabled:', smsEnabled);
      
      if (smsEnabled) {
        console.log('[AUTH] 📱 Sending SMS to:', msisdn);
        const smsResult = await smsService.sendOTP(msisdn, otp);
        console.log('[AUTH] SMS Result:', smsResult);
        
        if (smsResult.success) {
          console.log('[AUTH] ✅ SMS sent successfully');
        } else {
          console.log('[AUTH] ⚠️ SMS failed:', smsResult.error);
        }
      } else {
        console.log('[AUTH] 📋 SMS disabled - OTP logged only');
      }
    } catch (smsError) {
      console.error('[AUTH] ⚠️ SMS exception:', smsError.message);
      console.error('[AUTH] Stack:', smsError.stack);
      // Continue even if SMS fails
    }

    console.log('[AUTH] ===== END SEND OTP =====\n');

    // Return response with OTP - ALWAYS
    const response = {
      message: 'OTP sent successfully',
      otp  
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('\n[AUTH] ❌ SEND OTP ERROR:', error);
    console.error('[AUTH] Error stack:', error.stack);
    console.error('[AUTH] ===== END SEND OTP =====\n');
    
    res.status(500).json({ 
      message: 'Failed to send OTP',
      error: 'SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};

/**
 * Verify OTP and return JWT token
 */
const verifyOTP = async (req, res) => {
  try {
    console.log('\n[AUTH] ===== VERIFY OTP REQUEST =====');
    console.log('[AUTH] Request body:', req.body);
    
    const { msisdn, otp } = req.body;

    // Validate inputs
    if (!msisdn || !otp) {
      console.log('[AUTH] ❌ Missing msisdn or otp');
      return res.status(400).json({ 
        message: 'Phone number and OTP are required',
        error: 'MISSING_FIELDS' 
      });
    }

    console.log('[AUTH] Looking up user:', msisdn);

    // Find user
    const user = await User.findOne({ msisdn });
    
    if (!user) {
      console.log('[AUTH] ❌ User not found:', msisdn);
      return res.status(404).json({ 
        message: 'User not found. Please request OTP first.',
        error: 'USER_NOT_FOUND' 
      });
    }

    console.log('[AUTH] ✅ User found:', user._id);
    console.log('[AUTH] User OTP in DB:', user.otp);
    console.log('[AUTH] Input OTP:', otp);

    // DEBUG: Log expiry values
    console.log('[AUTH] DEBUG - OTP Expiry:', user.otpExpiry, 'Type:', typeof user.otpExpiry);
    console.log('[AUTH] DEBUG - Current Time:', Date.now());
    console.log('[AUTH] DEBUG - Is expired check:', user.otpExpiry < Date.now());

    // Check OTP expiry
    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      console.log('[AUTH] ❌ OTP expired');
      return res.status(400).json({ 
        message: 'OTP has expired. Please request a new one.',
        error: 'OTP_EXPIRED' 
      });
    }

    // Check attempts
    if (user.otpAttempts >= 3) {
      console.log('[AUTH] ❌ Too many attempts');
      return res.status(429).json({ 
        message: 'Too many failed attempts. Please request a new OTP.',
        error: 'TOO_MANY_ATTEMPTS' 
      });
    }

    // Verify OTP
    console.log('[AUTH] Comparing OTPs:', { db: user.otp, input: otp, match: user.otp === otp });
    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();
      console.log('[AUTH] ❌ Invalid OTP. Attempts:', user.otpAttempts);
      
      return res.status(400).json({ 
        message: `Invalid OTP. ${3 - user.otpAttempts} attempts remaining.`,
        error: 'INVALID_OTP' 
      });
    }

    console.log('[AUTH] ✅ OTP verified successfully');

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    await user.save();

    // Generate JWT token
    console.log('[AUTH] Generating token for user ID:', user._id);
    const token = tokenService.generateToken({ id: user._id, msisdn: user.msisdn });
    console.log('[AUTH] ✅ JWT token generated');

    console.log('[AUTH] ===== END VERIFY OTP =====\n');

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        msisdn: user.msisdn,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('\n[AUTH] ❌ VERIFY OTP ERROR:', error);
    console.error('[AUTH] Error message:', error.message);
    console.error('[AUTH] Error stack:', error.stack);
    console.error('[AUTH] ===== END VERIFY OTP =====\n');
    
    res.status(500).json({ 
      message: 'Failed to verify OTP',
      error: 'SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};