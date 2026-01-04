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
      // SECURITY FIX: Read token from cookie, not URL
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };

      const deleteCookie = (name) => {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
      };

      const token = getCookie('oauth_otp');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Login failed (OAuth Error)');
        navigate('/login');
        return;
      }

      if (!token) {
        // Fallback: Check if token is still in URL (transition period or error modes)
        // But for strict security we prefer cookie.
        // Showing specific error helps debugging.
        toast.error('Secure login failed (Token Missing)');
        navigate('/login');
        return;
      }

      // Cleanup cookie immediately
      deleteCookie('oauth_otp');

      const result = await loginWithToken(token);
      if (result.success) {
        toast.success('Successfully logged in w/ Google! 🚀');
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