import api from './api';

const careerService = {
  // Get career recommendations (fallback if AI endpoint doesn't exist)
  getRecommendations: async (userData) => {
    try {
      console.log('🤖 Requesting AI career recommendations:', userData);
      
      // Try the AI endpoint
      const response = await api.post('/api/ai/recommend-career', userData);
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
      const response = await api.get('/api/careers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get career details
  getCareerDetails: async (careerId) => {
    try {
      const response = await api.get(`/api/careers/${careerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Compare careers
  compareCareers: async (careerIds) => {
    try {
      const response = await api.post('/api/careers/compare', { careerIds });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default careerService;