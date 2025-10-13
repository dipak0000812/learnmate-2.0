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

    res.status(201).json({ status: 'success', data: assessment });
  } catch (err) { next(err); }
};


