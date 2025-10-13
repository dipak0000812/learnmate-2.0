const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res, next) => {
    try {
        // req.user._id is set by auth middleware after JWT verification
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        res.json({ status: 'success', data: user });
    } catch (err) {
        next(err);
    }
};

// Update user profile, including dreamCareer, skillLevel, targetCompany
exports.updateProfile = async (req, res, next) => {
    try {
        const updates = {};
        const allowedFields = ['name', 'skills', 'learningPreferences', 'avatarUrl', 'dreamCareer', 'skillLevel', 'targetCompany', 'college', 'semester', 'branch'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true, select: '-password' }
        );

        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        res.json({ status: 'success', data: user });
    } catch (err) {
        next(err);
    }
};
