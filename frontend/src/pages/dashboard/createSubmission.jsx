// src/pages/dashboard/CreateSubmission.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaSave, FaTimes, FaGithub, FaCode, FaLightbulb, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import ResearcherLayout from '../../components/layout/ResearcherLayout';
import GithubSummaryModal from '../../components/github/GithubSummaryModal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateSubmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bugDetails, setBugDetails] = useState(null);
  const [loadingBugDetails, setLoadingBugDetails] = useState(true);
  const [formData, setFormData] = useState({
    bugId: '',
    fixDescription: '',
    proofOfFix: ''
  });
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  
  // Extract bugId from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bugId = params.get('bugId');
    
    if (bugId) {
      setFormData(prev => ({ ...prev, bugId }));
      
      // Fetch bug details to display
      const fetchBugDetails = async () => {
        try {
          setLoadingBugDetails(true);
          const response = await api.get(`/bugs/${bugId}`);
          setBugDetails(response.data);
        } catch (error) {
          console.error('Error fetching bug details:', error);
          toast.error('Failed to load bug details');
          navigate('/dashboard/researcher');
        } finally {
          setLoadingBugDetails(false);
        }
      };
      
      fetchBugDetails();
    } else {
      // If no bugId provided, redirect to bug listings
      navigate('/dashboard/researcher');
    }
  }, [location.search, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fixDescription.trim() || !formData.proofOfFix.trim()) {
      return toast.error('Please fill in all fields');
    }
    
    setLoading(true);
    
    try {
      await api.post('/submissions', formData);
      toast.success('Submission created successfully');
      navigate(`/dashboard/bugs/${formData.bugId}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create submission';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/dashboard/bugs/${formData.bugId}`);
  };
  
  const handleSummarySelect = (summary) => {
    // Append the summary to the existing description
    const updatedDescription = formData.fixDescription 
      ? `${formData.fixDescription}\n\n--- GitHub Code Summary ---\n${summary}`
      : `--- GitHub Code Summary ---\n${summary}`;
    
    setFormData(prev => ({ 
      ...prev, 
      fixDescription: updatedDescription 
    }));
  };
  
  const openGithubModal = () => {
    setIsGithubModalOpen(true);
  };
  
  const closeGithubModal = () => {
    setIsGithubModalOpen(false);
  };
  
  if (loadingBugDetails) {
    return (
      <ResearcherLayout>
        <div className="flex justify-center items-center py-20">
          <div className="loader"></div>
        </div>
      </ResearcherLayout>
    );
  }
  
  if (!bugDetails) {
    return (
      <ResearcherLayout>
        <div className="text-center py-12">
          <FaExclamationTriangle className="mx-auto text-4xl text-gray-500 mb-4" />
          <p className="text-xl text-gray-400">Failed to load bug details</p>
          <button 
            onClick={() => navigate('/dashboard/researcher')}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-white inline-flex items-center transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Bug Listings
          </button>
        </div>
      </ResearcherLayout>
    );
  }
  
  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-900/20 border-blue-800/50 text-blue-400';
      case 'medium':
        return 'bg-yellow-900/20 border-yellow-800/50 text-yellow-400';
      case 'high':
        return 'bg-orange-900/20 border-orange-800/50 text-orange-400';
      case 'critical':
        return 'bg-red-900/20 border-red-800/50 text-red-400';
      default:
        return 'bg-gray-900/20 border-gray-800/50 text-gray-400';
    }
  };
  
  return (
    <ResearcherLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Submit Bug Fix</h1>
        <button 
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 flex items-center transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Bug
        </button>
      </div>
      
      {/* Bug Details Card */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-white flex-grow">{bugDetails.title}</h2>
            <div className={`px-3 py-1 rounded-full ml-4 border ${getSeverityColor(bugDetails.severity)}`}>
              {bugDetails.severity.charAt(0).toUpperCase() + bugDetails.severity.slice(1)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Reward</span>
                <span className="text-xl font-bold text-emerald-400">${bugDetails.reward.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Status</span>
                <span className="text-white capitalize">{bugDetails.status}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg border border-gray-800 mb-4">
            <h3 className="text-md font-medium text-white mb-2">Description</h3>
            <p className="text-gray-300 whitespace-pre-line">{bugDetails.description}</p>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
            <h3 className="text-md font-medium text-white mb-2">Company</h3>
            <p className="text-white">{bugDetails.companyId?.name || 'Unknown'}</p>
            <p className="text-gray-400 text-sm">{bugDetails.companyId?.email || ''}</p>
          </div>
        </div>
      </div>
      
      {/* Submission Form Card */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Your Solution</h2>
          
          <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaLightbulb className="text-emerald-400 mt-1 mr-3" />
              <div>
                <p className="text-gray-300">
                  Provide a detailed description of your fix and include a link to your proof (e.g., a GitHub PR, code snippet, or detailed explanation).
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  A well-documented submission increases your chances of approval and payment.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="proofOfFix" className="block text-sm font-medium text-gray-300 mb-2">
                Proof of Fix *
              </label>
              <div className="flex">
                <input
                  id="proofOfFix"
                  name="proofOfFix"
                  type="text"
                  required
                  className="flex-1 w-full px-4 py-2 bg-black/50 rounded-l-md border border-gray-700
                            text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                            focus:ring-emerald-500 focus:border-transparent"
                  value={formData.proofOfFix}
                  onChange={handleChange}
                  placeholder="GitHub PR link, CodeSandbox, or any verifiable proof of your solution"
                />
                <button
                  type="button"
                  onClick={openGithubModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-r-md inline-flex items-center transition-colors"
                >
                  <FaGithub className="mr-2" /> Summarize Code
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Provide a link to a GitHub PR, Gist, CodeSandbox, or any other evidence that demonstrates your fix works.
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="fixDescription" className="block text-sm font-medium text-gray-300">
                  Fix Description *
                </label>
                <button
                  type="button"
                  onClick={openGithubModal}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center text-sm"
                >
                  <FaCode className="mr-1" /> Generate GitHub Code Summary
                </button>
              </div>
              <textarea
                id="fixDescription"
                name="fixDescription"
                rows="10"
                required
                className="w-full px-4 py-2 bg-black/50 rounded-md border border-gray-700
                          text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                          focus:ring-emerald-500 focus:border-transparent"
                value={formData.fixDescription}
                onChange={handleChange}
                placeholder="Describe your approach to fixing this bug in detail. Include your methodology and why your solution works. Use the 'Summarize Code' button to automatically analyze and summarize your GitHub code."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 flex items-center transition-colors"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="mr-2" /> {loading ? 'Submitting...' : 'Submit Fix'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* GitHub Summary Modal */}
      <GithubSummaryModal 
        isOpen={isGithubModalOpen} 
        onClose={closeGithubModal} 
        onSummarySelect={handleSummarySelect} 
      />
    </ResearcherLayout>
  );
};

export default CreateSubmission;