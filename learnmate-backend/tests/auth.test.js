const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const redis = require('../config/redis');

describe('Auth Routes', () => {
  afterAll(async () => {
    await mongoose.connection.close();
    await redis.quit();
  });

  it('should fail login with invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: '123' });

    // Assuming validation error gives 400 or invalid credentials gives 401
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.status).toBe('fail');
  });

  it('should fail register with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'no-password@example.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation error');
  });
});
