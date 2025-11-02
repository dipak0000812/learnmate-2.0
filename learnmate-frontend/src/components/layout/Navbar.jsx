import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Moon, 
  Sun,
  Menu,
  X,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { toast } from 'sonner';
import Badge from '../ui/Badge';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-teal-500/50 transition-all group-hover:scale-110 relative">
                <GraduationCap className="w-6 h-6 text-white" />
                <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent hidden sm:block">
                LearnMate
              </span>
            </Link>
          </div>

          {/* Center - Quick Stats (Desktop only) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">3,450 pts</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-lg">
              <Zap className="w-4 h-4 text-teal-600 animate-pulse" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Level 7</span>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg relative">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                  {user?.name || 'User'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-20 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="primary" size="sm">Level 7</Badge>
                        <Badge variant="success" size="sm">🔥 12 days</Badge>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <hr className="my-2 border-gray-200 dark:border-gray-700" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;