import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import useAuthStore from './store/authStore';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import Dashboard from './pages/Dashboard';
import Quizzes from './pages/Quizzes';
import QuizTake from './pages/QuizTake';
import QuizResults from './pages/QuizResults';
import Roadmap from './pages/Roadmap';
import Careers from './pages/Careers';
import Profile from './pages/Profile';

// Layout
import MainLayout from './components/layout/MainLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Quizzes />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <QuizTake />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/results/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <QuizResults />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Roadmap />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/careers"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Careers />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Placeholder routes */}
        <Route path="/progress" element={<ProtectedRoute><MainLayout><div className="text-center p-8">Progress Page Coming Soon...</div></MainLayout></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><MainLayout><div className="text-center p-8">Achievements Page Coming Soon...</div></MainLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><MainLayout><div className="text-center p-8">Settings Page Coming Soon...</div></MainLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;