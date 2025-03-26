// src/components/github/GithubSummaryModal.jsx (updated)
import { useState } from 'react';
import { FaSpinner, FaGithub, FaCode, FaCopy, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { githubService } from '../../services/github.service';

const GithubSummaryModal = ({ isOpen, onClose, onSummarySelect }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  
  if (!isOpen) return null;
  
  const handleUrlChange = (e) => {
    setGithubUrl(e.target.value);
    if (error) setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!githubUrl.trim() || !githubUrl.includes('github.com')) {
      setError('Please enter a valid GitHub URL');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await githubService.summarizeGitHubCode(githubUrl);
      setSummary(result);
    } catch (error) {
      console.error('Error summarizing GitHub code:', error);
      setError(error.message || 'Failed to summarize GitHub code');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary.summary);
      toast.success('Summary copied to clipboard');
    }
  };
  
  const handleUseThisSummary = () => {
    if (summary) {
      onSummarySelect(summary.summary);
      onClose();
      toast.success('Summary added to description');
    }
  };
  
  // Function to format summary with proper paragraphs and lists
  const formatSummary = (text) => {
    if (!text) return '';
    
    // Replace markdown-style lists with HTML lists
    let formattedText = text;
    
    // Process numbered lists (starting with 1., 2., etc.)
    if (formattedText.match(/\d+\.\s/g)) {
      const listItems = formattedText.split(/\n(?=\d+\.\s)/g);
      
      // Check if we actually have list items
      if (listItems.length > 1) {
        const listContent = listItems.map((item, index) => {
          // Remove the number prefix
          const content = item.replace(/^\d+\.\s/, '');
          return `<li key=${index} class="ml-5 list-decimal">${content}</li>`;
        }).join('');
        
        formattedText = `<ol class="mb-3 list-decimal pl-5">${listContent}</ol>`;
      }
    }
    
    // Process bullet point lists
    if (formattedText.includes('* ')) {
      const listItems = formattedText.split(/\n\*\s/g);
      
      // If we have actual list items (first item might not be a list item)
      if (listItems.length > 1) {
        // First part might be intro text
        const intro = listItems.shift();
        
        const listContent = listItems.map((item, index) => {
          return `<li key=${index} class="ml-5 list-disc">${item}</li>`;
        }).join('');
        
        formattedText = `${intro}<ul class="mb-3 list-disc pl-5">${listContent}</ul>`;
      }
    }
    
    // Handle bold text (enclosed in * or **)
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
    
    // Handle headings (lines starting with ## or **)
    formattedText = formattedText.replace(/^##\s(.+)$/gm, '<h3 class="font-bold text-white mb-2">$1</h3>');
    formattedText = formattedText.replace(/^\*\*(.+)\*\*$/gm, '<h3 class="font-bold text-white mb-2">$1</h3>');
    
    // Split by double newline to identify paragraphs and process each
    const paragraphs = formattedText.split(/\n\n+/);
    
    return (
      <div>
        {paragraphs.map((paragraph, index) => {
          // If paragraph contains HTML, render it as HTML
          if (paragraph.includes('<')) {
            return <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} className="mb-3" />;
          }
          // Otherwise render as a regular paragraph
          return <p key={index} className="mb-3">{paragraph}</p>;
        })}
      </div>
    );
  };
  
  // Close modal when clicking outside 
  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 overflow-y-auto"
      onClick={handleModalBackdropClick}
    >
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl border border-gray-700 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaGithub className="mr-2" /> GitHub Code Summarizer
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">
                Enter GitHub file URL:
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={githubUrl}
                  onChange={handleUrlChange}
                  placeholder="https://github.com/username/repo/blob/main/path/to/file.js"
                  className="input flex-1 rounded-r-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary rounded-l-none flex items-center"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Processing...
                    </>
                  ) : (
                    <>
                      <FaCode className="mr-2" /> Summarize
                    </>
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              <p className="text-gray-400 mt-2 text-sm">
                Paste a link to a specific file on GitHub. 
                Example: https://github.com/username/repository/blob/main/src/App.js
              </p>
            </div>
          </form>
          
          {summary && (
            <div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-white">
                    Summary of {summary.repoInfo.path}
                  </h3>
                  <div>
                    <button
                      onClick={handleCopyToClipboard}
                      className="btn btn-outline btn-sm flex items-center"
                    >
                      <FaCopy className="mr-1" /> Copy
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-3 rounded-md border border-gray-600 text-gray-200 max-h-72 overflow-y-auto">
                  {formatSummary(summary.summary)}
                </div>
                
                <div className="mt-3 text-sm text-gray-400">
                  <p>Repository: {summary.repoInfo.owner}/{summary.repoInfo.repo}</p>
                  <p>Language: {summary.language || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleUseThisSummary}
                  className="btn btn-primary"
                >
                  Use This Summary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GithubSummaryModal;