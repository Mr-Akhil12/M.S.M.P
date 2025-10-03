const express = require('express');
const { getServices, getServiceById } = require('../controllers/services');
const { generalLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', generalLimiter, authenticate, getServices);
router.get('/:id', generalLimiter, authenticate, getServiceById);

module.exports = router;