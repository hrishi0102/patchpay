// src/pages/dashboard/ApiKeyManagement.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaKey, FaSave } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { authService } from '../../services/auth.service';

const ApiKeyManagement = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      return toast.error('Please enter a valid API key');
    }
    
    setLoading(true);
    
    try {
      await authService.updateApiKey(apiKey);
      toast.success('API key updated successfully');
      // Navigate to dashboard after successful update
      navigate('/dashboard/company');
    } catch (error) {
      toast.error(error.message || 'Failed to update API key');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout userRole="company">
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4">API Key Management</h2>
        <p className="text-gray-300 mb-6">
          Configure your PaymanAI API keys to enable bug bounty payments. This key is required before posting bug bounties.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              PaymanAI API Key
            </label>
            <div className="flex">
              <div className="flex-shrink-0 inline-flex items-center px-3 py-2 bg-gray-700 border border-r-0 border-gray-600 rounded-l-md">
                <FaKey className="text-gray-400" />
              </div>
              <input
                id="apiKey"
                type="text"
                className="input rounded-l-none"
                placeholder="Enter your PaymanAI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Your API key is encrypted and securely stored. Get your key from the <a href="https://app.paymanai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PaymanAI Dashboard</a>.
            </p>
          </div>
          
          <div>
            <button 
              type="submit" 
              className="btn btn-primary flex items-center justify-center"
              disabled={loading}
            >
              <FaSave className="mr-2" />
              {loading ? 'Saving...' : 'Save API Key'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ApiKeyManagement;