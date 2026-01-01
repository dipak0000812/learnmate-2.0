const User = require('../models/User');

// Helper to calculate level based on points
const calculateLevel = (points) => {
  return Math.floor(Math.sqrt(points / 100)) + 1;
};

exports.purchaseItem = async (req, res, next) => {
  try {
    const { itemId, cost, type } = req.body; // cost: { coins: 100, gems: 5 }
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

    // Initialize currency if missing
    user.coins = user.coins || 0;
    user.gems = user.gems || 0;
    user.inventory = user.inventory || [];

    // Check balance
    if (cost.coins && user.coins < cost.coins) {
      return res.status(400).json({ status: 'fail', message: 'Insufficient coins' });
    }
    if (cost.gems && user.gems < cost.gems) {
      return res.status(400).json({ status: 'fail', message: 'Insufficient gems' });
    }

    // Deduct cost
    if (cost.coins) user.coins -= cost.coins;
    if (cost.gems) user.gems -= cost.gems;

    // Add item (Prevent duplicates if unique)
    // For now, simple push
    user.inventory.push({ itemId, type, purchasedAt: new Date() });

    await user.save();

    res.json({
      status: 'success',
      message: 'Item purchased successfully',
      data: {
        coins: user.coins,
        gems: user.gems,
        inventory: user.inventory
      }
    });
  } catch (err) { next(err); }
};

exports.getGamification = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId || req.user._id);
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

    // Ensure points exist
    const points = user.totalPoints || 0;
    const level = calculateLevel(points);

    // XP for next level logic: Level L requires 100 * (L-1)^2 points.
    // Simplifying: XP to next level = ((level)^2 * 100) - points
    const nextLevelXp = Math.pow(level, 2) * 100;
    const currentLevelBaseXp = Math.pow(level - 1, 2) * 100;
    const xpIntoLevel = points - currentLevelBaseXp;
    const xpRequiredForLevel = nextLevelXp - currentLevelBaseXp;

    res.json({
      status: 'success',
      data: {
        userId: user._id,
        level: level,
        totalPoints: points,
        xpCurrent: xpIntoLevel,
        xpNextLevel: xpRequiredForLevel,
        badges: user.badges || [],
        streakDays: user.streakDays || 0
      }
    });
  } catch (err) { next(err); }
};

exports.getAchievements = async (req, res, next) => {
  try {
    // Just reusing the main gamification endpoint logic for now as achievements are part of it
    // Or we could return just the badges
    const user = await User.findById(req.user._id);
    res.json({ status: 'success', data: { badges: user.badges || [] } });
  } catch (err) { next(err); }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ totalPoints: -1 })
      .limit(10)
      .select('name avatarUrl totalPoints badges');

    res.json({ status: 'success', data: users });
  } catch (err) { next(err); }
};
