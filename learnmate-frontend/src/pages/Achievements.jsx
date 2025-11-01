import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Star,
  Zap,
  Target,
  Crown,
  Medal,
  Sparkles,
  Lock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const Achievements = () => {
  const [filter, setFilter] = useState('all');

  const badges = [
    {
      id: 1,
      name: 'Quick Learner',
      description: 'Complete 5 quizzes in one day',
      icon: '⚡',
      earned: true,
      earnedDate: '2024-02-10',
      rarity: 'common',
      points: 50
    },
    {
      id: 2,
      name: 'First Steps',
      description: 'Complete your first quiz',
      icon: '🎯',
      earned: true,
      earnedDate: '2024-01-15',
      rarity: 'common',
      points: 25
    },
    {
      id: 3,
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      earned: true,
      earnedDate: '2024-02-20',
      rarity: 'rare',
      points: 100
    },
    {
      id: 4,
      name: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: '💯',
      earned: true,
      earnedDate: '2024-02-15',
      rarity: 'rare',
      points: 150
    },
    {
      id: 5,
      name: 'JavaScript Master',
      description: 'Complete all JavaScript quizzes',
      icon: '💻',
      earned: true,
      earnedDate: '2024-03-01',
      rarity: 'epic',
      points: 200
    },
    {
      id: 6,
      name: 'Night Owl',
      description: 'Complete 10 quizzes after 10 PM',
      icon: '🦉',
      earned: true,
      earnedDate: '2024-02-25',
      rarity: 'rare',
      points: 100
    },
    {
      id: 7,
      name: 'Speed Demon',
      description: 'Complete a quiz in under 5 minutes',
      icon: '🚀',
      earned: true,
      earnedDate: '2024-02-18',
      rarity: 'epic',
      points: 175
    },
    {
      id: 8,
      name: 'Comeback Kid',
      description: 'Improve score by 30% on retake',
      icon: '📈',
      earned: true,
      earnedDate: '2024-03-05',
      rarity: 'rare',
      points: 125
    },
    {
      id: 9,
      name: 'Month Master',
      description: 'Maintain a 30-day streak',
      icon: '🌟',
      earned: false,
      rarity: 'legendary',
      points: 500,
      progress: 12,
      total: 30
    },
    {
      id: 10,
      name: 'Quiz Champion',
      description: 'Complete 100 quizzes',
      icon: '👑',
      earned: false,
      rarity: 'legendary',
      points: 1000,
      progress: 24,
      total: 100
    },
    {
      id: 11,
      name: 'Perfect Month',
      description: 'Score above 90% for 30 days',
      icon: '💎',
      earned: false,
      rarity: 'legendary',
      points: 750,
      progress: 8,
      total: 30
    },
    {
      id: 12,
      name: 'Knowledge Guru',
      description: 'Reach Level 20',
      icon: '🧠',
      earned: false,
      rarity: 'legendary',
      points: 2000,
      progress: 7,
      total: 20
    }
  ];

  const stats = {
    totalBadges: badges.length,
    earned: badges.filter(b => b.earned).length,
    totalPoints: badges.filter(b => b.earned).reduce((sum, b) => sum + b.points, 0),
    rareCount: badges.filter(b => b.earned && (b.rarity === 'rare' || b.rarity === 'epic' || b.rarity === 'legendary')).length
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 dark:border-gray-600';
      case 'rare': return 'border-blue-400 dark:border-blue-600';
      case 'epic': return 'border-purple-400 dark:border-purple-600';
      case 'legendary': return 'border-yellow-400 dark:border-orange-500';
      default: return 'border-gray-300 dark:border-gray-600';
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (filter === 'all') return true;
    if (filter === 'earned') return badge.earned;
    if (filter === 'locked') return !badge.earned;
    return badge.rarity === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Achievements & Badges
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Collect badges and unlock rewards as you learn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.earned}/{stats.totalBadges}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPoints}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Badge Points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rareCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rare Badges</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Crown className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round((stats.earned / stats.totalBadges) * 100)}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('earned')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'earned' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          Earned
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'locked' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          Locked
        </button>
        <button
          onClick={() => setFilter('legendary')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          Legendary
        </button>
        <button
          onClick={() => setFilter('epic')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'epic' ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          Epic
        </button>
        <button
          onClick={() => setFilter('rare')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'rare' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          Rare
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => (
          <Card key={badge.id} className={`border-2 ${getRarityBorder(badge.rarity)} ${!badge.earned && 'opacity-60'}`}>
            <CardContent className="p-4">
              <div className={`w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-4xl relative`}>
                {badge.earned ? (
                  badge.icon
                ) : (
                  <Lock className="w-10 h-10 text-white" />
                )}
                {badge.earned && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-center text-gray-900 dark:text-white mb-1">
                {badge.name}
              </h3>
              <p className="text-xs text-center text-gray-600 dark:text-gray-400 mb-2">
                {badge.description}
              </p>
              {badge.earned ? (
                <>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <Award className="w-3 h-3" />
                    {badge.points} points
                  </div>
                  <p className="text-xs text-center text-green-600 dark:text-green-400">
                    Earned on {badge.earnedDate}
                  </p>
                </>
              ) : badge.progress ? (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{badge.progress}/{badge.total}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getRarityColor(badge.rarity)}`}
                      style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Lock className="w-3 h-3" />
                  Locked
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Achievements;