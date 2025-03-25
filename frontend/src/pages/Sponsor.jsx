// src/pages/Sponsor.jsx
import { Link } from 'react-router-dom';
import { FaLock, FaSearch, FaMoneyBillWave } from 'react-icons/fa';

const Sponsor = () => {
  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Become a Sponsor
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Join our platform as a company sponsor and get access to talented security researchers worldwide.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card flex flex-col items-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <FaLock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">Improve Security</h3>
              <p className="mt-3 text-center text-gray-400">
                Find and fix security vulnerabilities in your applications before they become problems.
              </p>
            </div>

            <div className="card flex flex-col items-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <FaSearch className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">Access Top Talent</h3>
              <p className="mt-3 text-center text-gray-400">
                Connect with skilled security researchers who can help strengthen your defenses.
              </p>
            </div>

            <div className="card flex flex-col items-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <FaMoneyBillWave className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">Pay for Results</h3>
              <p className="mt-3 text-center text-gray-400">
                Only pay for successful bug fixes with secure PaymanAI integration.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-white">Ready to enhance your security?</h2>
            <div className="mt-8 flex justify-center gap-4">
              <Link 
                to="/register" 
                className="btn btn-primary py-2 px-6"
                state={{ role: 'company' }}
              >
                Sign Up as a Company
              </Link>
              <Link 
                to="/login" 
                className="btn btn-outline py-2 px-6"
                state={{ role: 'company' }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsor;