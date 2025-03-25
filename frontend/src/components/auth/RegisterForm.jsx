// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    
    try {
      await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      
      toast.success('Registration successful! Please sign in.');
      navigate('/login', { state: { role: formData.role } });
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="input mt-1"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input mt-1"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="input mt-1"
          minLength={6}
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="input mt-1"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Account Type
        </label>
        <div className="mt-1 flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="role"
              value="researcher"
              checked={formData.role === 'researcher'}
              onChange={handleChange}
              className="h-4 w-4 text-primary"
            />
            <span className="ml-2 text-gray-300">Researcher</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="role"
              value="company"
              checked={formData.role === 'company'}
              onChange={handleChange}
              className="h-4 w-4 text-primary"
            />
            <span className="ml-2 text-gray-300">Company</span>
          </label>
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary py-2"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </div>
      
      <div className="text-center mt-4 text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" state={{ role: formData.role }} className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;