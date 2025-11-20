import React from 'react';
import { MailCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const VerifyEmailNotice = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
    <div className="w-full max-w-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <MailCheck className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verify your email</h1>
        <p className="text-gray-600 dark:text-gray-400">
          We sent you a verification link. Click the link in your inbox or copy the token into the verification form to activate your account.
        </p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <ShieldCheck className="w-5 h-5" />
              Security
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Verification protects your account and enables all LearnMate features.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              <Sparkles className="w-5 h-5" />
              Tips
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Didn’t get the email? Check spam or request another link from your profile.</p>
          </div>
        </div>
        <Link to="/verify-email" className="w-full">
          <Button className="w-full">Enter verification token</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default VerifyEmailNotice;

