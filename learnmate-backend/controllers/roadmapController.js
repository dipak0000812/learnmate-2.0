const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const axios = require('axios');
const aiRoadmapGenerator = null; // Removed fake generator

const normalizeMilestones = (phases = []) => {
  if (!Array.isArray(phases) || phases.length === 0) return [];
  return phases.map((phase, idx) => {
    const estimatedDays = typeof phase.duration === 'string'
      ? parseInt(phase.duration.replace(/\D/g, ''), 10) * 30 || 30
      : 30;
    const tasks = Array.isArray(phase.tasks) ? phase.tasks : (Array.isArray(phase.milestones) ? phase.milestones : []);
    return {
      milestoneId: `phase-${idx + 1}`,
      title: phase.title || `Phase ${idx + 1}`,
      description: phase.description || '',
      estimatedDays,
      points: 75,
      dailyTasks: tasks.map((task, taskIdx) => ({
        day: taskIdx + 1,
        taskTitle: task,
        taskDesc: ''
      }))
    };
  });
};

exports.generate = async (req, res, next) => {
  try {
    const { dreamCareer, assessmentId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const assessment = assessmentId ? await Assessment.findById(assessmentId) : null;

    // Prepare payload for AI Service
    // Default performance if no assessment provided
    let performance = { "General": 50 };
    if (assessment && assessment.answers) {
      // Simple aggregated score logic or mapped from assessment
      // Ideally assessment stores topic-wise scores. Use overall score for now.
      performance = { "General": assessment.total > 0 ? (assessment.score / assessment.total) * 100 : 50 };
    }

    const aiPayload = {
      userId: user._id.toString(),
      performance: performance,
      semester: user.semester || 1, // field might need to be added to User model, default 1
      interests: [dreamCareer], // simple interest inference
      targetCareer: dreamCareer,
      timeAvailable: 15 // default
    };

    let roadmapData;
    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

    try {
      console.log(`[RoadmapController] Requesting roadmap from AI: ${AI_SERVICE_URL}/ai/generate-roadmap`);
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/ai/generate-roadmap`, aiPayload);

      if (aiResponse.data.status === 'success') {
        roadmapData = aiResponse.data.data.roadmap;
        console.log('[RoadmapController] AI Roadmap generated successfully');
      } else {
        throw new Error('AI Service returned fail status');
      }
    } catch (aiError) {
      console.error('[RoadmapController] AI Service failed, falling back to basic template:', aiError.message);
      // FALLBACK LOGIC
      // Create a basic generic roadmap if AI fails
      roadmapData = [
        {
          title: `Basics of ${dreamCareer}`,
          milestones: ['Research core concepts', 'Read introductory articles'],
          duration: '1 week'
        }
      ];
    }

    // Normalize milestones before saving
    const milestones = normalizeMilestones(roadmapData);

    const roadmap = await Roadmap.create({
      userId: user._id,
      assessmentId: assessment?._id,
      dreamCareer,
      title: `Roadmap for ${dreamCareer}`,
      description: 'Personalized learning plan',
      milestones: milestones,
      progressPercent: 0,
      totalPointsAwarded: 0
    });

    // Link roadmap to user
    user.personalizedRoadmap = roadmap._id;
    await user.save();

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

exports.getMyRoadmap = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('personalizedRoadmap');
    if (!user || !user.personalizedRoadmap) {
      return res.status(404).json({ status: 'fail', message: 'No roadmap found. Complete onboarding to generate one.' });
    }
    res.json({ status: 'success', data: user.personalizedRoadmap });
  } catch (err) { next(err); }
};

exports.completeGoal = async (req, res, next) => {
  try {
    const { id, goalId } = { id: req.params.id, goalId: req.params.goalId };
    const roadmap = await Roadmap.findById(id);
    if (!roadmap) return res.status(404).json({ status: 'fail', message: 'Not found' });

    // Handle string format "phaseIndex-taskIndex" (e.g., "0-1")
    // Fallback: If generic string, try to find milestone directly (legacy)
    let milestoneIndex = -1;
    let taskIndex = -1;

    if (goalId.includes('-')) {
      const parts = goalId.split('-');
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        milestoneIndex = parseInt(parts[0], 10);
        taskIndex = parseInt(parts[1], 10);
      }
    }

    let milestone = null;
    let task = null;

    if (milestoneIndex >= 0 && roadmap.milestones[milestoneIndex]) {
      milestone = roadmap.milestones[milestoneIndex];
      if (milestone.dailyTasks && milestone.dailyTasks[taskIndex]) {
        task = milestone.dailyTasks[taskIndex];
      }
    } else {
      // Legacy fallback: strict matching on milestoneId
      milestone = roadmap.milestones.find(m => m.milestoneId === goalId);
    }

    if (!milestone) return res.status(404).json({ status: 'fail', message: 'Milestone/Goal not found' });

    // If we found a specific task, mark it complete
    let pointsAwarded = 0;

    if (task) {
      if (!task.completed) {
        task.completed = true;
        // No specific points per task currently, but we can assume small progress
      }
    } else {
      // If no specific task targetted (legacy behavior), toggle entire milestone? 
      // Better to fail if we are strictly moving to task-based. 
      // But for safety, if we matched a milestone and no task index was provided, maybe complete the milestone.
      // However, the frontend sends 0-1, so we should always hit the task logic.
    }

    // Check if ALL tasks in milestone are complete
    const allTasksCompleted = milestone.dailyTasks.every(t => t.completed);

    if (allTasksCompleted && !milestone.completed) {
      milestone.completed = true;
      pointsAwarded = milestone.points || 75; // Award milestone points
      roadmap.totalPointsAwarded += pointsAwarded;
    }

    // Recompute total progress (Granular: based on tasks)
    let totalTasks = 0;
    let completedTasksCount = 0;

    roadmap.milestones.forEach(m => {
      if (m.dailyTasks && Array.isArray(m.dailyTasks)) {
        totalTasks += m.dailyTasks.length;
        completedTasksCount += m.dailyTasks.filter(t => t.completed).length;
      }
    });

    // Fallback to milestone count if no tasks exist (legacy support)
    if (totalTasks === 0) {
      const totalMilestones = roadmap.milestones.length || 1;
      const completedMilestonesCount = roadmap.milestones.filter(m => m.completed).length;
      roadmap.progressPercent = Math.round((completedMilestonesCount / totalMilestones) * 100);
    } else {
      roadmap.progressPercent = Math.round((completedTasksCount / totalTasks) * 100);
    }

    // Mongoose markModified might be needed for nested array updates if not using subdocs with keys
    roadmap.markModified('milestones');
    await roadmap.save();

    // Update user gamification if points awarded
    if (pointsAwarded > 0) {
      const user = await User.findById(roadmap.userId);
      if (user) {
        user.totalPoints += pointsAwarded;
        // Check for badges
        if (!user.badges.includes('first-milestone')) user.badges.push('first-milestone');
        if (user.totalPoints >= 100 && !user.badges.includes('centurion')) user.badges.push('centurion');
        await user.save();
      }
    }

    res.json({ status: 'success', data: { roadmap, pointsAwarded } });
  } catch (err) { next(err); }
};


