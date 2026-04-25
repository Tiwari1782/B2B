// Fixed: P0-4 (admin rate limiting), P1-10 (validation on update routes)
const router = require('express').Router();
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const activityLogger = require('../middleware/activityLogger');
const { adminLimiter } = require('../middleware/rateLimiters');
const { upload } = require('../config/cloudinary');
const eventController = require('../controllers/eventController');
const teamController = require('../controllers/teamController');
const partnerController = require('../controllers/partnerController');
const brandController = require('../controllers/brandController');
const contributorController = require('../controllers/contributorController');
const contactController = require('../controllers/contactController');
const adminController = require('../controllers/adminController');

// All admin routes require auth + admin role + rate limit + activity logging
router.use(authMiddleware, isAdmin, adminLimiter, activityLogger);

// ═══════════════ Events ═══════════════
router.get('/events', eventController.getAllAdmin);
router.post('/events', upload.array('gallery', 10), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('date').notEmpty().withMessage('Date is required'),
], eventController.create);
router.put('/events/:id', upload.array('gallery', 10), [
  param('id').isMongoId().withMessage('Invalid event ID'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('date').optional().notEmpty().withMessage('Date cannot be empty'),
  body('category').optional().isIn(['workshop', 'hackathon', 'meetup', 'webinar', 'conference', 'other']).withMessage('Invalid category'),
  body('status').optional().isIn(['upcoming', 'ongoing', 'past']).withMessage('Invalid status'),
], eventController.update);
router.delete('/events/:id', eventController.remove);
router.post('/events/:id/images', upload.array('images', 10), eventController.addImages);
router.delete('/events/:id/images/:imageId', eventController.removeImage);
router.put('/events/:id/cover', eventController.setCoverImage);

// ═══════════════ Team ═══════════════
router.get('/team/all', teamController.getAllAdmin);
router.post('/team', upload.single('photo'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('category').isIn(['executive', 'tech', 'event', 'sponsors', 'digital_media', 'marketing', 'research']).withMessage('Valid category is required'),
], teamController.create);
router.put('/team/:id', upload.single('photo'), [
  param('id').isMongoId().withMessage('Invalid team member ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('role').optional().trim().notEmpty().withMessage('Role cannot be empty'),
  body('category').optional().isIn(['executive', 'tech', 'event', 'sponsors', 'digital_media', 'marketing', 'research']).withMessage('Invalid category'),
], teamController.update);
router.delete('/team/:id', teamController.remove);
router.patch('/team/reorder', teamController.reorder);

// ═══════════════ Partners ═══════════════
router.get('/partners/all', partnerController.getAllAdmin);
router.post('/partners', upload.single('logo'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
], partnerController.create);
router.put('/partners/:id', upload.single('logo'), [
  param('id').isMongoId().withMessage('Invalid partner ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
], partnerController.update);
router.delete('/partners/:id', partnerController.remove);

// ═══════════════ Brands ═══════════════
router.get('/brands/all', brandController.getAllAdmin);
router.post('/brands', upload.single('logo'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
], brandController.create);
router.put('/brands/:id', upload.single('logo'), [
  param('id').isMongoId().withMessage('Invalid brand ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
], brandController.update);
router.delete('/brands/:id', brandController.remove);

// ═══════════════ Contributors ═══════════════
router.get('/contributors/all', contributorController.getAllAdmin);
router.post('/contributors', [
  body('name').trim().notEmpty().withMessage('Name is required'),
], contributorController.create);
router.put('/contributors/:id', [
  param('id').isMongoId().withMessage('Invalid contributor ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
], contributorController.update);
router.delete('/contributors/:id', contributorController.remove);

// ═══════════════ Contact Submissions ═══════════════
router.get('/contacts', contactController.getAllContacts);
router.patch('/contacts/:id/read', contactController.toggleRead);

// ═══════════════ Profile ═══════════════
router.put('/profile', upload.single('profilePicture'), adminController.updateProfile);

module.exports = router;
