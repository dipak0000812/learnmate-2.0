import api from './api';

const onboardingService = {
  getProgress: () => api.get('/onboarding/progress'),
  saveStep: (step, data) => api.post('/onboarding/save-step', { step, data }),
  complete: () => api.post('/onboarding/complete')
};

export default onboardingService;

