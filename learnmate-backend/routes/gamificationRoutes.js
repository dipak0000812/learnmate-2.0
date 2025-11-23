const express = require('express');
const router = express.Router();
const { getGamification, getAchievements, getLeaderboard } = require('../controllers/gamificationController');
const auth = require('../middleware/authMiddleware');

router.get('/me', auth, getAchievements);
router.get('/leaderboard', auth, getLeaderboard);
router.get('/:userId', auth, getGamification);

module.exports = router;
