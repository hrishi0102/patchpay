// src/pages/Login.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaUserShield, FaBuilding, FaLock } from 'react-icons/fa';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const location = useLocation();
  const role = location.state?.role || 'researcher';
  
  return (
    <div className="bg-black min-h-screen py-16">
 
      <div className="relative z-10 mx-auto max-w-md px-6">
        <div className="backdrop-blur-md bg-gray-900/70 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 border border-secondary/20">
                {role === 'company' ? (
                  <FaBuilding className="text-secondary text-2xl" />
                ) : (
                  <FaUserShield className="text-secondary text-2xl" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary-dark">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-400">
                Sign in as {role === 'company' ? 'Company' : 'Researcher'}
              </p>
            </div>
            
            <LoginForm />
            
            <div className="relative my-8">
            </div>
            
            
            <div className="mt-8 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                state={{ role }} 
                className="text-secondary hover:text-secondary-dark transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-secondary/10 to-secondary/10 py-4 px-8 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                &larr; Back to Home
              </Link>
              <Link 
                to={role === 'company' ? '/register' : '/register'} 
                state={{ role: role === 'company' ? 'researcher' : 'company' }} 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sign in as {role === 'company' ? 'Researcher' : 'Company'} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;