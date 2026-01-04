// Centralized error handler with consistent JSON responses

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  // Mongoose validation / cast errors normalization
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
    });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ status: 'fail', message: 'Invalid identifier format' });
  }

  // express-validator forwarded array
  if (Array.isArray(err.errors) && err.isValidationError) {
    return res.status(400).json({ status: 'fail', message: 'Validation error', errors: err.errors });
  }

  // JWT errors normalization
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token' });
  }

  const payload = {
    status: statusCode >= 500 ? 'error' : 'fail',
    message: err.message || 'Server Error'
  };
  if (!isProd && err.stack) payload.stack = err.stack;

  // Structured Logging
  const logger = require('./logger');
  logger.error(err.message, {
    statusCode,
    method: req.method,
    path: req.path,
    stack: isProd ? undefined : err.stack // Log stack internally but don't send to client if prod
  });

  res.status(statusCode).json(payload);
};


