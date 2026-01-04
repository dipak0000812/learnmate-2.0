const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // req.user is already set by authMiddleware (id only)
        if (!req.user || !req.user._id) {
            return res.status(401).json({ status: 'fail', message: 'Not authorized' });
        }

        const user = await User.findById(req.user._id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ status: 'fail', message: 'Access denied: Admins only' });
        }

        next();
    } catch (err) {
        next(err);
    }
};
