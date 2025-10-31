import api from './api';

const roadmapService = {
  // Generate new roadmap
  generateRoadmap: async (dreamCareer, assessmentId = null) => {
    try {
      const response = await api.post('/api/roadmaps/generate', {
        dreamCareer,
        assessmentId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get roadmap by ID
  getRoadmapById: async (id) => {
    try {
      const response = await api.get(`/api/roadmaps/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's roadmaps
  getUserRoadmaps: async (userId) => {
    try {
      const response = await api.get(`/api/roadmaps/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark goal as complete
  completeGoal: async (roadmapId, goalId) => {
    try {
      const response = await api.put(`/api/roadmaps/${roadmapId}/goals/${goalId}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default roadmapService;