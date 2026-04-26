const Redis = process.env.NODE_ENV === 'test' ? require('ioredis-mock') : require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379/0', {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

const logger = require('../utils/logger');

redis.on('connect', () => logger.info('✅ Redis connected'));
redis.on('error', (err) => logger.error({ err }, '❌ Redis error'));

module.exports = redis;
