const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const axios = require('axios');

const normalizeMilestones = (phases = []) => {
  if (!Array.isArray(phases) || phases.length === 0) return [];
  return phases.map((phase, idx) => {
    const estimatedDays = typeof phase.duration === 'string'
      ? parseInt(phase.duration.replace(/\D/g, ''), 10) * 30 || 30
      : 30;
    const tasks = Array.isArray(phase.milestones) ? phase.milestones : [];
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

// Save onboarding step
router.post('/save-step', auth, async (req, res) => {
  try {
    const { step, data } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    if (!user.onboardingData) {
      user.onboardingData = {};
    }

    if (step === 'interests') {
      user.onboardingData.interests = data.interests || [];
      if (data.skillLevel) user.onboardingData.skillLevel = data.skillLevel;
    } else if (step === 'goals') {
      user.onboardingData.dreamCompanies = data.dreamCompanies || [];
      user.onboardingData.targetRole = data.targetRole || '';
      if (data.timeline) user.onboardingData.timeline = data.timeline;
    } else if (step === 'assessment') {
      user.onboardingData.assessmentCompleted = true;
      user.onboardingData.assessmentScore = data.score || 0;
      user.onboardingData.assessmentResults = data.results || {};
    } else if (step === 'skills') {
      user.onboardingData.knownSkills = data.knownSkills || [];
    } else if (step === 'timeline') {
      user.onboardingData.timeline = data.timeline || user.onboardingData.timeline;
    }

    await user.save();

    res.json({
      status: 'success',
      message: 'Onboarding step saved',
      data: { onboardingData: user.onboardingData }
    });
  } catch (error) {
    console.error('Save onboarding step error:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to save onboarding data'
    });
  }
});

// Get onboarding progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('onboardingData onboardingCompleted');
    res.json({
      status: 'success',
      data: {
        onboardingData: user?.onboardingData || {},
        onboardingCompleted: user?.onboardingCompleted || false
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Failed to fetch progress' });
  }
});

// Complete onboarding - generate AI roadmap and link to user
router.post('/complete', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    if (!user.onboardingData?.assessmentCompleted) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please complete the assessment first'
      });
    }

    const roadmapRequest = {
      userId: user._id.toString(),
      userName: user.name,
      interests: user.onboardingData.interests || [],
      skillLevel: user.onboardingData.skillLevel || 'beginner',
      targetRole: user.onboardingData.targetRole || 'Developer',
      dreamCompanies: user.onboardingData.dreamCompanies || [],
      timeline: user.onboardingData.timeline || '6-months',
      knownSkills: user.onboardingData.knownSkills || [],
      assessmentScore: user.onboardingData.assessmentScore || 0,
      assessmentResults: user.onboardingData.assessmentResults || {}
    };

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
    let aiRoadmap;

    try {
      const aiResponse = await axios.post(
        `${aiServiceUrl.replace(/\/$/, '')}/ai/generate-roadmap`,
        roadmapRequest,
        { timeout: 30000 }
      );
      aiRoadmap = aiResponse.data;
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      aiRoadmap = {
        title: `Learning Path for ${roadmapRequest.targetRole}`,
        description: `Personalized roadmap based on your ${roadmapRequest.skillLevel} level in ${roadmapRequest.interests.join(', ')}`,
        phases: []
      };
    }

    const normalizedMilestones = normalizeMilestones(aiRoadmap.roadmap);
    const roadmap = await Roadmap.create({
      userId: user._id,
      assessmentId: null,
      dreamCareer: roadmapRequest.targetRole,
      title: aiRoadmap.title || `Your Path to ${roadmapRequest.targetRole}`,
      description: aiRoadmap.description || '',
      estimatedDuration: aiRoadmap.estimatedDuration || roadmapRequest.timeline,
      targetCompanies: roadmapRequest.dreamCompanies || [],
      phases: aiRoadmap.roadmap || [],
      milestones: normalizedMilestones.length ? normalizedMilestones : [],
      progressPercent: 0,
      totalPointsAwarded: 0
    });

    user.onboardingCompleted = true;
    user.personalizedRoadmap = roadmap._id;
    await user.save();

    res.json({
      status: 'success',
      message: 'Onboarding completed! Your personalized roadmap is ready.',
      data: {
        roadmap,
        user: {
          _id: user._id,
          onboardingCompleted: true,
          personalizedRoadmap: roadmap._id
        }
      }
    });
  } catch (error) {
    console.error('Onboarding completion error:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to complete onboarding. Please try again.'
    });
  }
});

module.exports = router;


