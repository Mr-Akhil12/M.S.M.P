const express = require('express');
const { getTransactions } = require('../controllers/transactions');
const { generalLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', generalLimiter, authenticate, getTransactions);

module.exports = router;