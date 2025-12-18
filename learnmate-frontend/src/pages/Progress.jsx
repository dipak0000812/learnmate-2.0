import React, { useState, useEffect } from 'react';
import {
  Target,
  BookOpen,
  Clock,
  Zap,
  Activity,
  Award,
  Loader
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dashboardService from '../services/dashboardService';
import { toast } from 'sonner';

const Progress = () => {
  const [timeRange, setTimeRange] = useState('week'); // Not fully implemented in backend yet, just UI state
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: 0,
    quizzesCompleted: 0,
    averageScore: 0,
    currentStreak: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      try {
        const [gamificationRes, assessmentsRes, roadmapRes] = await Promise.all([
          dashboardService.getGamificationStats(),
          dashboardService.getAssessmentHistory(20), // Fetch more for charts
          dashboardService.getMyRoadmap()
        ]);

        const gamification = gamificationRes.data || {};
        const assessments = assessmentsRes.data || [];
        const roadmap = roadmapRes.data || {};

        // Calculate Roadmap Stats
        let completedRoadmapTasks = 0;
        if (roadmap.milestones) {
          roadmap.milestones.forEach(m => {
            if (m.dailyTasks) {
              completedRoadmapTasks += m.dailyTasks.filter(t => t.completed).length;
            }
          });
        }

        // Calculate Assessment Stats
        const completedQuizzes = assessments.length;
        const totalScore = assessments.reduce((acc, curr) => acc + (curr.total > 0 ? (curr.score / curr.total) * 100 : 0), 0);
        const avgScore = completedQuizzes > 0 ? Math.round(totalScore / completedQuizzes) : 0;

        // Calculate Est. Hours (Quizzes = 30m, Roadmap Tasks = 45m)
        const totalHours = (completedQuizzes * 0.5) + (completedRoadmapTasks * 0.75);

        setStats({
          totalHours: Math.round(totalHours * 10) / 10,
          quizzesCompleted: completedQuizzes,
          tasksCompleted: completedRoadmapTasks, // New stat
          averageScore: avgScore,
          currentStreak: gamification.streak || 0
        });

        // Prepare Chart Data (Scores over time)
        // Reverse because API returns newest first
        const historyReversed = [...assessments].reverse();
        const data = historyReversed.map((a, i) => ({
          day: new Date(a.createdAt).toLocaleDateString(undefined, { weekday: 'short' }), // Just weekday for simplicity
          score: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
          quizIndex: i + 1
        }));

        // If not enough data, pad with empty or just show what we have
        setChartData(data);


        // Subject Progress (Aggregate by 'career' or 'topic')
        // Assessments have 'career' field which serves as topic
        const subjects = {};
        assessments.forEach(a => {
          const subject = a.career || 'General';
          if (!subjects[subject]) subjects[subject] = { total: 0, count: 0 };
          subjects[subject].total += (a.total > 0 ? (a.score / a.total) * 100 : 0);
          subjects[subject].count += 1;
        });

        const subjectData = Object.keys(subjects).map((key, index) => {
          const colors = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444'];
          return {
            subject: key,
            progress: Math.round(subjects[key].total / subjects[key].count),
            color: colors[index % colors.length]
          };
        });
        setSubjectProgress(subjectData);

        // Milestones
        const recentMilestones = [];
        if (completedQuizzes >= 1) recentMilestones.push({ id: 1, title: 'First Quiz Completed', date: 'Recently', icon: '🎯' });
        if (gamification.level >= 5) recentMilestones.push({ id: 2, title: 'Reached Level 5', date: 'Recently', icon: '⭐' });
        if (gamification.streak >= 7) recentMilestones.push({ id: 3, title: '7 Day Streak', date: 'Recently', icon: '🔥' });

        setMilestones(recentMilestones);

      } catch (error) {
        console.error('Failed to load progress data:', error);
        toast.error('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [timeRange]);


  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader className="animate-spin text-blue-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Time Range Selector (Visual only for now) */}
      <div className="flex gap-2">
        {['week', 'month', 'year'].map(r => (
          <button
            key={r}
            onClick={() => setTimeRange(r)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${timeRange === r
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
          >
            This {r}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Est. Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.quizzesCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tasksCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Quiz Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No quiz data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Subject Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjectProgress.length > 0 ? (
              <div className="space-y-4">
                {subjectProgress.map((subject) => (
                  <div key={subject.subject}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{subject.subject}</span>
                      <span className="font-semibold" style={{ color: subject.color }}>{subject.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                Complete quizzes to see subject progress
              </div>
            )}

          </CardContent>
        </Card>
      </div>

      {/* Recent Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Recent Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {milestones.length > 0 ? (
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-3xl">{milestone.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{milestone.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{milestone.date}</p>
                  </div>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">No milestones yet. Keep learning!</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;