const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  chosenOption: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  career: { type: String, required: true },
  semester: { type: Number, required: true },
  answers: { type: [answerSchema], default: [] },
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 } // seconds
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);


