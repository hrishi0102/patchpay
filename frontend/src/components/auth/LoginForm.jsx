// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get role from location state or default to 'researcher'
  const defaultRole = location.state?.role || 'researcher';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userData = await authService.login(formData.email, formData.password);
      
      login(userData);
      toast.success('Login successful!', {
        icon: '🔐',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      // Redirect based on user role
      if (userData.role === 'company') {
        navigate('/dashboard/company');
      } else {
        navigate('/dashboard/researcher');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to login. Please try again.', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="h-5 w-5 text-gray-500" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary-dark text-gray-200 placeholder-gray-500 transition-all"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <a href="#" className="text-xs text-secondary hover:text-secondary-dark transition-colors">
            Forgot password?
          </a>
        </div>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="h-5 w-5 text-gray-500" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary-dark text-gray-200 placeholder-gray-500 transition-all"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-secondary focus:ring-secondary"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
          Remember me
        </label>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-secondary to-secondary-dark hover:from-secondary-dark hover:to-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary focus:ring-offset-gray-900 transform transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          <FaSignInAlt className={loading ? "animate-pulse mr-2" : "mr-2"} />
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;