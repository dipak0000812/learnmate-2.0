const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379/0', {
  maxRetriesPerRequest: null,
});

const defaultQueue = new Queue('default', { connection });

module.exports = {
  connection,
  defaultQueue,
};
