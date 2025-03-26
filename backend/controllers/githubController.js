// controllers/githubController.js
const { processGitHubUrl } = require('../utils/githubService');

// @desc    Generate summary from GitHub URL
// @route   POST /api/github/summarize
// @access  Private/Researcher
const summarizeGitHubCode = async (req, res) => {
  try {
    const { githubUrl } = req.body;
    
    if (!githubUrl) {
      return res.status(400).json({ message: 'GitHub URL is required' });
    }
    
    // Process GitHub URL and generate summary
    const result = await processGitHubUrl(githubUrl);
    
    res.json({
      repoInfo: result.repoInfo,
      language: result.language,
      summary: result.summary
    });
  } catch (error) {
    console.error('Summarize GitHub code error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to summarize GitHub code',
      error: error.message 
    });
  }
};

module.exports = {
  summarizeGitHubCode
};