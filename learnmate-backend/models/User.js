const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    college: { type: String, default: '' },
    semester: { type: Number, default: 1, min: 1 },
    branch: { type: String, default: '' },
    dreamCareer: { type: String, default: '' },
    skillLevel: { type: String, enum: ['beginner', 'intermediate'], default: 'beginner' },
    targetCompany: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    skills: { type: [String], default: [] },
    learningPreferences: { type: [String], default: [] },
    // Simple gamification fields (can be expanded later)
    totalPoints: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    badges: { type: [String], default: [] }
}, { timestamps: true });

userSchema.add({ isAdmin: { type: Boolean, default: false } });

module.exports = mongoose.model('User', userSchema);
