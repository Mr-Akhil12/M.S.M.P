const express = require('express');
const { subscribe, getUserSubscriptions, unsubscribe } = require('../controllers/subscriptions');
const { generalLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', generalLimiter, authenticate, subscribe);
router.get('/', generalLimiter, authenticate, getUserSubscriptions);
router.delete('/:serviceId', generalLimiter, authenticate, unsubscribe);

module.exports = router;