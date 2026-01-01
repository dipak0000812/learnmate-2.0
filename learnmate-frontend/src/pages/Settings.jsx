import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Lock,
  Smartphone,
  Moon,
  Sun,
  Volume2,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toast } from 'sonner';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    quizReminders: true,
    achievementAlerts: true,
    weeklyReport: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showProgress: true,
    showBadges: true,
    allowMessages: false
  });

  const handleSave = () => {
    toast.success('Settings saved successfully! ✅');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast.success(darkMode ? 'Light mode enabled ☀️' : 'Dark mode enabled 🌙');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              defaultValue="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <Input
              type="text"
              placeholder="username"
              defaultValue="johndoe"
            />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button onClick={handleSave}>Update Password</Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-blue-600" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toggle dark theme
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-7 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              icon: Mail,
              label: 'Email Notifications',
              desc: 'Receive email updates',
              key: 'email'
            },
            {
              icon: Smartphone,
              label: 'Push Notifications',
              desc: 'Browser notifications',
              key: 'push'
            },
            {
              icon: Bell,
              label: 'Quiz Reminders',
              desc: 'Daily quiz reminders',
              key: 'quizReminders'
            },
            {
              icon: Volume2,
              label: 'Achievement Alerts',
              desc: 'Badge unlock notifications',
              key: 'achievementAlerts'
            },
            {
              icon: Mail,
              label: 'Weekly Report',
              desc: 'Weekly progress summary',
              key: 'weeklyReport'
            }
          ].map(({ icon: Icon, label, desc, key }) => (
            <div
              key={key}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {desc}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [key]: !notifications[key]
                  })
                }
                className={`relative w-14 h-7 rounded-full transition-colors ${notifications[key] ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${notifications[key] ? 'translate-x-7' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-600" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              label: 'Public Profile',
              desc: 'Make your profile visible to others',
              key: 'profileVisible'
            },
            {
              label: 'Show Progress',
              desc: 'Display your learning progress',
              key: 'showProgress'
            },
            {
              label: 'Show Badges',
              desc: 'Display earned badges',
              key: 'showBadges'
            },
            {
              label: 'Allow Messages',
              desc: 'Let others send you messages',
              key: 'allowMessages'
            }
          ].map(({ label, desc, key }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {desc}
                </p>
              </div>
              <button
                onClick={() =>
                  setPrivacy({
                    ...privacy,
                    [key]: !privacy[key]
                  })
                }
                className={`relative w-14 h-7 rounded-full transition-colors ${privacy[key] ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${privacy[key] ? 'translate-x-7' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Shield className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h3 className="font-semibold text-red-900 dark:text-red-400 mb-2">
              Delete Account
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button variant="danger">Delete My Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
