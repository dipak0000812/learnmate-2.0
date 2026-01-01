import React, { useState } from 'react';
import {
  User,
  Mail,
  Briefcase,
  Calendar,
  Award,
  Trophy,
  Target,
  BookOpen,
  Edit,
  Save,
  X,
  Camera,
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useAuthStore from '../store/authStore';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    bio: 'Passionate learner on a journey to become a Full Stack Developer',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    github: 'johndoe',
    linkedin: 'johndoe',
    careerGoal: 'Full Stack Developer'
  });

  // Fetch real user stats
  const [stats, setStats] = useState({
    totalPoints: 0,
    level: 1,
    quizzesCompleted: 0,
    totalQuizzes: 0,
    roadmapProgress: 0,
    streak: 0,
    badges: 0,
    joinDate: user?.createdAt || new Date().toISOString()
  });

  const [badges, setBadges] = useState([]);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // Import API dynamically to avoid circular dep if any (optional)
        const api = (await import('../services/api')).default;

        const [gamificationRes, roadmapRes] = await Promise.all([
          api.get('/gamification/me'),
          api.get('/roadmaps/my-roadmap').catch(() => ({ data: { data: null } })) // Handle no roadmap
        ]);

        const gData = gamificationRes.data.data;
        const rData = roadmapRes.data.data;

        setStats({
          totalPoints: gData.totalPoints || 0,
          level: gData.level || 1,
          quizzesCompleted: 0, // Backend doesn't send this yet, keep 0 or add endpoint
          totalQuizzes: 0,
          roadmapProgress: rData ? rData.progressPercent : 0,
          streak: gData.streakDays || 0,
          badges: gData.badges?.length || 0,
          joinDate: user?.createdAt || new Date().toISOString()
        });

        // Map badges names to UI objects
        // In a real app, we'd have a config for badge icons. 
        // For now, we'll just show the IDs/Names returned by backend
        setBadges(gData.badges?.map((b, i) => ({
          id: i, name: b, icon: '🏆', earned: true, date: 'Recently'
        })) || []);

      } catch (error) {
        console.error('Profile stats fetch error:', error);
      }
    };
    fetchStats();
  }, [user]);

  const recentActivity = [
    { id: 1, type: 'quiz', title: 'Completed React Basics Quiz', score: 85, date: '2 hours ago' },
    { id: 2, type: 'badge', title: 'Earned "Quick Learner" Badge', date: '1 day ago' },
    { id: 3, type: 'roadmap', title: 'Completed JavaScript Milestone', date: '2 days ago' },
    { id: 4, type: 'quiz', title: 'Started AI/ML Fundamentals', date: '3 days ago' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully! ✅');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john@example.com',
      bio: 'Passionate learner on a journey to become a Full Stack Developer',
      location: 'San Francisco, CA',
      website: 'https://johndoe.com',
      github: 'johndoe',
      linkedin: 'johndoe',
      careerGoal: 'Full Stack Developer'
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    Level {stats.level}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.totalPoints} XP
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-3xl font-bold mb-2"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formData.name}
                    </h1>
                  )}
                  {isEditing ? (
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {formData.email}
                    </p>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Bio */}
              <div className="mb-4">
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows="3"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {formData.bio}
                  </p>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Briefcase className="w-4 h-4" />
                  {isEditing ? (
                    <Input
                      name="careerGoal"
                      value={formData.careerGoal}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                  ) : (
                    <span>{formData.careerGoal}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                  ) : (
                    <span>{formData.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(stats.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Target className="w-4 h-4" />
                  <span>{stats.streak} day streak 🔥</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                {isEditing ? (
                  <>
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Website URL"
                      className="flex-1"
                    />
                    <Input
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="GitHub username"
                      className="flex-1"
                    />
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="LinkedIn username"
                      className="flex-1"
                    />
                  </>
                ) : (
                  <>
                    {formData.website && (
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </a>
                    )}
                    {formData.github && (
                      <a href={`https://github.com/${formData.github}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </a>
                    )}
                    {formData.linkedin && (
                      <a href={`https://linkedin.com/in/${formData.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPoints}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.quizzesCompleted}/{stats.totalQuizzes}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.roadmapProgress}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.badges}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Badges</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Achievements & Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-3 transition-all ${badge.earned
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-50'
                    }`}
                  title={badge.name}
                >
                  <span className="text-3xl mb-1">{badge.icon}</span>
                  <span className="text-[10px] text-center font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    {activity.type === 'quiz' && <BookOpen className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'badge' && <Award className="w-5 h-5 text-purple-600" />}
                    {activity.type === 'roadmap' && <Target className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.date}
                    </p>
                  </div>
                  {activity.score && (
                    <span className="text-sm font-semibold text-green-600">
                      {activity.score}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;