const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const redis = require('../config/redis');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic liveness check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 timestamp:
 *                   type: number
 */
// Basic Health Check (Liveness)
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed readiness check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: OK or Degraded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 services:
 *                   type: object
 *                   properties:
 *                     mongodb:
 *                       type: string
 *                     redis:
 *                       type: string
 */
// Detailed Health Check (Readiness)
router.get('/detailed', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';
  let redisStatus = 'up';

  try {
    await redis.ping();
  } catch {
    redisStatus = 'down';
  }

  res.json({
    status: dbStatus === 'up' && redisStatus === 'up' ? 'ok' : 'degraded',
    services: {
      mongodb: dbStatus,
      redis: redisStatus,
    },
  });
});

module.exports = router;
