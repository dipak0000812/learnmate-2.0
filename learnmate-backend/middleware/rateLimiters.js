const rateLimit = require('express-rate-limit');

const isProd = process.env.NODE_ENV === 'production';

// Strict limiter for Auth routes (Login/Register/Password Reset)
// 5 attempts per 15 minutes to block brute-force
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 5 : 100, // Higher for dev convenience
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'fail', message: 'Too many failed login attempts, please try again after 15 minutes' }
});

// Standard limiter for general API routes
// 300 requests per 15 minutes (~20 req/min)
exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'fail', message: 'Too many requests, please slow down' }
});

// Stricter limiter for AI Generation routes (Expensive operations)
// 10 requests per minute
exports.aiProxyLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'fail', message: 'AI service quota exceeded, please wait a moment' }
});
