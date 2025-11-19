// src/pages/auth/OAuthCallback.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import oauthService from '../../services/oauthService';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get('token');
      const userData = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(error);
        
        // Close popup after 3 seconds
        setTimeout(() => {
          if (window.opener) {
            window.opener.postMessage(
              { success: false, error },
              window.location.origin
            );
            window.close();
          }
        }, 3000);
        return;
      }

      if (token && userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Send data back to parent window
          setTimeout(() => {
            oauthService.handleOAuthCallback(token, user);
          }, 1000);
        } catch (err) {
          setStatus('error');
          setMessage('Failed to process authentication data');
        }
      } else {
        setStatus('error');
        setMessage('Invalid authentication response');
      }
    };

    processCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center p-8">
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
              {message}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">
              Authentication Failed
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;