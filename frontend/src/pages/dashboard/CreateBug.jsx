// src/pages/dashboard/CreateBug.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaSave, FaTimes } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
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
      navigate('/dashboard/company/bugs');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create bug listing';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/dashboard/company/bugs');
  };
  
  return (
    <DashboardLayout userRole="company">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Post New Bug</h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="input"
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
              className="input"
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
                className="input"
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
                className="input"
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
              className="btn btn-outline flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Bug Listing'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateBug;