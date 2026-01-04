const Assessment = require('../models/Assessment');
const Question = require('../models/Question');

exports.submit = async (req, res, next) => {
  try {
    const { answers, timeTaken } = req.body;
    const userId = req.user._id;

    // Load the questions to compute correctness
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    let score = 0;
    const checkedAnswers = answers.map(a => {
      const q = questionMap.get(a.questionId);
      const isCorrect = q && q.correctOption === a.chosenOption;
      if (isCorrect) score += 1;
      return { questionId: a.questionId, chosenOption: a.chosenOption, isCorrect: !!isCorrect };
    });

    const total = answers.length;
    const sampleQ = questions[0];
    const assessment = await Assessment.create({ userId, career: sampleQ ? sampleQ.career : '', semester: sampleQ ? sampleQ.semester : 1, answers: checkedAnswers, score, total, timeTaken: timeTaken || 0 });

    // Basic gamification: award points equal to score, update level
    // Basic gamification: award points equal to score, update level
    const User = require('../models/User');
    const user = await User.findById(userId);

    // ANTI-ABUSE: Check if assessment for this career/semester was submitted recently (e.g. last 1 hour) by this user
    // ideally we'd query Assessment model, but for now we'll just check if user points increased recently or just cap it.
    // Better fix: Query Assessment collection for this user, career, semester, and createdAt > 1 hour ago.

    // Quick Fix: Only award points if this is the FIRST assessment for this specific career/semester today?
    // Let's do a simple check:
    const recentAssessment = await Assessment.findOne({
      userId,
      career: sampleQ ? sampleQ.career : '',
      semester: sampleQ ? sampleQ.semester : 1,
      createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) }, // 1 hour
      _id: { $ne: assessment._id } // exclude current one
    });

    if (user && !recentAssessment) {
      const pointsEarned = Math.max(score, 0);
      user.totalPoints = (user.totalPoints || 0) + pointsEarned;
      user.level = Math.max(1, Math.floor((user.totalPoints || 0) / 500) + 1);
      await user.save();
    } else if (user && recentAssessment) {
      const logger = require('../middleware/logger');
      logger.info(`User ${userId} - Skipping points award (duplicate/recent submission)`);
    }

    res.status(201).json({ status: 'success', data: assessment });
  } catch (err) { next(err); }
};

exports.history = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 50);
    const assessments = await Assessment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ status: 'success', data: assessments });
  } catch (err) { next(err); }
};


