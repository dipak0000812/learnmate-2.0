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

router.post('/refresh', authController.refreshToken);

// Current user route
router.get('/me', auth, authController.me);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  authController.resetPassword
);

router.post(
  '/validate-reset-token',
  [body('token').notEmpty().withMessage('Reset token is required')],
  validate,
  authController.validateResetToken
);

router.post(
  '/verify-email',
  [body('token').notEmpty().withMessage('Verification token is required')],
  validate,
  authController.verifyEmail
);

router.post('/logout', auth, authController.logout);

router.post('/resend-verification', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    if (user.emailVerified) {
      return res.status(400).json({ status: 'fail', message: 'Email already verified' });
    }
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const emailService = require('../services/emailService');
    await emailService.sendVerificationEmail(user.email, verificationToken, user.name);
    res.json({ status: 'success', message: 'Verification email sent! Check your inbox.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to send verification email. Please try again.'
    });
  }
});

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.get('/github', authController.githubAuth);
router.get('/github/callback', authController.githubCallback);

module.exports = router;
