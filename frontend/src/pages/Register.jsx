// src/pages/Register.jsx
import { useLocation } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  const location = useLocation();
  const role = location.state?.role || 'researcher';
  
  return (
    <div className="bg-gray-900 py-16">
      <div className="mx-auto max-w-md px-6">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              Sign Up as {role === 'company' ? 'Company' : 'Researcher'}
            </h2>
            <p className="mt-2 text-gray-400">
              Create an account to get started.
            </p>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;