const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');

router.post('/recommend-career', protect, aiController.recommendCareer);
router.post('/evaluate-quiz', protect, aiController.evaluateQuiz);
router.get('/jobs/:jobId', protect, aiController.getJobStatus);

module.exports = router;
