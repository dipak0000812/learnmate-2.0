import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Award,
  Brain,
  Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import useAuthStore from '../store/authStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dashboardService from '../services/dashboardService';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    totalPoints: 0,
    currentLevel: 1,
    streak: 0,
    roadmapProgress: 0
  });

  const [progressData, setProgressData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [gamificationRes, roadmapRes, assessmentRes] = await Promise.allSettled([
          dashboardService.getGamificationStats(),
          dashboardService.getMyRoadmap(),
          dashboardService.getAssessmentHistory(5)
        ]);

        // Update stats from gamification
        if (gamificationRes.status === 'fulfilled' && gamificationRes.value?.data) {
          const gData = gamificationRes.value.data;
          setStats(prev => ({
            ...prev,
            totalPoints: gData.points || 0,
            currentLevel: gData.level || 1,
            streak: gData.streak || 0
          }));
        }

        // Update roadmap progress
        if (roadmapRes.status === 'fulfilled' && roadmapRes.value?.data) {
          const roadmap = roadmapRes.value.data;
          // Calculate progress from phases or milestones
          if (roadmap.phases) {
            const completedPhases = roadmap.phases.filter(p => p.completed).length;
            const totalPhases = roadmap.phases.length;
            setStats(prev => ({
              ...prev,
              roadmapProgress: totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0
            }));
          } else if (roadmap.progressPercent !== undefined) {
            setStats(prev => ({
              ...prev,
              roadmapProgress: roadmap.progressPercent || 0
            }));
          }
        }

        // Update quiz stats and recent activities from assessments
        if (assessmentRes.status === 'fulfilled' && assessmentRes.value?.data) {
          const assessments = assessmentRes.value.data || [];
          setStats(prev => ({
            ...prev,
            completedQuizzes: assessments.length,
            totalQuizzes: assessments.length // For now, use completed as total
          }));

          // Build recent activities from assessments
          const activities = assessments.slice(0, 4).map((assessment, idx) => ({
            id: assessment._id || idx,
            type: 'quiz',
            title: `Completed ${assessment.career || 'Assessment'}`,
            score: assessment.total > 0 ? Math.round((assessment.score / assessment.total) * 100) : null,
            time: assessment.createdAt ? formatDistanceToNow(new Date(assessment.createdAt), { addSuffix: true }) : 'Recently',
            icon: BookOpen,
            color: 'text-blue-600'
          }));
          setRecentActivities(activities);

          // Generate progress chart data from assessment scores (last 7 assessments or mock if less)
          if (assessments.length > 0) {
            const chartData = assessments.slice(-7).map((assess, idx) => {
              const score = assess.total > 0 ? Math.round((assess.score / assess.total) * 100) : 0;
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              return {
                day: days[idx % 7] || `Day ${idx + 1}`,
                score
              };
            });
            // Pad with zeros if less than 7
            while (chartData.length < 7) {
              chartData.unshift({ day: 'Mon', score: 0 });
            }
            setProgressData(chartData);
          } else {
            // Default empty chart
            setProgressData([
              { day: 'Mon', score: 0 },
              { day: 'Tue', score: 0 },
              { day: 'Wed', score: 0 },
              { day: 'Thu', score: 0 },
              { day: 'Fri', score: 0 },
              { day: 'Sat', score: 0 },
              { day: 'Sun', score: 0 }
            ]);
          }
        }

        // Add achievement activity if user has badges
        if (gamificationRes.status === 'fulfilled' && gamificationRes.value?.data?.achievements?.length > 0) {
          const badges = gamificationRes.value.data.achievements;
          setRecentActivities(prev => [
            {
              id: 'achievement',
              type: 'achievement',
              title: `Earned "${badges[badges.length - 1]}" Badge`,
              time: 'Recently',
              icon: Award,
              color: 'text-purple-600'
            },
            ...prev.slice(0, 3)
          ]);
        }

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Recommended actions
  const recommendations = [
    {
      id: 1,
      title: 'Take Next Quiz',
      description: 'Continue your learning streak',
      link: '/quizzes',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Update Roadmap',
      description: 'Mark completed milestones',
      link: '/roadmap',
      icon: Target,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      title: 'Explore Careers',
      description: 'Discover new opportunities',
      link: '/careers',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to continue your learning journey today?
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
            <Zap className="w-6 h-6 text-yellow-300" />
            <div>
              <p className="text-sm text-blue-100">Current Streak</p>
              <p className="text-2xl font-bold">{stats.streak} Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Points */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Points</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPoints}
                </h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +125 this week
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quizzes Completed */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quizzes</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.completedQuizzes}/{stats.totalQuizzes}
                </h3>
                <p className="text-xs text-blue-600 mt-1">67% completion</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Level */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Level</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Level {stats.currentLevel}
                </h3>
                <p className="text-xs text-purple-600 mt-1">350/500 XP</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Progress */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Roadmap</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.roadmapProgress}%
                </h3>
                <p className="text-xs text-green-600 mt-1">On track</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                        {activity.score && (
                          <span className="text-xs font-semibold text-green-600">
                            {activity.score}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recommended Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <Link
                key={rec.id}
                to={rec.link}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${rec.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {rec.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;