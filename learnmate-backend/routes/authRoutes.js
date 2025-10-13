const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

// Registration route
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('semester').optional().isInt({ min: 1 }).withMessage('Semester must be a positive integer')
  ],
  validate,
  authController.register
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

// Current user route
router.get('/me', auth, authController.me);

module.exports = router;
