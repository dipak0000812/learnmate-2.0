const pinoHttp = require('pino-http');
const logger = require('../utils/logger');
const { randomUUID } = require('crypto');

module.exports = pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] || randomUUID(),
  customLogLevel: (res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});
