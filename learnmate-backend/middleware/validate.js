const { validationResult } = require('express-validator');

// Extracts validation errors produced by express-validator and forwards a uniform error
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map(e => ({ field: e.param, message: e.msg }));
  const err = new Error('Validation error');
  err.isValidationError = true;
  err.errors = errors;
  err.statusCode = 400;
  next(err);
};


