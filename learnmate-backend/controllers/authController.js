const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');

const ACCESS_TOKEN_TTL = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
const REFRESH_TOKEN_TTL = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const REFRESH_COOKIE_NAME = 'refreshToken';
const isProd = process.env.NODE_ENV === 'production';
const refreshCookieMaxAge = (() => {
    const seconds = typeof REFRESH_TOKEN_TTL === 'string' && REFRESH_TOKEN_TTL.endsWith('d')
        ? parseInt(REFRESH_TOKEN_TTL, 10) * 24 * 60 * 60
        : 30 * 24 * 60 * 60;
    return seconds * 1000;
})();

const buildUserResponse = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    college: user.college,
    semester: user.semester,
    branch: user.branch,
    dreamCareer: user.dreamCareer,
    skillLevel: user.skillLevel,
    targetCompany: user.targetCompany,
    emailVerified: user.emailVerified,
    onboardingCompleted: user.onboardingCompleted,
    personalizedRoadmap: user.personalizedRoadmap
});

const createAccessToken = (userId) =>
    jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

const createRefreshToken = (userId) =>
    jwt.sign({ _id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_TTL });

const setRefreshCookie = (res, token) => {
    if (!token) return;
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: refreshCookieMaxAge,
        path: '/api/auth'
    });
};

const clearRefreshCookie = (res) => {
    res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/api/auth'
    });
};

const sendAuthResponse = (res, user, statusCode = 200) => {
    const token = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    res.status(statusCode).json({
        status: 'success',
        data: {
            token,
            user: buildUserResponse(user)
        }
    });
};

const generateToken = () => crypto.randomBytes(32).toString('hex');

// Register a new user
exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    const { name, email, password, college, semester, branch } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ status: 'fail', message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateToken();
        const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            college: college || '',
            semester: semester || 1,
            branch: branch || '',
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            emailVerificationExpires: verificationExpires,
            emailVerified: false,
            onboardingCompleted: false
        });
        // Send verification email (Non-blocking)
        try {
            await emailService.sendVerificationEmail(user.email, verificationToken, user.name);
        } catch (emailError) {
            console.warn('⚠️ Verification email failed (check SMTP config):', emailError.message);
            // Don't block registration if email service is down/unconfigured
        }

        const token = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        setRefreshCookie(res, refreshToken);

        res.status(201).json({
            status: 'success',
            message: 'Registration successful!',
            data: {
                token,
                user: buildUserResponse(user)
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
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
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        sendAuthResponse(res, user);
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

// Refresh access token
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies || {};
        if (!refreshToken) {
            return res.status(401).json({ status: 'fail', message: 'Refresh token missing' });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User no longer exists' });
        }

        const token = createAccessToken(user._id);
        setRefreshCookie(res, createRefreshToken(user._id));

        res.json({ status: 'success', data: { token } });
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'fail', message: 'Invalid or expired refresh token' });
        }
        next(err);
    }
};

exports.logout = (req, res) => {
    clearRefreshCookie(res);
    res.json({ status: 'success', message: 'Logged out' });
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            user.passwordResetToken = generateToken();
            user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
            await user.save();
        }
        res.json({
            status: 'success',
            message: 'If an account exists, reset instructions have been generated.',
            data: user ? { resetToken: user.passwordResetToken } : undefined
        });
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Invalid or expired reset token' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({ status: 'success', message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
};

exports.validateResetToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        }).select('_id email');

        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Invalid or expired reset token' });
        }

        res.json({ status: 'success', data: { email: user.email } });
    } catch (err) {
        next(err);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Invalid verification token' });
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.json({ status: 'success', message: 'Email verified successfully' });
    } catch (err) {
        next(err);
    }
};

exports.googleAuth = require('passport').authenticate('google', { session: false, scope: ['profile', 'email'] });

exports.googleCallback = (req, res, next) => {
    require('passport').authenticate('google', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.redirect('http://localhost:3000/login?error=oauth_failed');
        }
        // Generate tokens manually as we do in login
        // We need to access the response functions we defined earlier or duplicate logic
        // Duplicating logic here for clarity as sendAuthResponse relies on 'res' object of API
        try {
            const token = createAccessToken(user._id);
            const refreshToken = createRefreshToken(user._id);
            setRefreshCookie(res, refreshToken);

            // Redirect to frontend with token in query param? 
            // Or Render a temporary page that posts message to opener?
            // Standard approach for SPA: Redirect to a handler page with token

            // SECURITY NOTE: Passing token in URL has risks but is standard for OAuth -> SPA transitions 
            // if short lived. Better: Redirect to a 'processing' page which hits an endpoint to get the token via cookie?
            // Let's go with the query param approach but only for the Access Token (short lived).
            // The Refresh token is already in the httpOnly Cookie set above!

            res.redirect(`http://localhost:3000/oauth/callback?token=${token}`);

        } catch (error) {
            next(error);
        }
    })(req, res, next);
};

exports.githubAuth = require('passport').authenticate('github', { session: false, scope: ['user:email'] });

exports.githubCallback = (req, res, next) => {
    require('passport').authenticate('github', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.redirect('http://localhost:3000/login?error=oauth_failed');
        }
        try {
            const token = createAccessToken(user._id);
            const refreshToken = createRefreshToken(user._id);
            setRefreshCookie(res, refreshToken);
            res.redirect(`http://localhost:3000/oauth/callback?token=${token}`);
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};
