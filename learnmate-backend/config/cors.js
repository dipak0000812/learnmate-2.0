const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

module.exports = {
  origin: function(origin, callback) {
    // allow non-browser requests (no origin) and health checks
    if (!origin) return callback(null, true);
    // If configured, enforce allowlist; otherwise default to stricter dev default of localhost
    if (allowedOrigins.length > 0) {
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    }
    const devAllowed = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    if (devAllowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


