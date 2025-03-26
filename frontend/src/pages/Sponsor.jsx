// src/pages/Sponsor.jsx
import { Link } from 'react-router-dom';
import { FaLock, FaSearch, FaMoneyBillWave, FaShieldAlt, FaRocket } from 'react-icons/fa';

const Sponsor = () => {
  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24">
        <div className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary to-primary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
              Become a Sponsor
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Join our platform as a company sponsor and get access to talented security researchers worldwide.
              Fix bugs faster and improve your security posture with our community-driven approach.
            </p>
            <div className="mt-10 flex justify-center">
              <Link 
                to="/register" 
                className="btn btn-primary py-3 px-8 rounded-full text-lg shadow-lg transform transition-all hover:scale-105"
                state={{ role: 'company' }}
              >
                Join as a Company
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Why Companies Choose Us</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Our platform provides security-conscious companies with the tools they need to identify and fix vulnerabilities quickly.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-y-10 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative backdrop-blur-sm bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-xl transform transition-all hover:scale-105">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary/10 p-4 rounded-full border border-primary/20">
                  <FaShieldAlt className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-white text-center">Improve Security</h3>
                <p className="mt-3 text-center text-gray-400">
                  Find and fix security vulnerabilities in your applications before they become problems.
                </p>
              </div>

              <div className="relative backdrop-blur-sm bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-xl transform transition-all hover:scale-105">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary/10 p-4 rounded-full border border-primary/20">
                  <FaSearch className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-white text-center">Access Top Talent</h3>
                <p className="mt-3 text-center text-gray-400">
                  Connect with skilled security researchers who can help strengthen your defenses.
                </p>
              </div>

              <div className="relative backdrop-blur-sm bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-xl transform transition-all hover:scale-105">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary/10 p-4 rounded-full border border-primary/20">
                  <FaMoneyBillWave className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-white text-center">Pay for Results</h3>
                <p className="mt-3 text-center text-gray-400">
                  Only pay for successful bug fixes with secure PaymanAI integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">How It Works</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Our streamlined process makes it easy to start improving your security posture right away.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid grid-cols-1 gap-y-8 gap-x-16 md:grid-cols-2">
              <div className="flex flex-col items-center bg-gray-800/20 p-6 rounded-xl border border-gray-700">
                <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Register Your Company</h3>
                <p className="mt-2 text-center text-gray-400">
                  Create a company account and set up your Payman API key to enable payments.
                </p>
              </div>
              
              <div className="flex flex-col items-center bg-gray-800/20 p-6 rounded-xl border border-gray-700">
                <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Post Bug Bounties</h3>
                <p className="mt-2 text-center text-gray-400">
                  List the security vulnerabilities you need fixed and set appropriate rewards.
                </p>
              </div>
              
              <div className="flex flex-col items-center bg-gray-800/20 p-6 rounded-xl border border-gray-700">
                <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Review Submissions</h3>
                <p className="mt-2 text-center text-gray-400">
                  Evaluate solutions submitted by security researchers from our global community.
                </p>
              </div>
              
              <div className="flex flex-col items-center bg-gray-800/20 p-6 rounded-xl border border-gray-700">
                <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
                  <span className="text-xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Secure Payment Processing</h3>
                <p className="mt-2 text-center text-gray-400">
                  Automatically pay successful researchers through secure PaymanAI integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-gray-800"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-700 shadow-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">Ready to enhance your security?</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300 text-center">
              Join our platform today and connect with skilled security researchers who can help protect your business.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link 
                to="/register" 
                className="btn btn-primary py-3 px-6 rounded-full shadow-lg transform transition-all hover:scale-105"
                state={{ role: 'company' }}
              >
                Sign Up as a Company
              </Link>
              <Link 
                to="/login" 
                className="btn btn-outline py-3 px-6 rounded-full border-2 transform transition-all hover:scale-105 hover:bg-primary hover:border-primary hover:text-white"
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