require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const bcrypt = require('bcryptjs');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashed = await bcrypt.hash('test123', 10);
    const users = [
      {
        name: 'Admin User',
        email: 'admin@learnmate.com',
        password: hashed,
        college: 'IIT',
        semester: 2,
        branch: 'CSE',
        dreamCareer: 'Data Scientist',
        skillLevel: 'beginner',
        isAdmin: true
      },
      {
        name: 'Sample Student',
        email: 'student@learnmate.com',
        password: hashed,
        college: 'NIT',
        semester: 3,
        branch: 'ECE',
        dreamCareer: 'Software Engineer',
        skillLevel: 'intermediate'
      }
    ];

    const questions = [
      {
        subject: 'Probability',
        career: 'Data Scientist',
        semester: 1,
        difficulty: 'easy',
        prompt: 'What is the probability of heads for a fair coin?',
        options: [ { key: 'A', text: '0.5' }, { key: 'B', text: '0.25' }, { key: 'C', text: '1' } ],
        correctOption: 'A'
      },
      {
        subject: 'Programming Basics',
        career: 'Software Engineer',
        semester: 1,
        difficulty: 'easy',
        prompt: 'Which keyword declares a constant in JavaScript?',
        options: [ { key: 'A', text: 'let' }, { key: 'B', text: 'var' }, { key: 'C', text: 'const' } ],
        correctOption: 'C'
      }
    ];

    await User.deleteMany({});
    await Question.deleteMany({});

    await User.insertMany(users);
    await Question.insertMany(questions);

    console.log('Seed complete: users and questions created');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();


