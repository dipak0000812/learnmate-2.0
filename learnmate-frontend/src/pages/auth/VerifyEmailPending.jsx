import React, { useState } from 'react';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';

const VerifyEmailPending = () => {
  const { user, logout } = useAuthStore();
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await authService.resendVerificationEmail();
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend verification email.';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 mb-2">
          We've sent a verification link to:
        </p>
        <p className="text-center font-semibold text-gray-900 mb-6">
          {user?.email}
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📧 Check your inbox and click the verification link to continue.
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Don't forget to check your spam folder!
          </p>
        </div>
        <button
          onClick={handleResendEmail}
          disabled={resending}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
        >
          <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
          {resending ? 'Sending...' : 'Resend Verification Email'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPending;


