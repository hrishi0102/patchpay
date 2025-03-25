// src/pages/dashboard/CreateSubmission.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaSave, FaTimes } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateSubmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bugDetails, setBugDetails] = useState(null);
  const [formData, setFormData] = useState({
    bugId: '',
    fixDescription: '',
    proofOfFix: ''
  });
  
  // Extract bugId from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bugId = params.get('bugId');
    
    if (bugId) {
      setFormData(prev => ({ ...prev, bugId }));
      
      // Fetch bug details to display
      const fetchBugDetails = async () => {
        try {
          const response = await api.get(`/bugs/${bugId}`);
          setBugDetails(response.data);
        } catch (error) {
          console.error('Error fetching bug details:', error);
          toast.error('Failed to load bug details');
        }
      };
      
      fetchBugDetails();
    } else {
      // If no bugId provided, redirect to bug listings
      navigate('/dashboard/researcher/bugs');
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
  
  if (!bugDetails) {
    return (
      <DashboardLayout userRole="researcher">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading bug details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout userRole="researcher">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Submit Bug Fix</h1>
      </div>
      
      <div className="card mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Bug Details</h2>
        <div className="mb-4">
          <p className="text-lg font-medium text-white">{bugDetails.title}</p>
          <p className="text-gray-400 mt-1">Severity: <span className="capitalize">{bugDetails.severity}</span></p>
          <p className="text-gray-400">Reward: ${bugDetails.reward.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="text-md font-medium text-white mb-2">Description</h3>
          <p className="text-gray-300 bg-gray-800 p-4 rounded-md border border-gray-700">
            {bugDetails.description}
          </p>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Your Solution</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fixDescription" className="block text-sm font-medium text-gray-300 mb-1">
              Fix Description *
            </label>
            <textarea
              id="fixDescription"
              name="fixDescription"
              rows="6"
              required
              className="input"
              value={formData.fixDescription}
              onChange={handleChange}
              placeholder="Describe your approach to fixing this bug in detail. Include your methodology and why your solution works."
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="proofOfFix" className="block text-sm font-medium text-gray-300 mb-1">
              Proof of Fix *
            </label>
            <input
              id="proofOfFix"
              name="proofOfFix"
              type="text"
              required
              className="input"
              value={formData.proofOfFix}
              onChange={handleChange}
              placeholder="GitHub PR link, CodeSandbox, or any verifiable proof of your solution"
            />
            <p className="text-sm text-gray-400 mt-1">
              Provide a link to a GitHub PR, Gist, CodeSandbox, or any other evidence that demonstrates your fix works.
            </p>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              <FaSave className="mr-2" /> {loading ? 'Submitting...' : 'Submit Fix'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateSubmission;