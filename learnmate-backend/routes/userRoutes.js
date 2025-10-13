const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/me', auth, userController.getProfile);
router.put(
  '/me',
  auth,
  [
    body('skillLevel').optional().isIn(['beginner', 'intermediate']).withMessage('Invalid skillLevel'),
    body('semester').optional().isInt({ min: 1 }).withMessage('Semester must be >= 1')
  ],
  validate,
  userController.updateProfile
);

module.exports = router;
