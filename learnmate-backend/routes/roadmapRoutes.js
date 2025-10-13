const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/roadmapController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/generate',
  auth,
  [
    body('dreamCareer').notEmpty().withMessage('dreamCareer is required'),
    body('assessmentId').optional().isString()
  ],
  validate,
  controller.generate
);

// Order specific: define /user/:userId before /:id to prevent conflicts
router.get('/user/:userId', auth, [param('userId').isString()], validate, controller.listByUser);
router.get('/:id', auth, [param('id').isString()], validate, controller.getById);
router.put('/:id/goals/:goalId/complete', auth, [param('id').isString(), param('goalId').isString()], validate, controller.completeGoal);

module.exports = router;


