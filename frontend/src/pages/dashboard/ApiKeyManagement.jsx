// src/pages/dashboard/ApiKeyManagement.jsx - Update component

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaKey, FaSave, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { authService } from '../../services/auth.service';
import api from '../../services/api';

const ApiKeyManagement = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyStatus, setKeyStatus] = useState('unknown'); // 'unknown', 'valid', 'invalid'
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if API key is already set and valid
  useEffect(() => {
    const checkApiKey = async () => {
      if (!user || !user.paymanApiKey) {
        setKeyStatus('unknown');
        return;
      }
      
      try {
        // Try to fetch balance to verify the key works
        await api.get('/auth/balance');
        setKeyStatus('valid');
      } catch (error) {
        console.error('API key validation error:', error);
        setKeyStatus('invalid');
      }
    };
    
    checkApiKey();
  }, [user]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      return toast.error('Please enter a valid API key');
    }
    
    setLoading(true);
    
    try {
      await authService.updateApiKey(apiKey);
      toast.success('API key updated successfully');
      setKeyStatus('valid');
      
      // Optionally verify the key immediately
      try {
        await api.get('/auth/balance');
      } catch (keyError) {
        setKeyStatus('invalid');
        toast.error('API key saved but appears to be invalid. Please check the key and try again.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update API key');
      setKeyStatus('invalid');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout userRole="company">
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white">API Key Management</h2>
          {keyStatus === 'valid' && (
            <div className="flex items-center text-green-500">
              <FaCheckCircle className="mr-2" />
              <span>Valid API Key</span>
            </div>
          )}
          {keyStatus === 'invalid' && (
            <div className="flex items-center text-red-500">
              <span>Invalid API Key</span>
            </div>
          )}
        </div>
        
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
        
        {keyStatus === 'valid' && (
          <div className="mt-8 bg-gray-800 p-4 rounded-lg border border-green-600">
            <h3 className="text-lg font-medium text-white mb-2">API Key Status: Valid</h3>
            <p className="text-gray-300">
              Your PaymanAI API key is valid and working correctly. You can now post bug bounties and process payments.
            </p>
            <button 
              onClick={() => navigate('/dashboard/company')}
              className="btn btn-outline mt-4"
            >
              Return to Dashboard
            </button>
          </div>
        )}
        
        {keyStatus === 'invalid' && (
          <div className="mt-8 bg-gray-800 p-4 rounded-lg border border-red-600">
            <h3 className="text-lg font-medium text-white mb-2">API Key Status: Invalid</h3>
            <p className="text-gray-300">
              There was an issue with your API key. Please check that you've entered it correctly and try again.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApiKeyManagement;