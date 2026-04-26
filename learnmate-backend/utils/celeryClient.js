const celery = require('celery-node');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379/0';

const client = celery.createClient(
  REDIS_URL,
  REDIS_URL
);

module.exports = client;
