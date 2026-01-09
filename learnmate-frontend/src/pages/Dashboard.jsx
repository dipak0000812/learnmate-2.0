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
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >

      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 p-8 md:p-12 text-white shadow-2xl">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-md px-3 py-1">
                <Sparkles className="w-3 h-3 mr-2 text-yellow-300" />
                <span className="font-semibold tracking-wide text-xs uppercase">Premium Member</span>
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 tracking-tight">
              {getGreeting()}, <span className="text-blue-100">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-blue-100/90 text-lg max-w-xl font-light leading-relaxed">
              Resuming your path to mastery. You're on a <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">{safeStats.streak} day streak</span>.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 border border-white/20 text-white p-4 rounded-2xl min-w-[140px] text-center backdrop-blur-md shadow-lg transform transition hover:scale-105">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-300 drop-shadow-md" />
              <div className="text-3xl font-heading font-bold">{safeStats.points}</div>
              <div className="text-xs text-blue-100 uppercase tracking-widest font-semibold opacity-80">Total XP</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - 2 Cols */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">

          {/* Roadmap Progress */}
          <Card className="overflow-hidden border-slate-100 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6">
              <CardTitle className="flex items-center gap-3 font-heading text-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                Current Roadmap
              </CardTitle>
              <Link to="/roadmap">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  View Full Plan <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {roadmap ? (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white mb-2">{roadmap.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-lg">{roadmap.overview}</p>
                    </div>
                    <div className="radial-progress text-blue-600 font-bold text-sm" style={{ "--value": 70, "--size": "4rem", "--thickness": "4px" }}>
                      70%
                    </div>
                  </div>

                  {/* Phases Preview */}
                  <div className="space-y-4">
                    {(roadmap.phases || []).slice(0, 3).map((phase, idx) => (
                      <div key={idx} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-3 -mx-3 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all ${phase.completed
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : idx === 0 ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className={`text-sm font-semibold ${phase.completed ? 'text-green-700 dark:text-green-400' : 'text-slate-900 dark:text-slate-200'}`}>
                              {phase.phaseTitle}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${phase.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: phase.completed ? '100%' : '40%' }} // Mock progress for demo phase
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 px-6 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mb-2">No Roadmap Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">Your personalized learning journey is waiting only a click away.</p>
                  <Link to="/roadmap">
                    <Button size="lg" className="shadow-xl shadow-blue-500/20">Generate UI/UX Roadmap</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="shadow-lg border-slate-100 dark:border-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6">
              <CardTitle className="flex items-center gap-2 font-heading text-lg">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Inter' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Inter' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontFamily: 'Inter',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </motion.div>

        {/* Sidebar - 1 Col */}
        <motion.div variants={itemVariants} className="space-y-6">

          {/* Recent Activity */}
          <Card className="shadow-lg border-slate-100 dark:border-slate-800 h-fit">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6">
              <CardTitle className="flex items-center gap-2 font-heading text-lg">
                <Activity className="w-5 h-5 text-emerald-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity, idx) => (
                  <div key={idx} className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="mt-1 min-w-[36px] w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center text-lg shadow-sm">
                      🎯
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {activity.career || 'General Knowledge'}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="success" size="sm" className="font-mono text-xs">{(activity.score / activity.total * 100).toFixed(0)}%</Badge>
                        <span className="text-xs text-slate-400">2h ago</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-slate-400">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (Mock) */}
          <Card className="overflow-hidden border-0 shadow-xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

            <CardContent className="p-6 relative z-10 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-300" />
                </div>
                <h3 className="font-heading font-bold text-lg">Daily Challenge</h3>
              </div>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Complete a <span className="font-bold text-white">React Quiz</span> with &gt;80% score today to earn a <span className="underline decoration-yellow-400 decoration-2 underline-offset-2">50 XP Bonus</span>.
              </p>
              <Button
                className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold border-none shadow-lg"
                onClick={() => navigate('/quizzes')}
              >
                Start Challenge
              </Button>
            </CardContent>
          </Card>

        </motion.div>
      </div>
    </motion.div>
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
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
