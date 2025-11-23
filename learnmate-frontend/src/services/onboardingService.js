import api from './api';

const onboardingService = {
  getProgress: () => api.get('/api/onboarding/progress'),
  saveStep: (step, data) => api.post('/api/onboarding/save-step', { step, data }),
  complete: () => api.post('/api/onboarding/complete')
};

export default onboardingService;

