// src/pages/dashboard/ApiKeyManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaKey, FaSave, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import CompanyLayout from '../../components/layout/CompanyLayout';
import { authService } from '../../services/auth.service';
import api from '../../services/api';

const ApiKeyManagement = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyStatus, setKeyStatus] = useState('unknown'); // 'unknown', 'valid', 'invalid'
  const [balance, setBalance] = useState(null);
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
        const balanceResponse = await api.get('/auth/balance');
        setBalance(balanceResponse.data.balance);
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
      
      // Optionally verify the key immediately
      try {
        const balanceResponse = await api.get('/auth/balance');
        setBalance(balanceResponse.data.balance);
        setKeyStatus('valid');
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
    <CompanyLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">API Key Management</h1>
      </div>
      
      <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-medium text-white">PaymanAI Integration</h2>
              <p className="text-gray-400 mt-1">Configure your payment provider API key</p>
            </div>
            
            {keyStatus === 'valid' && (
              <div className="flex items-center text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-800/30">
                <FaCheckCircle className="mr-2" />
                <span>Valid API Key</span>
              </div>
            )}
            {keyStatus === 'invalid' && (
              <div className="flex items-center text-red-400 bg-red-900/20 px-3 py-1 rounded-full border border-red-800/30">
                <FaTimesCircle className="mr-2" />
                <span>Invalid API Key</span>
              </div>
            )}
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg border border-gray-800 mb-6">
            <div className="flex items-start">
              <div className="mr-3 mt-1 p-2 bg-emerald-900/20 rounded-md border border-emerald-800/30">
                <FaInfoCircle className="text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-300">
                  You need to add your PaymanAI API key before posting bug bounties. This key is used to securely process payments to researchers who fix your bugs.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Your API key is encrypted and securely stored. No payment data is shared with third parties.
                </p>
              </div>
            </div>
          </div>
          
          {balance !== null && (
            <div className="mb-6 bg-emerald-900/10 p-4 rounded-lg border border-emerald-900/20">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                <FaKey className="mr-2 text-emerald-400" /> 
                Account Balance
              </h3>
              <div className="text-3xl font-bold text-emerald-400">
                ${balance.toFixed(2)} <span className="text-sm text-gray-400">USD</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Available for bug bounty payments
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                PaymanAI API Key
              </label>
              <div className="flex">
                <div className="flex-shrink-0 inline-flex items-center px-3 py-2 bg-gray-800 border border-r-0 border-gray-700 rounded-l-md">
                  <FaKey className="text-gray-400" />
                </div>
                <input
                  id="apiKey"
                  type="text"
                  className="flex-1 w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-r-md
                            text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                            focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your PaymanAI API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-400">
                  Get your key from the PaymanAI Dashboard
                </p>
                <a 
                  href="https://app.paymanai.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center"
                >
                  Go to PaymanAI <FaExternalLinkAlt className="ml-1 text-xs" />
                </a>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <FaSave className="mr-2" />
                {loading ? 'Saving...' : 'Save API Key'}
              </button>
            </div>
          </form>
          
          {keyStatus === 'valid' && (
            <div className="mt-8 bg-emerald-900/10 p-5 rounded-lg border border-emerald-900/30">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                <FaCheckCircle className="mr-2 text-emerald-400" /> API Key Status: Valid
              </h3>
              <p className="text-gray-300">
                Your PaymanAI API key is valid and working correctly. You can now post bug bounties and process payments.
              </p>
              <button 
                onClick={() => navigate('/dashboard/company')}
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-white transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          )}
          
          {keyStatus === 'invalid' && (
            <div className="mt-8 bg-red-900/10 p-5 rounded-lg border border-red-800/30">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                <FaTimesCircle className="mr-2 text-red-500" /> API Key Status: Invalid
              </h3>
              <p className="text-gray-300">
                There was an issue with your API key. Please check that you've entered it correctly and try again.
              </p>
              <ul className="mt-3 space-y-1 text-gray-400 text-sm list-disc pl-5">
                <li>Make sure you copied the full API key</li>
                <li>Check that your PaymanAI account is active</li>
                <li>Try regenerating a new key in the PaymanAI dashboard</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </CompanyLayout>
  );
};

export default ApiKeyManagement;