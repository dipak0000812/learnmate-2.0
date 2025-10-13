require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Question = require('./models/Question');

const seedUsers = [
  {
    name: 'Alice Example',
    email: 'alice@example.com',
    password: '$2a$10$7QJ8vQw8Qw8Qw8Qw8Qw8QeQw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Q',
    college: 'IIT',
    semester: 2,
    branch: 'CSE',
    dreamCareer: 'Data Scientist',
    skillLevel: 'beginner',
    isAdmin: true
  },
  {
    name: 'Bob Example',
    email: 'bob@example.com',
    password: '$2a$10$7QJ8vQw8Qw8Qw8Qw8Qw8QeQw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Q',
    college: 'NIT',
    semester: 3,
    branch: 'ECE',
    dreamCareer: 'Software Engineer',
    skillLevel: 'intermediate'
  }
];

const seedQuestions = [
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

const seedCareers = [
  {
    title: 'Software Engineer',
    description: 'Develops and maintains software applications.',
    skills: ['JavaScript', 'Node.js', 'React']
  },
  {
    title: 'Data Scientist',
    description: 'Analyzes and interprets complex data.',
    skills: ['Python', 'Machine Learning', 'Statistics']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Users
    await User.deleteMany({});
    await User.insertMany(seedUsers);

    // Questions
    await Question.deleteMany({});
    await Question.insertMany(seedQuestions);

    console.log('Users and Questions seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();