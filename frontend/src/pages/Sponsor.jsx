// src/pages/Sponsor.jsx
import { useNavigate } from 'react-router-dom';
import { FaBug, FaCheckCircle, FaCreditCard } from 'react-icons/fa';

const Sponsor = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/register', { state: { role: 'company' } });
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-900/20 to-transparent"></div>
      
      {/* Glass card */}
      <div className="relative z-10 max-w-2xl w-full mx-6 backdrop-blur-lg bg-black/40 rounded-xl border border-emerald-900/30 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-emerald-900/30">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            Company Sponsorship
          </h1>
          <p className="mt-2 text-gray-400">
            Join our platform and connect with security researchers to fix vulnerabilities
          </p>
        </div>
        
        {/* How it works */}
        <div className="p-6">
          <h2 className="text-xl font-medium text-white mb-6">How It Works</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-800/50 flex items-center justify-center mr-4">
                <FaBug className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Post a Bug</h3>
                <p className="text-gray-400 mt-1">
                  Describe the vulnerability and set a reward for successful fixes
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-800/50 flex items-center justify-center mr-4">
                <FaCheckCircle className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Review Submissions</h3>
                <p className="text-gray-400 mt-1">
                  Evaluate fixes submitted by researchers from our global community
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-800/50 flex items-center justify-center mr-4">
                <FaCreditCard className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Secure Payment</h3>
                <p className="text-gray-400 mt-1">
                  Automatically process payments through secure PaymanAI integration
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with CTA */}
        <div className="p-6 border-t border-emerald-900/30 flex justify-center">
          <button 
            onClick={handleJoin}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg flex items-center justify-center"
          >
            Join as Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sponsor;