// src/pages/Login.jsx
import { Link, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const location = useLocation();
  const role = location.state?.role || 'researcher';
  
  return (
    <div className="bg-gray-900 py-16">
      <div className="mx-auto max-w-md px-6">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              Sign In as {role === 'company' ? 'Company' : 'Researcher'}
            </h2>
            <p className="mt-2 text-gray-400">
              Welcome back! Please enter your credentials.
            </p>
          </div>
          
          <LoginForm />
          
          <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              state={{ role }} 
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;