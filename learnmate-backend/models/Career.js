const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  skills: [String],
  // Add more fields as needed
});

module.exports = mongoose.model('Career', CareerSchema);