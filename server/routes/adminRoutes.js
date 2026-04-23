const router = require('express').Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const activityLogger = require('../middleware/activityLogger');
const { upload } = require('../config/cloudinary');
const eventController = require('../controllers/eventController');
const teamController = require('../controllers/teamController');
const partnerController = require('../controllers/partnerController');
const brandController = require('../controllers/brandController');
const contributorController = require('../controllers/contributorController');
const contactController = require('../controllers/contactController');
const adminController = require('../controllers/adminController');

// All admin routes require auth + admin role + activity logging
router.use(authMiddleware, isAdmin, activityLogger);

// ═══════════════ Events ═══════════════
// List all events (including drafts)
router.get('/events', eventController.getAllAdmin);
// Create event with multi-image upload (max 10)
router.post('/events', upload.array('gallery', 10), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('date').notEmpty().withMessage('Date is required'),
], eventController.create);
// Update event metadata + optionally append images
router.put('/events/:id', upload.array('gallery', 10), eventController.update);
// Delete event + all its images
router.delete('/events/:id', eventController.remove);
// Add images to existing event gallery
router.post('/events/:id/images', upload.array('images', 10), eventController.addImages);
// Remove single image from event gallery
router.delete('/events/:id/images/:imageId', eventController.removeImage);
// Set cover image from gallery
router.put('/events/:id/cover', eventController.setCoverImage);

// ═══════════════ Team ═══════════════
router.get('/team/all', teamController.getAllAdmin);
router.post('/team', upload.single('photo'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('category').isIn(['executive', 'tech', 'event', 'sponsors', 'digital_media', 'marketing', 'research']).withMessage('Valid category is required'),
], teamController.create);
router.put('/team/:id', upload.single('photo'), teamController.update);
router.delete('/team/:id', teamController.remove);
router.patch('/team/reorder', teamController.reorder);

// ═══════════════ Partners ═══════════════
router.get('/partners/all', partnerController.getAllAdmin);
router.post('/partners', upload.single('logo'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
], partnerController.create);
router.put('/partners/:id', upload.single('logo'), partnerController.update);
router.delete('/partners/:id', partnerController.remove);

// ═══════════════ Brands ═══════════════
router.get('/brands/all', brandController.getAllAdmin);
router.post('/brands', upload.single('logo'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
], brandController.create);
router.put('/brands/:id', upload.single('logo'), brandController.update);
router.delete('/brands/:id', brandController.remove);

// ═══════════════ Contributors ═══════════════
router.get('/contributors/all', contributorController.getAllAdmin);
router.post('/contributors', [
  body('name').trim().notEmpty().withMessage('Name is required'),
], contributorController.create);
router.put('/contributors/:id', contributorController.update);
router.delete('/contributors/:id', contributorController.remove);

// ═══════════════ Contact Submissions ═══════════════
router.get('/contacts', contactController.getAllContacts);
router.patch('/contacts/:id/read', contactController.toggleRead);

// ═══════════════ Profile ═══════════════
router.put('/profile', upload.single('profilePicture'), adminController.updateProfile);

module.exports = router;
