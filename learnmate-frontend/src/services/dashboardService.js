import api from './api';

const dashboardService = {
  // Get user's gamification stats (points, level, streak, badges)
  getGamificationStats: async () => {
    try {
      const response = await api.get('/gamification/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch gamification stats:', error);
      throw error;
    }
  },

  // Get user's personalized roadmap
  getMyRoadmap: async () => {
    try {
      const response = await api.get('/roadmaps/my-roadmap');
      return response.data;
    } catch (error) {
      // 404 is expected if user hasn't completed onboarding
      if (error.response?.status === 404) {
        return { status: 'fail', data: null };
      }
      console.error('Failed to fetch roadmap:', error);
      throw error;
    }
  },

  // Get assessment history
  getAssessmentHistory: async (limit = 5) => {
    try {
      const response = await api.get(`/assessments/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch assessment history:', error);
      throw error;
    }
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    try {
      const response = await api.get(`/gamification/leaderboard?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      throw error;
    }
  }
};

export default dashboardService;

