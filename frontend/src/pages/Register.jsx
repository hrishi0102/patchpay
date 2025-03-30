// src/pages/Register.jsx
import { useLocation } from 'react-router-dom';
import { FaUserShield, FaBuilding } from 'react-icons/fa';
import RegisterForm from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const Register = () => {
  const location = useLocation();
  const role = location.state?.role || 'researcher';
  
  return (
    <div className="bg-black min-h-screen py-12">
      
      <div className="relative z-10 mx-auto max-w-lg px-6">
        <div className="backdrop-blur-md bg-gray-900/70 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 border border-secondary/20">
                {role === 'company' ? (
                  <FaBuilding className="text-secondary text-2xl" />
                ) : (
                  <FaUserShield className="text-secondary text-2xl" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary-dark">
                Create Account
              </h2>
              <p className="mt-2 text-gray-400">
                Join as {role === 'company' ? 'Company' : 'Researcher'} and get started today
              </p>
            </div>
            
            <RegisterForm />
          </div>
          
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 py-4 px-8 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                &larr; Back to Home
              </Link>
              <Link 
                to={role === 'company' ? '/register' : '/register'} 
                state={{ role: role === 'company' ? 'researcher' : 'company' }} 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Register as {role === 'company' ? 'Researcher' : 'Company'} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;