import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Zap,
  Award,
  Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const Leaderboard = () => {
  const [timeRange, setTimeRange] = useState('all-time');
  const [category, setCategory] = useState('overall');

  // Mock leaderboard data
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const response = await import('../services/gamificationService').then(m => m.default.getLeaderboard());

        if (response.status === 'success') {
          // Map backend data to frontend structure
          const formattedData = response.data.map((user, index) => ({
            rank: index + 1,
            id: user._id,
            name: user.name,
            avatar: user.name.charAt(0).toUpperCase(), // persistent avatar URL usage if available
            points: user.totalPoints,
            quizzes: 0, // Backend doesn't send this yet, defaulting
            avgScore: 0,
            badges: user.badges?.length || 0,
            streak: 0,
            level: Math.floor(Math.sqrt(user.totalPoints / 100)) + 1,
            isCurrentUser: user._id === currentUser?._id
          }));

          setLeaderboardData(formattedData);

          // Find current user rank
          const myRank = formattedData.find(u => u.isCurrentUser);
          if (myRank) setUserRank(myRank);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-white" />;
      case 2: return <Medal className="w-6 h-6 text-white" />;
      case 3: return <Medal className="w-6 h-6 text-white" />;
      default: return <span className="text-white font-bold">{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Compete with learners worldwide
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTimeRange('all-time')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'all-time'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
          >
            This Week
          </button>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="overall">Overall</option>
          <option value="javascript">JavaScript</option>
          <option value="react">React</option>
          <option value="nodejs">Node.js</option>
          <option value="database">Database</option>
        </select>
      </div>

      {/* Top 3 Podium */}
      {loading ? (
        <div className="text-center py-10">Loading Leaderboard...</div>
      ) : leaderboardData.length < 3 ? (
        <div className="text-center py-10">Not enough players for a podium yet! Start playing to climb the ranks.</div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getRankColor(2)} flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-lg`}>
              {leaderboardData[1].avatar}
            </div>
            <Medal className="w-8 h-8 text-gray-400 mb-2" />
            <h3 className="font-bold text-gray-900 dark:text-white text-center">
              {leaderboardData[1].name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {leaderboardData[1].points.toLocaleString()} pts
            </p>
            <div className="mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">#2</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <Crown className="w-10 h-10 text-yellow-500 mb-2 animate-bounce" />
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRankColor(1)} flex items-center justify-center text-3xl font-bold text-white mb-3 shadow-xl border-4 border-yellow-300`}>
              {leaderboardData[0].avatar}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-center text-lg">
              {leaderboardData[0].name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {leaderboardData[0].points.toLocaleString()} pts
            </p>
            <div className="mt-2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full">
              <p className="text-xs font-bold text-white">#1 Champion</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getRankColor(3)} flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-lg`}>
              {leaderboardData[2].avatar}
            </div>
            <Medal className="w-8 h-8 text-orange-600 mb-2" />
            <h3 className="font-bold text-gray-900 dark:text-white text-center">
              {leaderboardData[2].name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {leaderboardData[2].points.toLocaleString()} pts
            </p>
            <div className="mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">#3</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            All Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboardData.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${user.isCurrentUser
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {/* Rank Badge */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(user.rank)} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {user.avatar}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {user.name}
                    {user.isCurrentUser && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">You</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Lvl {user.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {user.badges} badges
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {user.streak}d streak
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right hidden md:block">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {user.points.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">points</p>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-gray-900 dark:text-white">{user.avgScore}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">avg score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Stats Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Keep Climbing! 🚀
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're {leaderboardData[6].rank - 7} places away from top 10. Complete more quizzes to climb!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">+125</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">pts this week</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;