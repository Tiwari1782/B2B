// Fixed: P0-4 (rate limiting on all routes)
const rateLimit = require('express-rate-limit');

// Public form endpoints — strict limit
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Too many submissions. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const partnershipLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many partnership inquiries. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin routes — moderate limit
const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// SuperAdmin routes — moderate limit
const superAdminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { contactLimiter, partnershipLimiter, adminLimiter, superAdminLimiter };
