const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g., 'A', 'B', 'C', 'D'
  text: { type: String, required: true }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true },
  career: { type: String, required: true, trim: true },
  semester: { type: Number, required: true, min: 1 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  prompt: { type: String, required: true },
  options: { type: [optionSchema], validate: v => Array.isArray(v) && v.length >= 2 },
  correctOption: { type: String, required: true }, // key matching options.key
}, { timestamps: true });

// Frequent query indexes
questionSchema.index({ career: 1 });
questionSchema.index({ semester: 1 });

module.exports = mongoose.model('Question', questionSchema);


