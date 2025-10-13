const mongoose = require('mongoose');

const GamificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  badges: [String],
  // Add more fields as needed
});

module.exports = mongoose.model('Gamification', GamificationSchema);