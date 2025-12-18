import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Briefcase,
  User,
  Award,
  BarChart3,
  Settings,
  Trophy,
  Zap,
  Target
} from 'lucide-react';
import { cn } from '../../utils/cn';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, fetchUser } = useAuthStore();

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { name: 'Quizzes', path: '/quizzes', icon: BookOpen, color: 'text-teal-600' },
    { name: 'Roadmap', path: '/roadmap', icon: Map, color: 'text-emerald-600' },
    { name: 'Careers', path: '/careers', icon: Briefcase, color: 'text-blue-500' },
    { name: 'Progress', path: '/progress', icon: BarChart3, color: 'text-teal-500' },
    { name: 'Gamification', path: '/gamification', icon: Zap, color: 'text-yellow-500' },
    { name: 'Achievements', path: '/achievements', icon: Award, color: 'text-orange-500' },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, color: 'text-yellow-600' },
    { name: 'Profile', path: '/profile', icon: User, color: 'text-indigo-600' },
    { name: 'Settings', path: '/settings', icon: Settings, color: 'text-gray-600' },
  ];

  const isActive = (path) => location.pathname === path;

  // Level calculation (basic example: 1 level per 1000 XP)
  const level = user?.level || Math.floor((user?.totalPoints || 0) / 1000) + 1;
  const currentXP = user?.totalPoints || 0;
  const nextLevelXP = level * 1000;
  const progressPercent = ((currentXP % 1000) / 1000) * 100;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #0ea5e9, #14b8a6);
          border-radius: 3px;
        }
      `}} />

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-screen w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto custom-scrollbar">
          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg shadow-teal-500/50 scale-[1.02]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-[1.02]'
                  )}
                >
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-teal-400/20 animate-pulse" />
                  )}
                  <Icon className={cn('w-5 h-5 relative z-10', active ? 'text-white' : item.color)} />
                  <span className="font-medium relative z-10">{item.name}</span>
                  {active && (
                    <div className="absolute right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section - Quick Stats */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-teal-400/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Your Progress
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Level</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">{level}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{currentXP} / {nextLevelXP} XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;