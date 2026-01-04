const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  college: { type: String, default: '' },
  semester: { type: Number, default: 1, min: 1 },
  branch: { type: String, default: '' },
  dreamCareer: { type: String, default: '' },
  skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  targetCompany: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  skills: { type: [String], default: [] },
  learningPreferences: { type: [String], default: [] },
  // Simple gamification fields (can be expanded later)
  totalPoints: { type: Number, default: 0, index: true },
  level: { type: Number, default: 1 },
  streakDays: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  // Email + auth meta
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  // Onboarding + roadmap linkage
  onboardingCompleted: { type: Boolean, default: false },
  onboardingData: {
    interests: { type: [String], default: [] },
    skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    dreamCompanies: { type: [String], default: [] },
    targetRole: { type: String, default: '' },
    timeline: { type: String, default: '' },
    knownSkills: { type: [String], default: [] },
    assessmentCompleted: { type: Boolean, default: false },
    assessmentScore: { type: Number, default: 0 },
    assessmentResults: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  personalizedRoadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' }
}, { timestamps: true });

userSchema.add({ isAdmin: { type: Boolean, default: false } });

module.exports = mongoose.model('User', userSchema);
