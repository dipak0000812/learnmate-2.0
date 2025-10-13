const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/assessmentController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/submit',
  auth,
  [
    body('answers').isArray({ min: 1 }),
    body('answers.*.questionId').notEmpty(),
    body('answers.*.chosenOption').notEmpty(),
    body('timeTaken').optional().isInt({ min: 0 })
  ],
  validate,
  controller.submit
);

module.exports = router;


