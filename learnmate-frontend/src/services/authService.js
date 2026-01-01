import api from './api';

const authService = {
  requestPasswordReset: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, password) =>
    api.post('/auth/reset-password', { token, password }),

  validateResetToken: (token) =>
    api.post('/auth/validate-reset-token', { token }),

  verifyEmail: (token) =>
    api.post('/auth/verify-email', { token }),

  resendVerificationEmail: () =>
    api.post('/auth/resend-verification')
};

export default authService;

