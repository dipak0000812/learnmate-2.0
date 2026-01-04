const express = require('express');
const router = express.Router();
const { getGamification, getAchievements, getLeaderboard, purchaseItem } = require('../controllers/gamificationController');
const auth = require('../middleware/authMiddleware');

const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post(
    '/purchase',
    auth,
    [
        body('itemId').notEmpty().withMessage('Item ID is required'),
        body('type').isIn(['badge', 'theme', 'feature']).withMessage('Invalid item type'),
        body('cost.coins').optional().isInt({ min: 0 }).withMessage('Coins must be positive'),
        body('cost.gems').optional().isInt({ min: 0 }).withMessage('Gems must be positive'),
        // Anti-Exploit: Ensure at least one cost is provided if the item isn't free (optional logic, but good for sanity)
    ],
    validate,
    purchaseItem
);
router.get('/me', auth, getGamification); // Using same controller for summary
router.get('/achievements', auth, getAchievements);
router.get('/leaderboard', auth, getLeaderboard);
router.get('/:userId', auth, getGamification);

module.exports = router;
