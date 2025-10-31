import api from './api';

const careerService = {
  // Get career recommendations
  getRecommendations: async (userData) => {
    try {
      const response = await api.post('/ai/recommend-career', userData);
      return response.data;
    } catch (error) {
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