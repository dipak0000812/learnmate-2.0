import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle,
  Lock,
  Plus,
  Calendar,
  Loader2,
  ChevronDown,
  Map,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/ui/PageTransition';
import { toast } from 'sonner';
import roadmapService from '../services/roadmapService';
import useAuthStore from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const Roadmap = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [selectedCareerForRoadmap, setSelectedCareerForRoadmap] = useState('');
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const [expandedPhases, setExpandedPhases] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  // Career options for the modal
  const careerOptions = [
    'Full Stack Developer',
    'Data Scientist',
    'UI/UX Designer',
    'DevOps Engineer',
    'Mobile App Developer',
    'AI/ML Engineer',
    'Product Manager',
    'Cybersecurity Specialist',
    'Cloud Architect',
    'Blockchain Developer'
  ];

  const [roadmap, setRoadmap] = useState(null);

  // Load user's roadmap on component mount
  useEffect(() => {
    loadUserRoadmap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Check if user came from career selection
  useEffect(() => {
    const selectedCareer = localStorage.getItem('selectedCareer');
    if (selectedCareer && !generatedRoadmap) {
      const career = JSON.parse(selectedCareer);
      setSelectedCareerForRoadmap(career.title);
      setShowCreateModal(true);
      localStorage.removeItem('selectedCareer');
    }
  }, [generatedRoadmap]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const togglePhase = (id) => {
    setExpandedPhases(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const loadUserRoadmap = async () => {
    if (!user?._id) {
      setLoadingRoadmap(false);
      return;
    }

    try {
      const response = await roadmapService.getUserRoadmaps(user._id);
      if (response.status === 'success' && response.data && response.data.length > 0) {
        const userRoadmap = response.data[0];
        setGeneratedRoadmap(userRoadmap);
        processRoadmapData(userRoadmap);
      }
    } catch (error) {
      console.error('Error loading roadmap:', error);
      toast.error("Failed to load your roadmap.");
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const processRoadmapData = (userRoadmap) => {
    // Transform API data to friendly format
    const mappedMilestones = (userRoadmap.milestones || []).map((m, idx) => ({
      id: m._id || idx + 1,
      title: m.title,
      description: m.description,
      status: m.completed ? 'completed' : (idx === 0 || userRoadmap.milestones[idx - 1]?.completed) ? 'in-progress' : 'locked',
      progress: m.dailyTasks && m.dailyTasks.length > 0
        ? Math.round((m.dailyTasks.filter(t => t.completed).length / m.dailyTasks.length) * 100)
        : (m.completed ? 100 : 0),
      duration: `${m.estimatedDays || 14} days`,
      points: m.points || 50,
      goals: (m.dailyTasks || []).map((t, tIdx) => ({
        id: t._id || `${idx}-${tIdx}`,
        title: t.taskTitle,
        completed: t.completed
      }))
    }));

    // Default expand the first active phase
    const activePhase = mappedMilestones.find(m => m.status === 'in-progress') || mappedMilestones[0];
    if (activePhase && Object.keys(expandedPhases).length === 0) {
      setExpandedPhases({ [activePhase.id]: true });
    }

    setRoadmap({
      id: userRoadmap._id,
      career: userRoadmap.dreamCareer,
      progress: userRoadmap.progressPercent || 0,
      totalMilestones: mappedMilestones.length,
      completedMilestones: mappedMilestones.filter(m => m.status === 'completed').length,
      milestones: mappedMilestones
    });
  };

  const handleGenerateRoadmap = async () => {
    if (!selectedCareerForRoadmap) {
      toast.error('Please select a career first');
      return;
    }

    setLoading(true);
    try {
      const assessmentResults = JSON.parse(localStorage.getItem('assessmentResults'));
      const assessmentId = assessmentResults?.assessmentId || null;

      const response = await roadmapService.generateRoadmap(
        selectedCareerForRoadmap,
        assessmentId
      );

      if (response.status === 'success') {
        setShowConfetti(true);
        toast.success('Roadmap generated successfully! 🚀');
        setShowCreateModal(false);
        await loadUserRoadmap();
      }
    } catch (error) {
      console.error('Roadmap Generation Error:', error);
      toast.error('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoal = async (milestoneId, goalId) => {
    try {
      // Optimistic update
      setRoadmap(prev => {
        const newMilestones = prev.milestones.map(m => {
          if (m.id === milestoneId) {
            const newGoals = m.goals.map(g => g.id === goalId ? { ...g, completed: true } : g);
            const completedCount = newGoals.filter(g => g.completed).length;
            const progress = Math.round((completedCount / newGoals.length) * 100);

            // Check if all goals completed
            if (progress === 100 && m.status !== 'completed') {
              setShowConfetti(true);
              toast.success(`Milestone completed! +${m.points} XP 🏆`);
            }

            return { ...m, goals: newGoals, progress };
          }
          return m;
        });
        return { ...prev, milestones: newMilestones };
      });

      if (generatedRoadmap?._id) {
        await roadmapService.completeGoal(generatedRoadmap._id, goalId);
        // Refresh to ensure sync - Critical for phase unlocking logic
        await loadUserRoadmap();
        // Refresh user stats (XP, Level) in Sidebar
        await useAuthStore.getState().fetchUser();
      }
    } catch (error) {
      console.error('Error completing goal:', error);
      toast.error('Failed to update progress');
    }
  };

  if (loadingRoadmap) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Loading your journey...</h3>
        </div>
      </div>
    );
  }

  // Empty State
  if (!roadmap && !loadingRoadmap) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto px-4">
          <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6">
            <Map className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">Start Your Learning Journey</h1>
          <p className="text-neutral-500 mb-8 text-lg">
            Select your dream career and get a personalized AI-generated roadmap tailored just for you.
          </p>
          <Button size="lg" onClick={() => setShowCreateModal(true)} className="px-8 shadow-lg shadow-primary-500/25">
            <Plus className="w-5 h-5 mr-2" /> Create Custom Roadmap
          </Button>

          {/* Modal for empty state */}
          {showCreateModal && (
            <CreateRoadmapModal
              show={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              selectedCareer={selectedCareerForRoadmap}
              setSelectedCareer={setSelectedCareerForRoadmap}
              onGenerate={handleGenerateRoadmap}
              loading={loading}
              careerOptions={careerOptions}
            />
          )}
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}

      <div className="space-y-8 pb-12">
        {/* Premium Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 p-8 sm:p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-md">
                  <Map className="w-3 h-3 mr-1" /> Career Path
                </Badge>
                <span className="text-indigo-200 text-sm font-medium">Updated today</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
                {roadmap.career}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-indigo-100">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Start: {new Date(roadmap.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Target className="w-4 h-4" />
                  <span>{roadmap.completedMilestones}/{roadmap.totalMilestones} Phases</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-w-[200px]">
              <div className="flex justify-between items-end mb-2">
                <span className="text-indigo-100 font-medium">Total Progress</span>
                <span className="text-3xl font-bold">{roadmap.progress}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-900/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${roadmap.progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Career Path
          </Button>
        </div>

        {/* Timeline phases */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary-500 via-indigo-200 to-transparent dark:from-primary-600 dark:via-neutral-800 opacity-30"></div>

          <div className="space-y-8">
            {roadmap.milestones.map((phase, index) => (
              <div key={phase.id} className="relative pl-12 md:pl-24">
                {/* Connector Node */}
                <div className={`absolute left-4 md:left-8 top-8 -translate-x-1/2 w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 bg-white dark:bg-neutral-900 transition-colors ${phase.status === 'completed' ? 'border-emerald-500 text-emerald-500' :
                  phase.status === 'in-progress' ? 'border-primary-500 text-primary-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' :
                    'border-neutral-200 dark:border-neutral-700 text-neutral-300'
                  }`}>
                  {phase.status === 'completed' && <CheckCircle className="w-full h-full p-0.5 bg-emerald-500 text-white rounded-full" />}
                  {phase.status === 'in-progress' && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse"></div>}
                  {phase.status === 'locked' && <Lock className="w-3 h-3" />}
                </div>

                {/* Phase Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 ${expandedPhases[phase.id] ? 'ring-2 ring-primary-500/20 shadow-lg' : 'hover:shadow-md'
                      } ${phase.status === 'locked' ? 'opacity-75 grayscale' : ''}`}
                    onClick={() => phase.status !== 'locked' && togglePhase(phase.id)}
                  >
                    <CardContent className="p-0">
                      {/* Card Header */}
                      <div className="p-5 md:p-6 flex items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                              Phase {index + 1}: {phase.title}
                            </h3>
                            {phase.status === 'in-progress' && <Badge variant="primary" size="sm" className="animate-pulse-slow">Current Focus</Badge>}
                            {phase.status === 'completed' && <Badge variant="success" size="sm">Completed</Badge>}
                          </div>
                          <p className="text-neutral-500 text-sm line-clamp-2 md:line-clamp-1">{phase.description}</p>
                        </div>
                        <div className="flex items-center gap-4 text-neutral-400">
                          <div className="hidden md:flex items-center gap-2 text-sm font-medium decoration-neutral-300">
                            <div className="flex items-center gap-1"><ClockIcon /> {phase.duration}</div>
                            <div className="w-1 h-1 rounded-full bg-neutral-300" />
                            <div className="flex items-center gap-1"><ZapIcon /> {phase.points} XP</div>
                          </div>
                          <div className={`transition-transform duration-300 ${expandedPhases[phase.id] ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedPhases[phase.id] && phase.status !== 'locked' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-neutral-100 dark:border-neutral-800"
                          >
                            <div className="p-5 md:p-6 bg-neutral-50/50 dark:bg-neutral-800/30">

                              {/* Progress Bar */}
                              <div className="mb-6 flex items-center gap-4">
                                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 w-16">{phase.progress}% Done</span>
                                <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transition-all duration-500"
                                    style={{ width: `${phase.progress}%` }}
                                  />
                                </div>
                              </div>

                              {/* Goals List */}
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Key Learning Objectives</h4>
                                {phase.goals.map((goal) => (
                                  <div
                                    key={goal.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!goal.completed) handleCompleteGoal(phase.id, goal.id);
                                    }}
                                    className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${goal.completed
                                      ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30'
                                      : 'bg-white border-neutral-200 hover:border-primary-300 hover:shadow-sm dark:bg-neutral-800 dark:border-neutral-700'
                                      }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${goal.completed
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'border-neutral-300 text-transparent group-hover:border-primary-400'
                                        }`}>
                                        <CheckCircle className="w-4 h-4" />
                                      </div>
                                      <span className={`text-sm font-medium ${goal.completed ? 'text-emerald-800 dark:text-emerald-400 line-through' : 'text-neutral-700 dark:text-neutral-200'
                                        }`}>
                                        {goal.title}
                                      </span>
                                    </div>

                                    {!goal.completed && (
                                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-xs h-7">
                                        Mark Done
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Resources Section (Mock) */}
                              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center gap-2 text-primary-600 text-sm font-semibold cursor-pointer hover:underline">
                                  <BookOpen className="w-4 h-4" />
                                  View Recommended Resources for this Phase
                                </div>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {showCreateModal && (
          <CreateRoadmapModal
            show={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            selectedCareer={selectedCareerForRoadmap}
            setSelectedCareer={setSelectedCareerForRoadmap}
            onGenerate={handleGenerateRoadmap}
            loading={loading}
            careerOptions={careerOptions}
          />
        )}
      </div>
    </PageTransition>
  );
};

// Sub-components
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const ZapIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);

const CreateRoadmapModal = ({ show, onClose, selectedCareer, setSelectedCareer, onGenerate, loading, careerOptions }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="max-w-md w-full shadow-2xl scale-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            Create Your Path
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Select Your Dream Career
            </label>
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
            >
              <option value="">Choose a career path...</option>
              {careerOptions.map((career) => (
                <option key={career} value={career}>
                  {career}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/10 rounded-xl p-4 border border-primary-100 dark:border-primary-900/30">
            <p className="text-sm text-primary-800 dark:text-primary-300 leading-relaxed">
              <strong>AI-Powered:</strong> We'll analyze your profile and current skills to build a custom step-by-step roadmap just for you.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={onGenerate}
              disabled={loading || !selectedCareer}
              className="flex-1 shadow-lg shadow-primary-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Plan <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Roadmap;