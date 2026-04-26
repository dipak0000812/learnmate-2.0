const redis = require('../config/redis');

exports.cacheGet = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

exports.cacheSet = async (key, value, ttl = 300) => {
  await redis.setex(key, ttl, JSON.stringify(value));
};
