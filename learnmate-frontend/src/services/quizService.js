import api from './api';

const quizService = {
  // Get all quizzes
  getAllQuizzes: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/questions?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get quiz by ID
  getQuizById: async (id) => {
    try {
      const response = await api.get(`/api/questions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit quiz answers
  submitQuiz: async (answers, timeTaken) => {
    try {
      const response = await api.post('/api/assessments/submit', {
        answers,
        timeTaken
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get quiz results
  getQuizResults: async (assessmentId) => {
    try {
      const response = await api.get(`/api/assessments/${assessmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's quiz history
  getQuizHistory: async () => {
    try {
      const response = await api.get('/api/assessments/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default quizService;