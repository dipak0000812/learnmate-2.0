import api from './api';

const careerService = {
  // Get career recommendations (fallback if AI endpoint doesn't exist)
  getRecommendations: async (userData) => {
    try {

      // Try the AI endpoint
      const response = await api.post('/ai/recommend-career', userData);
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
