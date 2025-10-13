const User = require('../models/User');

// Ensures authenticated user has admin privileges
module.exports = async function requireAdmin(req, res, next) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }
    const user = await User.findById(req.user._id).select('isAdmin');
    if (!user || !user.isAdmin) {
      return res.status(403).json({ status: 'fail', message: 'Forbidden' });
    }
    next();
  } catch (e) { next(e); }
};


