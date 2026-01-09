const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['GENERATE_ROADMAP', 'EVALUATE_QUIZ']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    result: {
        type: mongoose.Schema.Types.Mixed
    },
    error: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    processedAt: {
        type: Date
    }
});

// Index for polling workers
jobSchema.index({ status: 1, type: 1, createdAt: 1 });

module.exports = mongoose.model('Job', jobSchema);
