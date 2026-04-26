const redis = require('../config/redis');

const OAUTH_CODE_PREFIX = 'oauth_code:';

exports.storeOAuthCode = async (code, userId) => {
  await redis.setex(`${OAUTH_CODE_PREFIX}${code}`, 60, userId.toString());
};

exports.getOAuthCode = async (code) => {
  const key = `${OAUTH_CODE_PREFIX}${code}`;
  const userId = await redis.get(key);
  if (userId) {
    await redis.del(key); // one-time use
  }
  return userId;
};
