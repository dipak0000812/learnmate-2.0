import api from './api';

const gamificationService = {
    // Get user gamification stats (level, points, badges)
    getUserStats: async () => {
        try {
            const response = await api.get('/gamification/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get global leaderboard
    getLeaderboard: async () => {
        try {
            const response = await api.get('/gamification/leaderboard');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Purchase item (if needed later)
    purchaseItem: async (itemId, type, cost) => {
        try {
            const response = await api.post('/gamification/shop/purchase', { itemId, type, cost });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default gamificationService;
