const express = require('express');
const { getStats } = require('../controllers/admin');
const { generalLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', generalLimiter, authenticate, getStats);

module.exports = router;