// utils/githubService.js
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini API with the new structure
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Parse GitHub URL to extract owner, repo, and file path
const parseGitHubUrl = (url) => {
  try {
    // Remove any query parameters or hash
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // Match GitHub URL pattern
    const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)\/blob\/[^\/]+\/(.+)/;
    const match = cleanUrl.match(githubRegex);
    
    if (!match) {
      throw new Error('Invalid GitHub URL format');
    }
    
    return {
      owner: match[1],
      repo: match[2],
      path: match[3]
    };
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    throw new Error('Failed to parse GitHub URL');
  }
};

// Fetch code content from GitHub
const fetchCodeFromGitHub = async (owner, repo, path) => {
  try {
    // GitHub API URL for raw content
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    // Make request to GitHub API
    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        // Add GitHub token if available
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching code from GitHub:', error);
    throw new Error('Failed to fetch code from GitHub');
  }
};

// Generate code summary using Gemini (Updated to new API structure)
const generateCodeSummary = async (code, language, repoInfo) => {
  try {
    const prompt = `
    Analyze and summarize the following code from a GitHub repository:
    
    Repository: ${repoInfo.owner}/${repoInfo.repo}
    File: ${repoInfo.path}
    Language: ${language || 'Unknown'}
    
    Code:
    \`\`\`
    ${code}
    \`\`\`
    
    Please provide a concise summary that includes:
    1. What the code does
    2. Key functions or classes
    3. How it addresses a bug or vulnerability
    4. Any dependencies or important context
    
    Keep the summary clear and under 400 words, focusing on how this code fixes a potential bug.
    `;
    
    // Using the new API structure to generate content
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error('Error generating code summary:', error);
    throw new Error('Failed to generate code summary');
  }
};

// Determine language from file extension
const getLanguageFromPath = (path) => {
  const extension = path.split('.').pop().toLowerCase();
  
  const languageMap = {
    'js': 'JavaScript',
    'jsx': 'React JSX',
    'ts': 'TypeScript',
    'tsx': 'React TypeScript',
    'py': 'Python',
    'java': 'Java',
    'rb': 'Ruby',
    'php': 'PHP',
    'go': 'Go',
    'rs': 'Rust',
    'c': 'C',
    'cpp': 'C++',
    'cs': 'C#',
    'html': 'HTML',
    'css': 'CSS',
    'json': 'JSON',
    'md': 'Markdown'
  };
  
  return languageMap[extension] || null;
};

// Main function to process GitHub URL and return summary
const processGitHubUrl = async (url) => {
  try {
    // Parse GitHub URL
    const repoInfo = parseGitHubUrl(url);
    
    // Fetch code from GitHub
    const code = await fetchCodeFromGitHub(repoInfo.owner, repoInfo.repo, repoInfo.path);
    
    // Determine language from file extension
    const language = getLanguageFromPath(repoInfo.path);
    
    // Generate summary
    const summary = await generateCodeSummary(code, language, repoInfo);
    
    return {
      repoInfo,
      language,
      summary
    };
  } catch (error) {
    console.error('Error processing GitHub URL:', error);
    throw error;
  }
};

module.exports = {
  parseGitHubUrl,
  fetchCodeFromGitHub,
  generateCodeSummary,
  processGitHubUrl
};