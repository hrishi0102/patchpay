// src/services/github.service.js
import api from './api';

const summarizeGitHubCode = async (githubUrl) => {
  try {
    const response = await api.post('/github/summarize', { githubUrl });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to summarize GitHub code' };
  }
};

export const githubService = {
  summarizeGitHubCode,
};