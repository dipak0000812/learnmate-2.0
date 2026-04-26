const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

describe('Roadmap Integration Tests', () => {
  let user1, user2, token1, token2;

  beforeAll(async () => {
    // Clean database
    await User.deleteMany({});
    await Roadmap.deleteMany({});

    // Create test users
    user1 = await User.create({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password123'
    });

    user2 = await User.create({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password123'
    });

    token1 = jwt.sign({ _id: user1._id }, process.env.JWT_SECRET || 'supersecret');
    token2 = jwt.sign({ _id: user2._id }, process.env.JWT_SECRET || 'supersecret');
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await redis.quit();
  });

  it('should prevent IDOR: user cannot see another users roadmap', async () => {
    // Create a roadmap for user1
    const roadmap1 = await Roadmap.create({
      userId: user1._id,
      title: 'User 1 Roadmap',
      dreamCareer: 'Frontend Engineer',
      milestones: [{ milestoneId: 'm1', title: 'HTML', dailyTasks: [{ day: 1, taskTitle: 'Tags', completed: false }] }]
    });

    // Attempt to access user1's roadmap with user2's token
    const res = await request(app)
      .get(`/api/roadmaps/${roadmap1._id}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toContain('Unauthorized');
  });

  it('should allow a user to complete a task and award points', async () => {
    const roadmap = await Roadmap.create({
      userId: user1._id,
      title: 'Progress Roadmap',
      dreamCareer: 'Fullstack Engineer',
      milestones: [{ 
        milestoneId: 'm1', 
        title: 'Node.js', 
        points: 100,
        dailyTasks: [{ day: 1, taskTitle: 'Express', completed: false }] 
      }]
    });

    // Complete the task (index 0-0)
    const res = await request(app)
      .put(`/api/roadmaps/${roadmap._id}/goals/0-0/complete`)
      .set('Authorization', `Bearer ${token1}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.roadmap.progressPercent).toBe(100);
    expect(res.body.data.pointsAwarded).toBe(100);

    // Verify user points increased
    const updatedUser = await User.findById(user1._id);
    expect(updatedUser.totalPoints).toBeGreaterThanOrEqual(100);
    expect(updatedUser.badges).toContain('first-milestone');
  });

  it('should return 404 for non-existent roadmap', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/roadmaps/${fakeId}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(res.statusCode).toBe(404);
  });
});
