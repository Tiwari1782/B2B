const router = require('express').Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { chat } = require('../controllers/chatController');

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests. Please wait a moment.' },
});

router.post('/', chatLimiter, [
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('sessionId').trim().notEmpty().withMessage('Session ID is required'),
], chat);

module.exports = router;
