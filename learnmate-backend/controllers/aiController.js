const celeryClient = require('../utils/celeryClient');

exports.recommendCareer = async (req, res, next) => {
  try {
    const userData = req.body;
    const task = celeryClient.createTask('tasks.recommend_career');
    const result = task.applyAsync([userData]);

    res.status(202).json({
      status: 'accepted',
      message: 'Career recommendation job queued.',
      jobId: result.taskId
    });
  } catch (err) {
    next(err);
  }
};

exports.evaluateQuiz = async (req, res, next) => {
  try {
    const quizData = req.body;
    const task = celeryClient.createTask('tasks.evaluate_quiz');
    const result = task.applyAsync([quizData]);

    res.status(202).json({
      status: 'accepted',
      message: 'Quiz evaluation job queued.',
      jobId: result.taskId
    });
  } catch (err) {
    next(err);
  }
};

exports.getJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const result = celeryClient.createTask('dummy').asyncResult(jobId);
    
    // We can fetch the status
    const status = await result.status();
    if (status === 'SUCCESS') {
      const data = await result.get();
      return res.json({ status: 'success', jobStatus: 'completed', data });
    } else if (status === 'FAILURE') {
      return res.json({ status: 'fail', jobStatus: 'failed' });
    } else {
      return res.json({ status: 'success', jobStatus: 'pending' });
    }
  } catch (err) {
    next(err);
  }
};
