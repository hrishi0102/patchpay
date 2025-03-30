// src/services/auth.service.js
import api from './api';

const register = async (name, email, password, role) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

const updateApiKey = async (apiKey) => {
  try {
    const response = await api.put('/auth/update-api-key', { apiKey });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update API key' };
  }
};

export const authService = {
  register,
  login,
  updateApiKey,
};