const express = require('express');
const { body, param, query } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const Question = require('../models/Question');
const controller = require('../controllers/questionController');
const validate = require('../middleware/validate');

const router = express.Router();

// Admin guard via shared middleware
const requireAdmin = require('../middleware/requireAdmin');

// Public list (curated fetch via query)
router.get('/', [
  query('career').optional().isString(),
  query('semester').optional().isInt({ min: 1 })
], validate, controller.list);

// Admin CRUD
router.post(
  '/',
  auth,
  requireAdmin,
  [
    body('subject').notEmpty(),
    body('career').notEmpty(),
    body('semester').isInt({ min: 1 }),
    body('prompt').notEmpty(),
    body('options').isArray({ min: 2 }),
    body('correctOption').notEmpty()
  ],
  validate,
  controller.create
);

router.get('/:id', [param('id').isString()], validate, controller.get);
router.put('/:id', auth, requireAdmin, [param('id').isString()], validate, controller.update);
router.delete('/:id', auth, requireAdmin, [param('id').isString()], validate, controller.remove);

module.exports = router;


