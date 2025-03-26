// src/services/profile.service.js
import api from './api';

const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// You could add update profile method here in the future if needed

export const profileService = {
  getUserProfile,
};