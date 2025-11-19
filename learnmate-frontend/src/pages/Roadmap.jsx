import React, { useState, useEffect } from 'react';
import { 
  Target, 
  CheckCircle, 
  Circle, 
  Lock,
  TrendingUp,
  Plus,
  Calendar,
  Award,
  Zap,
  Book,
  Loader
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'sonner';
import roadmapService from '../services/roadmapService';
import useAuthStore from '../store/authStore';

const Roadmap = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [selectedCareerForRoadmap, setSelectedCareerForRoadmap] = useState('');
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);

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

  // Mock roadmap data (will be replaced with API data)
  const [roadmap, setRoadmap] = useState({
    id: 1,
    career: 'Full Stack Developer',
    progress: 45,
    startDate: '2024-01-15',
    targetDate: '2024-12-31',
    totalMilestones: 5,
    completedMilestones: 2,
    milestones: [
      {
        id: 1,
        title: 'HTML & CSS Fundamentals',
        description: 'Master the basics of web development',
        status: 'completed',
        progress: 100,
        duration: '2 weeks',
        points: 150,
        goals: [
          { id: 1, title: 'HTML5 Semantic Tags', completed: true },
          { id: 2, title: 'CSS Flexbox & Grid', completed: true },
          { id: 3, title: 'Responsive Design', completed: true }
        ]
      },
      {
        id: 2,
        title: 'JavaScript Essentials',
        description: 'Learn modern JavaScript ES6+',
        status: 'completed',
        progress: 100,
        duration: '3 weeks',
        points: 200,
        goals: [
          { id: 1, title: 'Variables & Data Types', completed: true },
          { id: 2, title: 'Functions & Arrow Functions', completed: true },
          { id: 3, title: 'Async/Await & Promises', completed: true }
        ]
      },
      {
        id: 3,
        title: 'React.js Framework',
        description: 'Build modern web applications',
        status: 'in-progress',
        progress: 65,
        duration: '4 weeks',
        points: 250,
        goals: [
          { id: 1, title: 'React Components & Props', completed: true },
          { id: 2, title: 'State Management with Hooks', completed: true },
          { id: 3, title: 'React Router', completed: false },
          { id: 4, title: 'API Integration', completed: false }
        ]
      },
      {
        id: 4,
        title: 'Node.js & Express',
        description: 'Backend development fundamentals',
        status: 'locked',
        progress: 0,
        duration: '3 weeks',
        points: 220,
        goals: [
          { id: 1, title: 'Node.js Basics', completed: false },
          { id: 2, title: 'Express Framework', completed: false }
        ]
      },
      {
        id: 5,
        title: 'Database Management',
        description: 'SQL & NoSQL databases',
        status: 'locked',
        progress: 0,
        duration: '3 weeks',
        points: 200,
        goals: [
          { id: 1, title: 'MongoDB Basics', completed: false },
          { id: 2, title: 'PostgreSQL & SQL', completed: false }
        ]
      }
    ]
  });

  // Load user's roadmap on component mount
  useEffect(() => {
    loadUserRoadmap();
  }, [user]);

  // Check if user came from career selection
  useEffect(() => {
    const selectedCareer = localStorage.getItem('selectedCareer');
    if (selectedCareer && !generatedRoadmap) {
      const career = JSON.parse(selectedCareer);
      setSelectedCareerForRoadmap(career.title);
      setShowCreateModal(true);
      // Clear it so modal doesn't show again
      localStorage.removeItem('selectedCareer');
    }
  }, []);

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
        
        // Update roadmap state with API data
        setRoadmap({
          ...roadmap,
          career: userRoadmap.career || roadmap.career,
          startDate: userRoadmap.startDate || roadmap.startDate,
          targetDate: userRoadmap.targetDate || roadmap.targetDate
        });
        
        console.log('Loaded roadmap:', userRoadmap);
      }
    } catch (error) {
      console.error('Error loading roadmap:', error);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!selectedCareerForRoadmap) {
      toast.error('Please select a career first');
      return;
    }

    setLoading(true);
    try {
      // Get assessment results if available
      const assessmentResults = JSON.parse(localStorage.getItem('assessmentResults'));
      const assessmentId = assessmentResults?.assessmentId || null;

      console.log('Generating roadmap for:', selectedCareerForRoadmap);
      
      const response = await roadmapService.generateRoadmap(
        selectedCareerForRoadmap,
        assessmentId
      );

      if (response.status === 'success') {
        setGeneratedRoadmap(response.data);
        toast.success('Roadmap generated successfully! 🎉');
        setShowCreateModal(false);
        
        // Update roadmap state
        setRoadmap({
          ...roadmap,
          career: selectedCareerForRoadmap,
          startDate: new Date().toISOString().split('T')[0]
        });
        
        console.log('Generated roadmap:', response.data);
        
        // Reload user roadmaps
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
      if (generatedRoadmap?._id) {
        const response = await roadmapService.completeGoal(generatedRoadmap._id, goalId);
        if (response.status === 'success') {
          toast.success('Goal marked as complete! 🎉');
          await loadUserRoadmap();
        }
      } else {
        toast.success('Goal marked as complete! 🎉');
      }
    } catch (error) {
      console.error('Error completing goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'locked': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-6 h-6 text-white" />;
      case 'in-progress': return <Zap className="w-6 h-6 text-white" />;
      case 'locked': return <Lock className="w-6 h-6 text-white" />;
      default: return <Circle className="w-6 h-6 text-white" />;
    }
  };

  if (loadingRoadmap) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Roadmap
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your personalized path to becoming a {roadmap.career}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Create New Roadmap
        </Button>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-blue-100 mb-1">Overall Progress</p>
              <p className="text-4xl font-bold">{roadmap.progress}%</p>
            </div>
            <div>
              <p className="text-blue-100 mb-1">Milestones</p>
              <p className="text-4xl font-bold">
                {roadmap.completedMilestones}/{roadmap.totalMilestones}
              </p>
            </div>
            <div>
              <p className="text-blue-100 mb-1">Start Date</p>
              <p className="text-xl font-semibold">{new Date(roadmap.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-blue-100 mb-1">Target Date</p>
              <p className="text-xl font-semibold">{new Date(roadmap.targetDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${roadmap.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-8">
          {roadmap.milestones.map((milestone) => (
            <div key={milestone.id} className="relative">
              <div className={`absolute left-8 -translate-x-1/2 w-16 h-16 rounded-full ${getStatusColor(milestone.status)} flex items-center justify-center shadow-lg z-10`}>
                {getStatusIcon(milestone.status)}
              </div>

              <Card className="ml-20 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {milestone.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                          milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {milestone.status === 'in-progress' ? 'In Progress' : milestone.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {milestone.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {milestone.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {milestone.points} points
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {milestone.goals.filter(g => g.completed).length}/{milestone.goals.length} goals
                        </div>
                      </div>
                    </div>
                  </div>

                  {milestone.status !== 'locked' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{milestone.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {milestone.status !== 'locked' && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Goals
                      </h4>
                      <div className="space-y-2">
                        {milestone.goals.map((goal) => (
                          <button
                            key={goal.id}
                            onClick={() => !goal.completed && handleCompleteGoal(milestone.id, goal.id)}
                            className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                              goal.completed 
                                ? 'bg-green-50 dark:bg-green-900/20 cursor-default' 
                                : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {goal.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${
                              goal.completed 
                                ? 'text-green-600 line-through' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {goal.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {milestone.status === 'locked' && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete previous milestones to unlock
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-6 text-center">
          <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Keep Going! You're Making Great Progress
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete your current milestone to unlock the next one
          </p>
          <Button>Continue Learning</Button>
        </CardContent>
      </Card>

      {/* Create Roadmap Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Create New Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Your Dream Career
                </label>
                <select
                  value={selectedCareerForRoadmap}
                  onChange={(e) => setSelectedCareerForRoadmap(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a career...</option>
                  {careerOptions.map((career) => (
                    <option key={career} value={career}>
                      {career}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 <strong>Tip:</strong> We'll use your assessment results and profile to create a personalized learning path!
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateRoadmap}
                  disabled={loading || !selectedCareerForRoadmap}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Generate Roadmap
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Roadmap;