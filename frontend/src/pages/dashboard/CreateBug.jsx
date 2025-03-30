// src/pages/dashboard/CreateBug.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import CompanyLayout from '../../components/layout/CompanyLayout';
import api from '../../services/api';

const CreateBug = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    reward: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'reward' ? 
        (value === '' ? '' : parseFloat(value)) : 
        value 
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.reward) {
      return toast.error('Please fill in all required fields');
    }
    
    setLoading(true);
    
    try {
      await api.post('/bugs', formData);
      toast.success('Bug listing created successfully');
      navigate('/dashboard/company');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create bug listing';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/dashboard/company');
  };
  
  return (
    <CompanyLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Post New Bug</h1>
      </div>
      
      <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full px-4 py-2 bg-black/50 rounded-md border border-gray-700 
                        text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                        focus:ring-emerald-500 focus:border-transparent"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Cross-Site Scripting Vulnerability in Login Form"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows="6"
              required
              className="w-full px-4 py-2 bg-black/50 rounded-md border border-gray-700 
                        text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                        focus:ring-emerald-500 focus:border-transparent"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the vulnerability, including steps to reproduce and impact"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-300 mb-1">
                Severity *
              </label>
              <select
                id="severity"
                name="severity"
                required
                className="w-full px-4 py-2 bg-black/50 rounded-md border border-gray-700 
                          text-gray-100 focus:outline-none focus:ring-2 
                          focus:ring-emerald-500 focus:border-transparent"
                value={formData.severity}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="reward" className="block text-sm font-medium text-gray-300 mb-1">
                Reward (USD) *
              </label>
              <input
                id="reward"
                name="reward"
                type="number"
                required
                min="1"
                step="0.01"
                className="w-full px-4 py-2 bg-black/50 rounded-md border border-gray-700 
                          text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                          focus:ring-emerald-500 focus:border-transparent"
                value={formData.reward}
                onChange={handleChange}
                placeholder="e.g., 500"
              />
            </div>
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
              <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Bug Listing'}
            </button>
          </div>
        </form>
      </div>
    </CompanyLayout>
  );
};

export default CreateBug;