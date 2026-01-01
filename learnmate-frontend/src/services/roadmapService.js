import api from './api';

const roadmapService = {
  // Generate new roadmap
  generateRoadmap: async (dreamCareer, assessmentId = null) => {
    try {
      // Only send assessmentId if it exists (backend validation fails on null)
      const payload = { dreamCareer };

      if (assessmentId) {
        payload.assessmentId = assessmentId;
      }

      const response = await api.post('/roadmaps/generate', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get roadmap by ID
  getRoadmapById: async (id) => {
    try {
      const response = await api.get(`/roadmaps/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's roadmaps
  getUserRoadmaps: async (userId) => {
    try {
      const response = await api.get(`/roadmaps/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark goal as complete
  completeGoal: async (roadmapId, goalId) => {
    try {
      const response = await api.put(`/roadmaps/${roadmapId}/goals/${goalId}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default roadmapService;
