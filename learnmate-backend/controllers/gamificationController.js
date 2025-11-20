const User = require('../models/User');

exports.getGamification = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('totalPoints badges streakDays name level');
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    res.json({
      status: 'success',
      data: {
        userId,
        name: user.name,
        points: user.totalPoints,
        badges: user.badges,
        streak: user.streakDays,
        level: user.level
      }
    });
  } catch (err) { next(err); }
};

exports.getAchievements = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('totalPoints level streakDays badges');
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    res.json({
      status: 'success',
      data: {
        points: user.totalPoints || 0,
        level: user.level || 1,
        streak: user.streakDays || 0,
        achievements: user.badges || []
      }
    });
  } catch (err) { next(err); }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const users = await User.find({ onboardingCompleted: true })
      .select('name email totalPoints level avatarUrl')
      .sort({ totalPoints: -1 })
      .limit(limit);
    res.json({
      status: 'success',
      data: users.map((user, idx) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        points: user.totalPoints || 0,
        level: user.level || 1,
        avatarUrl: user.avatarUrl,
        rank: idx + 1
      }))
    });
  } catch (err) { next(err); }
};
