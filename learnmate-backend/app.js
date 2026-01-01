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

// Hardcoded to ensure IPv4 reliability
const AI_SERVICE_URL = 'http://127.0.0.1:5001';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// 1. CORS MUST be first to handle preflight requests for all routes, including proxy
app.use(cors(corsConfig));

// 2. Helmet for security headers
app.use(helmet());

// 3. AI proxy (Must be BEFORE body parser to stream request body, but AFTER CORS)
if (AI_SERVICE_URL) {
  app.use(
    '/api/ai',
    createProxyMiddleware({
      target: AI_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/': '/ai/' }, // Rewrites /recommend-career -> /ai/recommend-career
      secure: false,
      proxyTimeout: Number(process.env.AI_SERVICE_TIMEOUT || 15000),
      on: {
        error: (err, req, res) => {
          console.error('Proxy Error:', err);
          // Ensure CORS headers are present even on error
          // (Though cors middleware above should handle it, explicit header doesn't hurt)
          res.header("Access-Control-Allow-Origin", "http://localhost:3000");
          res.header("Access-Control-Allow-Credentials", "true");
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
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_WINDOW_MS || 15 * 60 * 1000), // 15 minutes
  max: Number(process.env.RATE_MAX || 1000), // Increased from 100 to 1000 for dev
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/onboarding', onboardingRoutes);

// Health route
app.get('/', (req, res) => res.json({ status: 'ok', service: 'learnmate-backend' }));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

// Centralized error handler
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
