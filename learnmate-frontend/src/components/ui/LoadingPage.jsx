import React from 'react';
import { GraduationCap, Loader } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
            <GraduationCap className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Loader className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Loading...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Preparing your learning experience
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;