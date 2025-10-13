const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  taskTitle: { type: String, required: true },
  taskDesc: { type: String, default: '' },
  completed: { type: Boolean, default: false }
}, { _id: false });

const milestoneSchema = new mongoose.Schema({
  milestoneId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  estimatedDays: { type: Number, default: 7 },
  points: { type: Number, default: 10 },
  dailyTasks: { type: [dailyTaskSchema], default: [] },
  completed: { type: Boolean, default: false }
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  dreamCareer: { type: String, required: true },
  milestones: { type: [milestoneSchema], default: [] },
  progressPercent: { type: Number, default: 0 },
  totalPointsAwarded: { type: Number, default: 0 }
}, { timestamps: true });

// Frequent query index
roadmapSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Roadmap', roadmapSchema);


