const router = require('express').Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { isSuperAdmin } = require('../middleware/roleMiddleware');
const activityLogger = require('../middleware/activityLogger');
const { upload } = require('../config/cloudinary');
const contentController = require('../controllers/contentController');
const superAdminController = require('../controllers/superAdminController');

router.use(authMiddleware, isSuperAdmin, activityLogger);

// Site Content
router.get('/content', contentController.getAll);
router.put('/content/:key', [
  body('value').exists().withMessage('Value is required'),
], contentController.update);

// Admin Management
router.get('/admins', superAdminController.listAdmins);
router.post('/admins', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], superAdminController.createAdmin);
router.put('/admins/:id', upload.single('profilePicture'), superAdminController.updateAdmin);
router.delete('/admins/:id', superAdminController.deleteAdmin);
router.patch('/admins/:id/password', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], superAdminController.resetPassword);
router.patch('/admins/:id/activate', superAdminController.toggleActive);

// Activity Logs
router.get('/logs', superAdminController.getLogs);

// Site Settings
router.get('/settings', superAdminController.getSettings);
router.put('/settings', superAdminController.updateSettings);

module.exports = router;
