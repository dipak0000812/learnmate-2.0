/**
 * aiRoadmapGenerator (stub)
 * Contract:
 * Input: { userProfile, assessmentSummary, dreamCareer }
 * Output: Array of milestones [{ milestoneId, title, description, estimatedDays, dailyTasks: [{day, taskTitle, taskDesc}], points }]
 *
 * Deterministic behavior based on userProfile.skillLevel and dreamCareer.
 */

function deterministicSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
}

module.exports = function aiRoadmapGenerator(input) {
  const { userProfile, assessmentSummary, dreamCareer } = input;
  const skillLevel = (userProfile?.skillLevel || 'beginner').toLowerCase();
  const baseDays = skillLevel === 'beginner' ? 14 : 7;
  const seed = deterministicSeed(`${dreamCareer}:${skillLevel}`);

  const milestones = [
    {
      milestoneId: `ms-${seed % 1000}-1`,
      title: `Foundations for ${dreamCareer}`,
      description: 'Cover core fundamentals tailored to your current level.',
      estimatedDays: baseDays,
      points: 50,
      dailyTasks: Array.from({ length: Math.min(baseDays, 14) }).map((_, idx) => ({
        day: idx + 1,
        taskTitle: `Study core topic ${idx + 1}`,
        taskDesc: 'Read docs and complete a short exercise.'
      }))
    },
    {
      milestoneId: `ms-${seed % 1000}-2`,
      title: `Practical Projects (${dreamCareer})`,
      description: 'Apply knowledge with small practice projects.',
      estimatedDays: baseDays,
      points: 75,
      dailyTasks: Array.from({ length: Math.min(baseDays, 14) }).map((_, idx) => ({
        day: idx + 1,
        taskTitle: `Build mini project ${idx + 1}`,
        taskDesc: 'Implement features and write a brief summary.'
      }))
    }
  ];

  return milestones;
};


