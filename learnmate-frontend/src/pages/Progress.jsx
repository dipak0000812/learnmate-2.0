import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  BookOpen,
  Clock,
  Zap,
  Trophy,
  BarChart3,
  Activity
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Progress = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data
  const stats = {
    totalHours: 87,
    quizzesCompleted: 24,
    averageScore: 86,
    currentStreak: 12,
    longestStreak: 18,
    totalPoints: 3450,
    level: 7,
    rank: 'Gold'
  };

  const weeklyData = [
    { day: 'Mon', hours: 2.5, quizzes: 3, score: 85 },
    { day: 'Tue', hours: 3.2, quizzes: 4, score: 88 },
    { day: 'Wed', hours: 1.8, quizzes: 2, score: 82 },
    { day: 'Thu', hours: 4.1, quizzes: 5, score: 91 },
    { day: 'Fri', hours: 2.9, quizzes: 3, score: 87 },
    { day: 'Sat', hours: 3.5, quizzes: 4, score: 89 },
    { day: 'Sun', hours: 2.2, quizzes: 3, score: 84 }
  ];

  const monthlyData = [
    { month: 'Jan', hours: 45, quizzes: 12 },
    { month: 'Feb', hours: 52, quizzes: 15 },
    { month: 'Mar', hours: 61, quizzes: 18 },
    { month: 'Apr', hours: 58, quizzes: 16 },
    { month: 'May', hours: 67, quizzes: 20 },
    { month: 'Jun', hours: 72, quizzes: 22 }
  ];

  const subjectProgress = [
    { subject: 'JavaScript', progress: 85, color: '#F59E0B' },
    { subject: 'React', progress: 72, color: '#3B82F6' },
    { subject: 'Node.js', progress: 65, color: '#10B981' },
    { subject: 'Database', progress: 58, color: '#8B5CF6' },
    { subject: 'DevOps', progress: 42, color: '#EF4444' }
  ];

  const performanceData = [
    { name: 'Excellent', value: 45, color: '#10B981' },
    { name: 'Good', value: 35, color: '#3B82F6' },
    { name: 'Average', value: 15, color: '#F59E0B' },
    { name: 'Below Avg', value: 5, color: '#EF4444' }
  ];

  const milestones = [
    { id: 1, title: 'First Quiz Completed', date: '2024-01-15', icon: '🎯' },
    { id: 2, title: 'Reached Level 5', date: '2024-02-10', icon: '⭐' },
    { id: 3, title: '7 Day Streak', date: '2024-02-20', icon: '🔥' },
    { id: 4, title: '50 Hours Learning', date: '2024-03-05', icon: '⏱️' },
    { id: 5, title: 'Gold Rank Achieved', date: '2024-03-15', icon: '🏆' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['week', 'month', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {range === 'week'
              ? 'This Week'
              : range === 'month'
              ? 'This Month'
              : 'This Year'}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Hours
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalHours}
                </p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quizzes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.quizzesCompleted}
                </p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Score
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageScore}%
                </p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Streak
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.currentStreak} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Weekly Learning Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
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
                <Bar dataKey="hours" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Performance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Subject-wise Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectProgress.map((subject) => (
              <div key={subject.subject}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {subject.subject}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: subject.color }}
                  >
                    {subject.progress}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${subject.progress}%`,
                      backgroundColor: subject.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;
