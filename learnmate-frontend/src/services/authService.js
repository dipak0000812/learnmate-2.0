import api from './api';

const authService = {
  requestPasswordReset: (email) =>
    api.post('/api/auth/forgot-password', { email }),

  resetPassword: (token, password) =>
    api.post('/api/auth/reset-password', { token, password }),

  validateResetToken: (token) =>
    api.post('/api/auth/validate-reset-token', { token }),

  verifyEmail: (token) =>
    api.post('/api/auth/verify-email', { token }),

  resendVerificationEmail: () =>
    api.post('/api/auth/resend-verification')
};

export default authService;

