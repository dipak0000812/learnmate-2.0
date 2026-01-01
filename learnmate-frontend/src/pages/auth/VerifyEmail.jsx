import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import authService from '../../services/authService';
import { toast } from 'sonner';

const schema = z.object({
  token: z.string().min(6, 'Verification token is required')
});

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || '';
  const [status, setStatus] = useState('idle'); // idle | success | error

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { token: initialToken }
  });

  // Completely public verification → no redirects blocking this page
  useEffect(() => {
    // Make sure user is treated as NOT logged in to prevent ProtectedRoute redirects
    localStorage.removeItem("token");
  }, []);

  const verify = useCallback(
    async (data) => {
      setStatus('idle');
      try {
        await authService.verifyEmail(data.token);

        setStatus('success');
        toast.success('Email verified successfully! Redirecting to login...');

        // Redirect to login after success
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);

      } catch (error) {
        const message = error.response?.data?.message || 'Verification failed. Please try again.';
        setStatus('error');
        toast.error(message);
      }
    },
    []
  );

  // Auto-verify when token is present in URL
  useEffect(() => {
    if (initialToken) {
      setValue('token', initialToken);
      verify({ token: initialToken });
    }
  }, [initialToken, setValue, verify]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">

        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Verification
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            If your verification didn’t start automatically, paste the token here:
          </p>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              <CheckCircle className="w-5 h-5" /> Verified successfully!
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-500 font-semibold">
              <AlertCircle className="w-5 h-5" /> Verification failed. Try again.
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(verify)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verification Token
            </label>

            <Input
              {...register('token')}
              placeholder="e.g. a1b2c3d4"
              error={errors.token?.message}
            />
          </div>

          <Button type="submit" className="w-full text-center">
            Verify Email
          </Button>
        </form>

      </div>
    </div>
  );
};

export default VerifyEmail;
