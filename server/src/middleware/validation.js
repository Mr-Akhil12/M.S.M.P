const { body, validationResult } = require('express-validator');

const validateOTPRequest = [
  body('msisdn').isMobilePhone('any').withMessage('Invalid MSISDN'),
];

const validateOTPVerify = [
  body('msisdn').isMobilePhone('any').withMessage('Invalid MSISDN'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateOTPRequest, validateOTPVerify, handleValidationErrors };