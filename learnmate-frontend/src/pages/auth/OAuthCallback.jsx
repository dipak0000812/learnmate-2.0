import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { toast } from 'sonner';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuthCode } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Login failed (OAuth Error)');
        navigate('/login');
        return;
      }

      if (!code) {
        toast.error('Secure login failed (Authorization Code Missing)');
        navigate('/login');
        return;
      }

      const result = await loginWithOAuthCode(code);
      if (result.success) {
        toast.success('Successfully logged in! 🚀');
        navigate('/dashboard');
      } else {
        toast.error('Session creation failed');
        navigate('/login');
      }
    };

    processCallback();
  }, [searchParams, navigate, loginWithOAuthCode]);

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