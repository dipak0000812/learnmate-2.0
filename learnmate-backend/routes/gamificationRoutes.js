const express = require('express');
const router = express.Router();
const { getGamification, getAchievements, getLeaderboard, purchaseItem } = require('../controllers/gamificationController');
const auth = require('../middleware/authMiddleware');

router.post('/purchase', auth, purchaseItem);
router.get('/me', auth, getGamification); // Using same controller for summary
router.get('/achievements', auth, getAchievements);
router.get('/leaderboard', auth, getLeaderboard);
router.get('/:userId', auth, getGamification);

module.exports = router;
