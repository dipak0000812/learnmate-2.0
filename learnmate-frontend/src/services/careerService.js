import api from './api';

const careerService = {
  // Get career recommendations (fallback if AI endpoint doesn't exist)
  getRecommendations: async (userData) => {
    try {

      const response = await api.post('/ai/recommend-career', userData);
      if (response.data.status === 'accepted' && response.data.jobId) {
        // Poll for result
        let attempts = 0;
        while (attempts < 15) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const jobRes = await api.get(`/ai/jobs/${response.data.jobId}`);
          if (jobRes.data.jobStatus === 'completed') {
            return jobRes.data.data;
          } else if (jobRes.data.jobStatus === 'failed') {
            throw new Error('AI Job Failed');
          }
          attempts++;
        }
        throw new Error('AI Job Timeout');
      }
      return response.data;
    } catch (error) {
      // If 404, the AI endpoint doesn't exist yet
      if (error.response?.status === 404) {
        console.warn('⚠️ AI recommendation endpoint not available yet');
        throw new Error('AI_ENDPOINT_NOT_AVAILABLE');
      }
      throw error;
    }
  },

  // Get all careers
  getAllCareers: async () => {
    try {
      const response = await api.get('/careers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get career details
  getCareerDetails: async (careerId) => {
    try {
      const response = await api.get(`/careers/${careerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Compare careers
  compareCareers: async (careerIds) => {
    try {
      const response = await api.post('/careers/compare', { careerIds });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default careerService;
