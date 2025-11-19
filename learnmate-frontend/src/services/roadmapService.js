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

      console.log('🚀 Generating roadmap with payload:', payload);
      
      const response = await api.post('/api/roadmaps/generate', payload);
      
      console.log('✅ Roadmap generated successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Roadmap generation failed:', error.response?.data);
      throw error;
    }
  },

  // Get roadmap by ID
  getRoadmapById: async (id) => {
    try {
      console.log('📖 Fetching roadmap:', id);
      const response = await api.get(`/api/roadmaps/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching roadmap:', error);
      throw error;
    }
  },

  // Get user's roadmaps
  getUserRoadmaps: async (userId) => {
    try {
      console.log('📚 Fetching roadmaps for user:', userId);
      const response = await api.get(`/api/roadmaps/user/${userId}`);
      console.log('✅ User roadmaps loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user roadmaps:', error);
      throw error;
    }
  },

  // Mark goal as complete
  completeGoal: async (roadmapId, goalId) => {
    try {
      console.log('✓ Marking goal complete:', { roadmapId, goalId });
      const response = await api.put(`/api/roadmaps/${roadmapId}/goals/${goalId}/complete`);
      console.log('✅ Goal completed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error completing goal:', error);
      throw error;
    }
  }
};

export default roadmapService;