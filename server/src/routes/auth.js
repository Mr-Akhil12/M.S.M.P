const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/auth'); // Changed here
const { otpLimiter } = require('../middleware/rateLimiter');
const { validateOTPRequest, validateOTPVerify, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/send-otp', otpLimiter, validateOTPRequest, handleValidationErrors, sendOTP);
router.post('/verify-otp', validateOTPVerify, handleValidationErrors, verifyOTP); // Changed here

module.exports = router;