import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { toast } from 'sonner';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Login failed (OAuth Error)');
        navigate('/login');
        return;
      }

      if (!token) {
        toast.error('No token received');
        navigate('/login');
        return;
      }

      const result = await loginWithToken(token);
      if (result.success) {
        toast.success('Successfully logged in w/ Google! 🚀');
        // Check for onboarding
        // We can't access state easily here without async fetch, but loginWithToken fetches user.
        // Let's rely on Dashboard/ProtectedRoute redirect logic
        navigate('/dashboard');
      } else {
        toast.error('Session creation failed');
        navigate('/login');
      }
    };

    processCallback();
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Finalizing secure login...
        </h2>
      </div>
    </div>
  );
};

export default OAuthCallback;