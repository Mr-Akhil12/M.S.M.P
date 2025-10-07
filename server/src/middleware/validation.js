const { body, validationResult } = require('express-validator');

/**
 * Validate OTP request (only MSISDN required)
 */
const validateOTPRequest = [
  body('msisdn').isMobilePhone('any').withMessage('Invalid MSISDN'),
];

/**
 * Validate OTP verification (MSISDN + 6-digit OTP required)
 */
const validateOTPVerify = [
  body('msisdn').isMobilePhone('any').withMessage('Invalid MSISDN'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
];

/**
 * Middleware to handle validation errors from express-validator
 * Returns 400 with error details if validation fails
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  next();
};

module.exports = { validateOTPRequest, validateOTPVerify, handleValidationErrors };