const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const aiRoadmapGenerator = require('../utils/aiRoadmapGenerator');

exports.generate = async (req, res, next) => {
  try {
    const { dreamCareer, assessmentId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const assessment = assessmentId ? await Assessment.findById(assessmentId) : null;

    const milestones = aiRoadmapGenerator({
      userProfile: user,
      assessmentSummary: assessment,
      dreamCareer
    });

    const roadmap = await Roadmap.create({ userId: user._id, assessmentId: assessment?._id, dreamCareer, milestones, progressPercent: 0, totalPointsAwarded: 0 });

    res.status(201).json({ status: 'success', data: { roadmapId: roadmap._id, roadmap } });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id).lean();
    if (!roadmap) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.json({ status: 'success', data: roadmap });
  } catch (err) { next(err); }
};

exports.listByUser = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ status: 'success', data: roadmaps });
  } catch (err) { next(err); }
};

exports.completeGoal = async (req, res, next) => {
  try {
    const { id, goalId } = { id: req.params.id, goalId: req.params.goalId };
    const roadmap = await Roadmap.findById(id);
    if (!roadmap) return res.status(404).json({ status: 'fail', message: 'Not found' });

    // Find milestone containing goalId (we model goalId as milestoneId for simplicity)
    const milestone = roadmap.milestones.find(m => m.milestoneId === goalId);
    if (!milestone) return res.status(404).json({ status: 'fail', message: 'Goal not found' });
    if (!milestone.completed) {
      milestone.completed = true;
      roadmap.totalPointsAwarded += milestone.points || 0;
    }

    // Recompute progress
    const total = roadmap.milestones.length || 1;
    const completedCount = roadmap.milestones.filter(m => m.completed).length;
    roadmap.progressPercent = Math.round((completedCount / total) * 100);
    await roadmap.save();

    // Update user gamification
    const user = await User.findById(roadmap.userId);
    if (user) {
      user.totalPoints += milestone.points || 0;
      if (user.totalPoints >= 100 && !user.badges.includes('centurion')) user.badges.push('centurion');
      await user.save();
    }

    res.json({ status: 'success', data: { roadmap } });
  } catch (err) { next(err); }
};


