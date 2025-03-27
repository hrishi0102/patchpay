// frontend/src/pages/dashboard/CreateBug.jsx 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';

const CreateBug = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    reward: '',
    autoApprovalThreshold: 90,
    testCases: []
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'reward' || name === 'autoApprovalThreshold' ? 
        (value === '' ? '' : parseFloat(value)) : 
        value 
    }));
  };
  
  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, testCases: updatedTestCases }));
  };
  
  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', description: '' }]
    }));
  };
  
  const removeTestCase = (index) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases.splice(index, 1);
    setFormData(prev => ({ ...prev, testCases: updatedTestCases }));
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
          {/* Existing fields remain the same */}
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
          
          {/* New auto-approval section */}
          <div>
            <label htmlFor="autoApprovalThreshold" className="block text-sm font-medium text-gray-300 mb-1">
              Auto-Approval Threshold (%)
            </label>
            <div className="flex items-center">
              <input
                id="autoApprovalThreshold"
                name="autoApprovalThreshold"
                type="number"
                min="0"
                max="100"
                className="input"
                value={formData.autoApprovalThreshold}
                onChange={handleChange}
              />
              <span className="ml-2 text-gray-400">
                Submissions scoring above this threshold will be auto-approved
              </span>
            </div>
          </div>
          
          {/* Test Cases section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Test Cases
              </label>
              <button
                type="button"
                onClick={addTestCase}
                className="btn btn-outline btn-sm flex items-center"
              >
                <FaPlus className="mr-1" /> Add Test Case
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.testCases.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No test cases yet. Test cases help evaluate and auto-approve submissions.
                </p>
              ) : (
                formData.testCases.map((testCase, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-medium">Test Case #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={testCase.description}
                          onChange={(e) => handleTestCaseChange(index, 'description', e.target.value)}
                          className="input"
                          placeholder="Describe what this test case is checking"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Input
                        </label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                          className="input"
                          rows="2"
                          placeholder="Provide input values or conditions"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Expected Output
                        </label>
                        <textarea
                          value={testCase.expectedOutput}
                          onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                          className="input"
                          rows="2"
                          placeholder="Describe what the correct output should be"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))
              )}
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