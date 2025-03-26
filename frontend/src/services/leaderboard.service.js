// src/services/leaderboard.service.js
import api from './api';

const getTopEarners = async (limit = 10) => {
  try {
    const response = await api.get(`/leaderboard/earnings?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch top earners' };
  }
};

const getTopSuccessRates = async (limit = 10, minSubmissions = 3) => {
  try {
    const response = await api.get(`/leaderboard/success-rate?limit=${limit}&minSubmissions=${minSubmissions}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch top success rates' };
  }
};

const getMyRank = async () => {
  try {
    const response = await api.get('/leaderboard/my-rank');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch your rank' };
  }
};

export const leaderboardService = {
  getTopEarners,
  getTopSuccessRates,
  getMyRank
};