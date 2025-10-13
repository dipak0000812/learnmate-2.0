const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g., 'first-milestone'
  title: { type: String, required: true },
  description: { type: String, default: '' },
  points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);


