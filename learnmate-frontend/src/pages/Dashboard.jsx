import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Target,
  Trophy,
  Clock,
  ArrowRight,
  Zap,
  Activity,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import dashboardService from '../services/dashboardService';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/ui/PageTransition';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [gamificationRes, roadmapRes, historyRes] = await Promise.all([
          dashboardService.getGamificationStats(),
          dashboardService.getMyRoadmap(),
          dashboardService.getAssessmentHistory()
        ]);

        setStats(gamificationRes.data || {});
        setRoadmap(roadmapRes.data);
        setRecentActivity(historyRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Safe stats access
  const safeStats = {
    streak: stats?.streak || 0,
    points: stats?.points || 0,
    quizzesCompleted: stats?.quizzesCompleted || recentActivity.length || 0,
    level: stats?.level || 1,
  };

  // Mock chart data for now (can be real if available)
  const chartData = [
    { name: 'Mon', score: 65, avg: 40 },
    { name: 'Tue', score: 59, avg: 45 },
    { name: 'Wed', score: 80, avg: 70 },
    { name: 'Thu', score: 81, avg: 50 },
    { name: 'Fri', score: 56, avg: 60 },
    { name: 'Sat', score: 55, avg: 65 },
    { name: 'Sun', score: 40, avg: 45 },
  ];

  return (
    <PageTransition className="space-y-8">

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-hero-gradient p-8 text-white shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-md">
                <Sparkles className="w-3 h-3 mr-1" /> Premium Member
              </Badge>
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">
              {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Ready to continue your learning journey? You're on a <span className="font-bold text-white">{safeStats.streak} day streak</span>. Keep it up!
            </p>
          </div>

          <div className="flex gap-4">
            <Card glass className="bg-white/10 border-white/20 text-white p-4 min-w-[140px] text-center backdrop-blur-md">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
              <div className="text-2xl font-bold">{safeStats.points}</div>
              <div className="text-xs text-blue-100 uppercase tracking-wider">Total XP</div>
            </Card>
            <Card glass className="bg-white/10 border-white/20 text-white p-4 min-w-[140px] text-center backdrop-blur-md">
              <Zap className="w-6 h-6 mx-auto mb-2 text-orange-300" />
              <div className="text-2xl font-bold">{safeStats.level}</div>
              <div className="text-xs text-blue-100 uppercase tracking-wider">Level</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Daily Streak"
          value={`${safeStats.streak} Days`}
          icon={FlameIcon}
          trend="+1 from yesterday"
          color="orange"
        />
        <StatsCard
          title="Quizzes Done"
          value={safeStats.quizzesCompleted}
          icon={CheckIcon}
          trend="Top 10% of learners"
          color="green"
        />
        <StatsCard
          title="Avg. Score"
          value="85%"
          icon={Target}
          trend="+5% improvement"
          color="blue"
        />
        <StatsCard
          title="Learning Time"
          value="12.5 hrs"
          icon={Clock}
          trend="This week"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - 2 Cols */}
        <div className="lg:col-span-2 space-y-8">

          {/* Roadmap Progress */}
          <Card className="overflow-hidden border-none shadow-premium">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary-500" />
                Current Roadmap
              </CardTitle>
              <Link to="/roadmap">
                <Button variant="ghost" size="sm">View Full Plan</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {roadmap ? (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{roadmap.title}</h3>
                      <p className="text-sm text-neutral-500">{roadmap.overview}</p>
                    </div>
                    <div className="radial-progress text-primary-600 font-bold text-xs" style={{ "--value": 70, "--size": "3rem" }}>
                      70%
                    </div>
                  </div>

                  {/* Phases Preview */}
                  <div className="space-y-3">
                    {(roadmap.phases || []).slice(0, 3).map((phase, idx) => (
                      <div key={idx} className="flex items-center gap-4 group cursor-pointer hover:bg-white dark:hover:bg-neutral-700 p-2 rounded-xl transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${phase.completed
                          ? 'bg-secondary-100 text-secondary-700'
                          : idx === 0 ? 'bg-primary-100 text-primary-700 animate-pulse-slow' : 'bg-neutral-100 text-neutral-500'
                          }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className={`text-sm font-medium ${phase.completed ? 'text-secondary-700' : 'text-neutral-700 dark:text-neutral-200'}`}>
                              {phase.phaseTitle}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${phase.completed ? 'bg-secondary-500' : 'bg-primary-500'}`}
                              style={{ width: phase.completed ? '100%' : '40%' }} // Mock progress for demo phase
                            />
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Rocket className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">No Roadmap Yet</h3>
                  <p className="text-neutral-500 mb-4">Start your learning journey today.</p>
                  <Link to="/roadmap">
                    <Button>Create Roadmap</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-500" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar - 1 Col */}
        <div className="space-y-6">

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity, idx) => (
                  <div key={idx} className="flex gap-3 pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                    <div className="mt-1 min-w-[32px] w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-lg">
                      🎯
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Completed Quiz: <span className="text-primary-600">{activity.career || 'General'}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="success" size="sm">Score: {(activity.score / activity.total * 100).toFixed(0)}%</Badge>
                        <span className="text-xs text-neutral-400">2h ago</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-neutral-400">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (Mock) */}
          <Card gradient className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Daily Challenge</h3>
              <p className="text-blue-100 text-sm mb-4">Complete a React quiz with &gt;80% score to earn 50 XP.</p>
              <Button
                variant="secondary"
                className="w-full text-primary-600 font-bold border-none"
                onClick={() => navigate('/quizzes')}
              >
                Start Challenge
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageTransition>
  );
};

const StatsCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <Card hover={true}>
      <CardContent className="p-6 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{value}</h3>
          <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" /> {trend}
          </span>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
};

// Icons not imported from Lucide directly to avoid collisions or simpler use
const FlameIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3a9.9 9.9 0 0 0 .9 2.8Z" /></svg>
);

const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

export default Dashboard;
