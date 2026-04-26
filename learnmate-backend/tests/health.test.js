const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const redis = require('../config/redis');

describe('Health Check Routes', () => {
  afterAll(async () => {
    await mongoose.connection.close();
    await redis.quit();
  });

  it('should return OK for basic liveness', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return detailed readiness status', async () => {
    const res = await request(app).get('/health/detailed');
    // It might be 'ok' or 'degraded' based on test environment, but the structure should match
    expect([200, 503]).toContain(res.statusCode); 
    expect(['ok', 'degraded']).toContain(res.body.status);
    expect(res.body.services).toHaveProperty('mongodb');
    expect(res.body.services).toHaveProperty('redis');
  });
});
