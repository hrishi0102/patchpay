// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaCheck, FaUserShield, FaBuilding } from 'react-icons/fa';
import { authService } from '../../services/auth.service';

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get role from location state or default to 'researcher'
  const defaultRole = location.state?.role || 'researcher';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength when password field changes
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };
  
  const checkPasswordStrength = (password) => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Contains number
    if (/\d/.test(password)) score += 1;
    
    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    // Contains uppercase and lowercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    
    return Math.min(score, 4); // Max strength of 4
  };
  
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-600';
      case 1: return 'bg-red-600';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-600';
    }
  };
  
  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Too weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
    
    if (passwordStrength < 2) {
      return toast.error('Please use a stronger password', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
    
    setLoading(true);
    
    try {
      await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      
      toast.success('Registration successful! Please sign in.', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate('/login', { state: { role: formData.role } });
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.', {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Full Name
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="h-5 w-5 text-gray-500" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary-dark text-gray-200 placeholder-gray-500 transition-all"
            placeholder="John Smith"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email Address
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="h-5 w-5 text-gray-500" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary-dark text-gray-200 placeholder-gray-500 transition-all"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="w-3/4 bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getStrengthColor()}`} 
                  style={{ width: `${passwordStrength * 25}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400">{getStrengthText()}</span>
            </div>
            <p className="text-xs text-gray-500">Use at least 8 characters, numbers and special characters</p>
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
          Confirm Password
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaCheck className="h-5 w-5 text-gray-500" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary-dark text-gray-200 placeholder-gray-500 transition-all"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {formData.password && formData.confirmPassword && (
          <div className="mt-1">
            {formData.password === formData.confirmPassword ? (
              <p className="text-xs text-green-500 flex items-center">
                <FaCheck className="mr-1" /> Passwords match
              </p>
            ) : (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div 
            className={`flex items-center justify-center p-3 rounded-lg cursor-pointer border-2 transition-all ${
              formData.role === 'researcher' 
                ? 'bg-primary/10 border-primary' 
                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, role: 'researcher' }))}
          >
            <input
              type="radio"
              name="role"
              id="role-researcher"
              value="researcher"
              className="sr-only"
              checked={formData.role === 'researcher'}
              onChange={handleChange}
            />
            <label htmlFor="role-researcher" className="flex flex-col items-center cursor-pointer">
              <FaUserShield className={`text-xl mb-1 ${formData.role === 'researcher' ? 'text-primary' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${formData.role === 'researcher' ? 'text-primary' : 'text-gray-400'}`}>
                Researcher
              </span>
            </label>
          </div>
          
          <div 
            className={`flex items-center justify-center p-3 rounded-lg cursor-pointer border-2 transition-all ${
              formData.role === 'company' 
                ? 'bg-primary/10 border-primary' 
                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, role: 'company' }))}
          >
            <input
              type="radio"
              name="role"
              id="role-company"
              value="company"
              className="sr-only"
              checked={formData.role === 'company'}
              onChange={handleChange}
            />
            <label htmlFor="role-company" className="flex flex-col items-center cursor-pointer">
              <FaBuilding className={`text-xl mb-1 ${formData.role === 'company' ? 'text-primary' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${formData.role === 'company' ? 'text-primary' : 'text-gray-400'}`}>
                Company
              </span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-secondary to-secondary-dark hover:from-secondary-dark hover:to-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary focus:ring-offset-gray-900 transform transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </div>
      
      <div className="text-center mt-4 text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" state={{ role: formData.role }} className="text-secondary hover:text-secondary-dark transition-colors">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;