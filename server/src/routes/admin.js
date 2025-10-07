const express = require('express');
const { getStats, getUserStats, verifyAdminPassword } = require('../controllers/admin');
const { generalLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/verify-password', generalLimiter, verifyAdminPassword); 
router.get('/stats', generalLimiter, authenticate, getStats);
router.get('/user-stats', generalLimiter, authenticate, getUserStats);

module.exports = router;