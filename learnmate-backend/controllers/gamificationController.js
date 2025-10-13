const User = require('../models/User');

exports.getGamification = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('totalPoints badges streakDays name');
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    res.json({
      status: 'success',
      data: {
        userId,
        name: user.name,
        points: user.totalPoints,
        badges: user.badges,
        streak: user.streakDays
      }
    });
  } catch (err) { next(err); }
};
