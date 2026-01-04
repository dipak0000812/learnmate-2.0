require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const corsConfig = require('./config/cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const careerRoutes = require('./routes/careerRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const questionRoutes = require('./routes/questionRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');

// AI Service URL is now handled via process.env.AI_SERVICE_URL

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// 1. CORS MUST be first to handle preflight requests for all routes, including proxy
app.use(cors(corsConfig));

// Initialize Passport
require('./config/passport');
app.use(require('passport').initialize());

// 2. Helmet for security headers
app.use(helmet());

// 3. AI proxy (Must be BEFORE body parser to stream request body, but AFTER CORS)
// 3. AI proxy (Must be BEFORE body parser to stream request body, but AFTER CORS)
if (process.env.AI_SERVICE_URL) {
  const AI_URL = process.env.AI_SERVICE_URL;
  const AI_KEY = process.env.AI_API_KEY;

  console.log(`🤖 AI Service Proxy Configured -> ${AI_URL}`);

  app.use(
    '/api/ai',
    require('./middleware/rateLimiters').aiProxyLimiter, // Added Node-side rate limiting for AI
    createProxyMiddleware({
      target: AI_URL,
      changeOrigin: true,
      pathRewrite: { '^/': '/ai/' },
      secure: false,
      proxyTimeout: Number(process.env.AI_SERVICE_TIMEOUT || 15000),
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[Proxy] Proxying ${req.method} ${req.url} -> ${AI_URL}${proxyReq.path}`);
          if (AI_KEY) {
            console.log('[Proxy] Injecting X-API-Key header');
            proxyReq.setHeader('X-API-Key', AI_KEY);
          } else {
            console.warn('[Proxy] WARNING: No AI_API_KEY found in environment!');
          }
        },
        error: (err, req, res) => {
          console.error('[Proxy] Connection Error:', err.message);
          res.status(502).json({ status: 'fail', message: 'AI Service Unavailable' });
        }
      }
    })
  );
}

// 4. Body parsers (JSON/Cookie) - Executed after Proxy
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Trust proxy (needed for accurate IPs behind proxies)
app.set('trust proxy', 1);

// Rate limiter (basic)
// Rate limiters
const { authLimiter, apiLimiter, aiProxyLimiter } = require('./middleware/rateLimiters');

// Apply limiters to specific routes
// AI Proxy Limiter applied to AI paths
if (process.env.AI_SERVICE_URL) {
  // We apply this BEFORE the proxy verification logic if we want to block fast
}

// Routes with tiered limits
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/careers', apiLimiter, careerRoutes);
app.use('/api/gamification', apiLimiter, gamificationRoutes);
app.use('/api/questions', apiLimiter, questionRoutes);
app.use('/api/assessments', apiLimiter, assessmentRoutes);
app.use('/api/roadmaps', apiLimiter, roadmapRoutes);
app.use('/api/onboarding', apiLimiter, onboardingRoutes);

// Apply proxy limiter specifically to the proxy path if needed, 
// but since proxy is mounted via 'app.use', we can wrap it.
// However, the proxy setupblock is above. let's modify the proxy setup to include limiter or just rely on python side.
// Better: Add global fallback api limiter for any other route?
// For now, these explicit mounts are good. 
// Note: The AI routes are mounted at '/api/ai' via proxy middleware above.
// We should insert the limit there.

// Health route
app.get('/', (req, res) => res.json({ status: 'ok', service: 'learnmate-backend' }));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

// Centralized error handler
app.use(errorMiddleware);

// Start server
// Start server ONLY if run directly (not if imported by cluster.js)
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
