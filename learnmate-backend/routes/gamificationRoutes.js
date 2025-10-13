const express = require('express');
const router = express.Router();
const { getGamification } = require('../controllers/gamificationController');
const auth = require('../middleware/authMiddleware');

router.get('/:userId', auth, getGamification);

module.exports = router;
