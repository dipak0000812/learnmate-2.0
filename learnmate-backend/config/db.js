const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('MONGO_URI is not set');
      process.exit(1);
    }
    await mongoose.connect(uri, {
      // modern mongoose uses a single options object; keep defaults sane
      autoIndex: process.env.MONGO_AUTO_INDEX === 'true',
      maxPoolSize: Number(process.env.MONGO_MAX_POOL || 10)
    });
    console.log('MongoDB connected ✅');

    // Graceful shutdown
    const close = async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
      } catch (e) {
        console.error('Error during MongoDB disconnect:', e.message);
        process.exit(1);
      }
    };
    process.on('SIGINT', close);
    process.on('SIGTERM', close);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
