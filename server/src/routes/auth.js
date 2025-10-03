const express = require('express');
const { sendOTP, verifyOTPAndLogin } = require('../controllers/auth');
const { otpLimiter } = require('../middleware/rateLimiter');
const { validateOTPRequest, validateOTPVerify, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/send-otp', otpLimiter, validateOTPRequest, handleValidationErrors, sendOTP);
router.post('/verify-otp', validateOTPVerify, handleValidationErrors, verifyOTPAndLogin);

module.exports = router;