require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const corsConfig = require('./config/cors');

const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const careerRoutes = require('./routes/careerRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const questionRoutes = require('./routes/questionRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const aiRoutes = require('./routes/aiRoutes');

// AI tasks are now handled asynchronously via Celery Queue
const app = express();

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
// 1. CORS MUST be first to handle preflight requests for all routes, including proxy
app.use(cors(corsConfig));

// Initialize Passport
require('./config/passport');
app.use(require('passport').initialize());

// 2. Helmet for security headers
app.use(helmet());

// 3. AI proxy removed. AI routes are now asynchronous queue jobs.

// 4. Body parsers (JSON/Cookie) - Executed after Proxy
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
const loggerMiddleware = require('./middleware/logger');
app.use(loggerMiddleware);
// Trust proxy (needed for accurate IPs behind proxies)
app.set('trust proxy', 1);

// Rate limiter (basic)
// Rate limiters
const { authLimiter, apiLimiter } = require('./middleware/rateLimiters');

// Routes with tiered limits
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/careers', apiLimiter, careerRoutes);
app.use('/api/gamification', apiLimiter, gamificationRoutes);
app.use('/api/questions', apiLimiter, questionRoutes);
app.use('/api/assessments', apiLimiter, assessmentRoutes);
app.use('/api/roadmaps', apiLimiter, roadmapRoutes);
app.use('/api/onboarding', apiLimiter, onboardingRoutes);
app.use('/api/ai', apiLimiter, aiRoutes);

// Metrics Middleware
const metricsMiddleware = require('./middleware/metrics');
app.use(metricsMiddleware);

// Ensure global limits are applied appropriately

// Swagger API Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health route
const healthRoutes = require('./routes/healthRoutes');
app.use('/health', healthRoutes);
app.get('/', (req, res) => res.json({ status: 'ok', service: 'learnmate-backend' }));

// Metrics route
const { client } = require('./utils/metrics');
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

// Centralized error handler
app.use(errorMiddleware);

// Start server
// Start server ONLY if run directly (not if imported by cluster.js)
const PORT = process.env.PORT || 5000;
const logger = require('./utils/logger');

if (require.main === module) {
  const server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

  // Initialize Socket.io for Dev Mode (Single Process)
  const socketService = require('./services/socketService');
  const io = socketService.init(server);
  io.use(require('./middleware/socketAuth'));
  logger.info('🔌 Socket.io initialized in Dev Mode');
}

module.exports = app;
