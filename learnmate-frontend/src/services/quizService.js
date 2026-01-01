import api from './api';

const quizService = {
  // Get all quizzes
  getAllQuizzes: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/questions?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get quiz by ID
  getQuizById: async (id) => {
    try {
      const response = await api.get(`/questions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit quiz answers
  submitQuiz: async (answers, timeTaken) => {
    try {
      const response = await api.post('/assessments/submit', {
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
      const response = await api.get(`/assessments/${assessmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's quiz history
  getQuizHistory: async () => {
    try {
      const response = await api.get('/assessments/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default quizService;
