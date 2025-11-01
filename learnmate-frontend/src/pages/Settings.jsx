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
  Eye,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/input';
import { toast } from 'sonner';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    quizReminders: true,
    achievementAlerts: true,
    weeklyReport: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showProgress: true,
    showBadges: true,
    allowMessages: false,
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
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
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
            <Input type="email" placeholder="your@email.com" defaultValue="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <Input type="text" placeholder="username" defaultValue="johndoe" />
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
              Password
            </label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
            <Button variant="outline" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Enable
            </Button>
          </div>
          <Button onClick={handleSave}>Update Security</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize text-gray-700 dark:text-gray-300">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <input
                type="checkbox"
                checked={value}
                onChange={() =>
                  setNotifications({ ...notifications, [key]: !notifications[key] })
                }
                className="w-5 h-5 accent-blue-600"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize text-gray-700 dark:text-gray-300">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <input
                type="checkbox"
                checked={value}
                onChange={() => setPrivacy({ ...privacy, [key]: !privacy[key] })}
                className="w-5 h-5 accent-purple-600"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-600" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <Button onClick={toggleDarkMode} variant="outline" className="flex items-center gap-2">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save All */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-6 py-2">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
