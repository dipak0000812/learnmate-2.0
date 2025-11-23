import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import useAuthStore from './store/authStore';
import tokenService from './services/tokenService';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import OAuthCallback from './pages/auth/OAuthCallback';
import VerifyEmail from './pages/auth/VerifyEmail';
import VerifyEmailNotice from './pages/auth/VerifyEmailNotice';
import VerifyEmailPending from './pages/auth/VerifyEmailPending';

// Main Pages
import Dashboard from './pages/Dashboard';
import Quizzes from './pages/Quizzes';
import QuizTake from './pages/QuizTake';
import QuizResults from './pages/QuizResults';
import Roadmap from './pages/Roadmap';
import Careers from './pages/Careers';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Gamification from './pages/Gamification';
import Leaderboard from './pages/Leaderboard';

// Onboarding & Assessment
import Onboarding from './pages/Onboarding';
import InitialAssessment from './pages/assessment/InitialAssessment';
import AssessmentResults from './pages/assessment/AssessmentResults';

// Layout
import MainLayout from './components/layout/MainLayout';

// Protected Route with email/onboarding guards
const ProtectedRoute = ({ children, requireEmailVerified = true, requireOnboarding = true }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerified && !user?.emailVerified) {
    return <Navigate to="/verify-email-notice" replace />;
  }

  if (requireOnboarding && user?.emailVerified && !user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  // 🔐 Auto Token Refresh
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      tokenService.initTokenRefresh();
    }

    return () => {
      tokenService.stopTokenRefresh();
    };
  }, []);

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route 
          path="/login" 
          element={
            <PublicRoute><Login /></PublicRoute>
          } 
        />

        <Route 
          path="/register" 
          element={
            <PublicRoute><Register /></PublicRoute>
          } 
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* 📩 Newly Added Email Verification Routes */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/verify-email-notice"
          element={
            <ProtectedRoute requireEmailVerified={false} requireOnboarding={false}>
              <VerifyEmailPending />
            </ProtectedRoute>
          }
        />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Assessment */}
        <Route
          path="/assessment/initial"
          element={
            <ProtectedRoute>
              <InitialAssessment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessment/results"
          element={
            <ProtectedRoute>
              <AssessmentResults />
            </ProtectedRoute>
          }
        />

        {/* Protected Main Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <MainLayout><Quizzes /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <MainLayout><QuizTake /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/results/:id"
          element={
            <ProtectedRoute>
              <MainLayout><QuizResults /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <MainLayout><Roadmap /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/careers"
          element={
            <ProtectedRoute>
              <MainLayout><Careers /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout><Profile /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <MainLayout><Progress /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <MainLayout><Achievements /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout><Settings /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/gamification"
          element={
            <ProtectedRoute>
              <MainLayout><Gamification /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <MainLayout><Leaderboard /></MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
