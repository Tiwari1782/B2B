const router = require('express').Router();
const { body } = require('express-validator');
const eventController = require('../controllers/eventController');
const teamController = require('../controllers/teamController');
const partnerController = require('../controllers/partnerController');
const brandController = require('../controllers/brandController');
const contributorController = require('../controllers/contributorController');
const contentController = require('../controllers/contentController');
const contactController = require('../controllers/contactController');

// Content
router.get('/content/bulk', contentController.getBulk);
router.get('/content/:key', contentController.getByKey);

// Events
router.get('/events', eventController.getAll);
router.get('/events/:id', eventController.getById);

// Team, Partners, Brands, Contributors
router.get('/team', teamController.getAll);
router.get('/partners', partnerController.getAll);
router.get('/brands', brandController.getAll);
router.get('/contributors', contributorController.getAll);

// Contact form
router.post('/contact', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required'),
], contactController.submitContact);

// Partnership form
router.post('/partnership', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('optingFor').isIn(['Sponsorship', 'Collaborator']).withMessage('Must select Sponsorship or Collaborator'),
  body('message').trim().notEmpty().withMessage('Message is required'),
], contactController.submitPartnership);

module.exports = router;
