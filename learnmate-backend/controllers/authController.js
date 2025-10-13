const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new user
exports.register = async (req, res, next) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    const { name, email, password, college, semester, branch } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
            college: college || '',
            semester: semester || 1,
            branch: branch || ''
        });

        await user.save();

        const payload = { _id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            status: 'success',
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    college: user.college,
                    semester: user.semester,
                    branch: user.branch
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

// Login user
exports.login = async (req, res, next) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { _id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    college: user.college,
                    semester: user.semester,
                    branch: user.branch,
                    dreamCareer: user.dreamCareer,
                    skillLevel: user.skillLevel,
                    targetCompany: user.targetCompany
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get current user profile from token
exports.me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ status: 'success', data: user });
    } catch (err) {
        next(err);
    }
};
