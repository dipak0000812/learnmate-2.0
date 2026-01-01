import React, { useState } from 'react';
import {
  Trophy,
  Star,
  Zap,
  Award,
  Target,
  TrendingUp,
  Gift,
  Crown,
  Flame,
  Medal,
  Coins,
  Lock,
  BookOpen,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Modal from '../components/ui/Modal';
import { toast } from 'sonner';

const Gamification = () => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real gamification data
  React.useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const response = await import('../services/api').then(module => module.default.get('/gamification/me'));
        setUserData({
          ...response.data.data,
          currentXP: response.data.data.xpCurrent,
          nextLevelXP: response.data.data.xpNextLevel,
          rank: 'Bronze', // Compute rank logic later
          coins: response.data.data.coins || 0,
          gems: response.data.data.gems || 0,
          streak: response.data.data.streakDays || 0
        });
      } catch (error) {
        console.error('Failed to fetch gamification stats:', error);
        toast.error('Could not load your progress');
      } finally {
        setLoading(false);
      }
    };
    fetchGamificationData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading your achievements...</div>;
  }

  if (!userData) return null;

  // Daily challenges
  const dailyChallenges = [
    {
      id: 1,
      title: 'Complete 3 Quizzes',
      description: 'Take and complete 3 different quizzes today',
      progress: 2,
      total: 3,
      reward: { coins: 50, xp: 100 },
      icon: BookOpen,
      color: 'from-blue-500 to-teal-500'
    },
    {
      id: 2,
      title: 'Score Above 80%',
      description: 'Get a score of 80% or higher on any quiz',
      progress: 1,
      total: 1,
      reward: { coins: 75, xp: 150 },
      icon: Target,
      color: 'from-teal-500 to-emerald-500',
      completed: true
    },
    {
      id: 3,
      title: 'Learn for 30 Minutes',
      description: 'Spend at least 30 minutes learning today',
      progress: 22,
      total: 30,
      reward: { coins: 40, xp: 80 },
      icon: Clock,
      color: 'from-emerald-500 to-green-500'
    },
    {
      id: 4,
      title: 'Maintain Your Streak',
      description: 'Log in and complete at least one activity',
      progress: 1,
      total: 1,
      reward: { coins: 30, xp: 50 },
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      completed: true
    }
  ];

  // Weekly challenges
  const weeklyChallenges = [
    {
      id: 1,
      title: 'Quiz Master',
      description: 'Complete 15 quizzes this week',
      progress: 8,
      total: 15,
      reward: { coins: 200, xp: 500, gems: 5 },
      icon: Trophy,
      color: 'from-blue-600 to-teal-600'
    },
    {
      id: 2,
      title: 'Perfect Week',
      description: 'Maintain a 7-day learning streak',
      progress: 5,
      total: 7,
      reward: { coins: 300, xp: 750, gems: 10 },
      icon: Star,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 3,
      title: 'Topic Explorer',
      description: 'Complete quizzes in 5 different topics',
      progress: 3,
      total: 5,
      reward: { coins: 150, xp: 400, gems: 3 },
      icon: Target,
      color: 'from-teal-600 to-emerald-600'
    }
  ];

  // Rewards store
  const rewards = [
    {
      id: 1,
      name: 'Profile Frame - Gold',
      description: 'Exclusive golden profile frame',
      cost: { coins: 500 },
      icon: '🖼️',
      rarity: 'rare',
      owned: false
    },
    {
      id: 2,
      name: 'XP Boost - 2x',
      description: '2x XP for 24 hours',
      cost: { coins: 300 },
      icon: '⚡',
      rarity: 'common',
      owned: false
    },
    {
      id: 3,
      name: 'Quiz Hints Pack',
      description: '5 hints to use in quizzes',
      cost: { coins: 200 },
      icon: '💡',
      rarity: 'common',
      owned: false
    },
    {
      id: 4,
      name: 'Profile Badge - Legend',
      description: 'Show off your legendary status',
      cost: { gems: 25 },
      icon: '👑',
      rarity: 'legendary',
      owned: false
    },
    {
      id: 5,
      name: 'Custom Theme',
      description: 'Unlock exclusive color themes',
      cost: { gems: 50 },
      icon: '🎨',
      rarity: 'epic',
      owned: false
    },
    {
      id: 6,
      name: 'Skip Waiting Time',
      description: 'Remove quiz cooldowns for 7 days',
      cost: { gems: 30 },
      icon: '⏩',
      rarity: 'rare',
      owned: false
    }
  ];

  // Achievements
  const achievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your first quiz',
      icon: '🎯',
      unlocked: true,
      progress: 1,
      total: 1
    },
    {
      id: 2,
      name: 'Quiz Apprentice',
      description: 'Complete 10 quizzes',
      icon: '📚',
      unlocked: true,
      progress: 10,
      total: 10
    },
    {
      id: 3,
      name: 'Quiz Master',
      description: 'Complete 50 quizzes',
      icon: '🏆',
      unlocked: false,
      progress: 24,
      total: 50
    },
    {
      id: 4,
      name: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: '💯',
      unlocked: true,
      progress: 1,
      total: 1
    },
    {
      id: 5,
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: true,
      progress: 7,
      total: 7
    },
    {
      id: 6,
      name: 'Month Master',
      description: 'Maintain a 30-day streak',
      icon: '⭐',
      unlocked: false,
      progress: 12,
      total: 30
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-teal-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const handlePurchase = (reward) => {
    setSelectedReward(reward);
    setShowRewardModal(true);
  };

  const confirmPurchase = async () => {
    try {
      if (!selectedReward) return;

      const response = await import('../services/api').then(module => module.default.post('/gamification/purchase', {
        itemId: selectedReward.id,
        cost: selectedReward.cost,
        type: 'reward'
      }));

      if (response.data.status === 'success') {
        toast.success(`🎉 You purchased ${selectedReward.name}!`);
        // Update local state
        setUserData(prev => ({
          ...prev,
          coins: response.data.data.coins,
          gems: response.data.data.gems
        }));
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error(error.response?.data?.message || 'Purchase failed');
    } finally {
      setShowRewardModal(false);
      setSelectedReward(null);
    }
  };

  const claimChallenge = (challenge) => {
    if (challenge.completed) {
      toast.success(`🎁 Claimed ${challenge.reward.coins} coins and ${challenge.reward.xp} XP!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gamification Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Complete challenges, earn rewards, and level up!
        </p>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Level Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-teal-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-8 h-8" />
              <Badge variant="gradient" className="bg-white/20 text-white">
                Level {userData.level}
              </Badge>
            </div>
            <p className="text-sm opacity-90 mb-2">Progress to Level {userData.level + 1}</p>
            <ProgressBar
              value={userData.currentXP}
              max={userData.nextLevelXP}
              variant="success"
              className="mb-2"
            />
            <p className="text-xs opacity-75">{userData.currentXP} / {userData.nextLevelXP} XP</p>
          </CardContent>
        </Card>

        {/* Coins Card */}
        <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Coins className="w-8 h-8" />
              <Trophy className="w-6 h-6 opacity-50" />
            </div>
            <p className="text-3xl font-bold mb-1">{userData.coins}</p>
            <p className="text-sm opacity-90">Coins</p>
          </CardContent>
        </Card>

        {/* Gems Card */}
        <Card className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">💎</span>
              <Zap className="w-6 h-6 opacity-50" />
            </div>
            <p className="text-3xl font-bold mb-1">{userData.gems}</p>
            <p className="text-sm opacity-90">Premium Gems</p>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-8 h-8 animate-pulse" />
              <Medal className="w-6 h-6 opacity-50" />
            </div>
            <p className="text-3xl font-bold mb-1">{userData.streak} Days</p>
            <p className="text-sm opacity-90">Current Streak 🔥</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Daily Challenges
            <Badge variant="primary" size="sm">Resets in 8h</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyChallenges.map((challenge) => {
              const Icon = challenge.icon;
              const progress = (challenge.progress / challenge.total) * 100;

              return (
                <div
                  key={challenge.id}
                  className={`relative p-4 rounded-xl border-2 ${challenge.completed
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${challenge.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {challenge.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {challenge.description}
                      </p>

                      {challenge.completed ? (
                        <button
                          onClick={() => claimChallenge(challenge)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Gift className="w-4 h-4" />
                          Claim Reward
                        </button>
                      ) : (
                        <>
                          <ProgressBar
                            value={challenge.progress}
                            max={challenge.total}
                            size="sm"
                            className="mb-2"
                          />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                              {challenge.progress}/{challenge.total}
                            </span>
                            <span className="font-medium text-teal-600">
                              +{challenge.reward.coins} 🪙 +{challenge.reward.xp} XP
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {challenge.completed && (
                    <div className="absolute top-2 right-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-teal-600" />
            Weekly Challenges
            <Badge variant="success" size="sm">Resets in 3d</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyChallenges.map((challenge) => {
              const Icon = challenge.icon;
              const progress = (challenge.progress / challenge.total) * 100;

              return (
                <div
                  key={challenge.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${challenge.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                          {challenge.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-yellow-600">
                            🪙 {challenge.reward.coins}
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            ⚡ {challenge.reward.xp}
                          </span>
                          {challenge.reward.gems && (
                            <span className="text-sm font-medium text-teal-600">
                              💎 {challenge.reward.gems}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {challenge.description}
                      </p>
                      <ProgressBar
                        value={challenge.progress}
                        max={challenge.total}
                        showLabel
                        className="mb-2"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {challenge.progress} / {challenge.total} completed
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rewards Store */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-600" />
            Rewards Store
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all hover:shadow-lg"
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{reward.icon}</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    {reward.name}
                  </h4>
                  <Badge variant="primary" size="sm" className={getRarityColor(reward.rarity)}>
                    {reward.rarity}
                  </Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-400 my-3">
                    {reward.description}
                  </p>
                  <button
                    onClick={() => handlePurchase(reward)}
                    disabled={reward.owned}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${reward.owned
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white'
                      }`}
                  >
                    {reward.owned ? (
                      'Owned'
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {reward.cost.coins && `🪙 ${reward.cost.coins}`}
                        {reward.cost.gems && `💎 ${reward.cost.gems}`}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl text-center transition-all ${achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-400'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-60'
                  }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {achievement.name}
                </p>
                {!achievement.unlocked && (
                  <div className="mt-2">
                    <Lock className="w-4 h-4 mx-auto text-gray-400" />
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.progress}/{achievement.total}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Purchase Confirmation Modal */}
      {selectedReward && (
        <Modal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          title="Confirm Purchase"
          size="sm"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">{selectedReward.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedReward.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedReward.description}
            </p>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedReward.cost.coins && `🪙 ${selectedReward.cost.coins} Coins`}
                {selectedReward.cost.gems && `💎 ${selectedReward.cost.gems} Gems`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRewardModal(false)}
                className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-emerald-700 transition-colors"
              >
                Purchase
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Gamification;