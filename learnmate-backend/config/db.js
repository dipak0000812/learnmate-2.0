const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      logger.error('MONGO_URI is not set');
      process.exit(1);
    }
    await mongoose.connect(uri, {
      // modern mongoose uses a single options object; keep defaults sane
      autoIndex: process.env.MONGO_AUTO_INDEX === 'true',
      maxPoolSize: Number(process.env.MONGO_MAX_POOL || 50),
      minPoolSize: Number(process.env.MONGO_MIN_POOL || 5) // Maintain some connections
    });
    logger.info('MongoDB connected ✅');

    // Graceful shutdown
    const close = async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
        process.exit(0);
      } catch (e) {
        logger.error({ err: e }, 'Error during MongoDB disconnect');
        process.exit(1);
      }
    };
    process.on('SIGINT', close);
    process.on('SIGTERM', close);
  } catch (err) {
    logger.error({ err }, 'MongoDB connection error');
    process.exit(1);
  }
};

module.exports = connectDB;
