// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaCodeBranch, FaCoins, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Secure Software, Rewarded Skills
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Connect talented security researchers with companies looking to improve their security posture.
              Find bugs, fix vulnerabilities, and get rewarded for your skills.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register" state={{ role: 'researcher' }} className="btn btn-primary py-3 px-6 rounded-full transform transition-all hover:scale-105 flex items-center">
                Join as Researcher <FaArrowRight className="ml-2" />
              </Link>
              <Link to="/sponsor" className="btn btn-outline py-3 px-6 rounded-full border-2 transform transition-all hover:scale-105 hover:bg-primary hover:border-primary hover:text-white flex items-center">
                Join as Company <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">How It Works</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Our platform connects security researchers with companies looking to improve their security
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative backdrop-blur-sm bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-xl transform transition-all hover:scale-105">
                <div className="absolute -top-4 -left-4 bg-primary/10 p-4 rounded-xl border border-primary/20 mb-4">
                  <FaShieldAlt className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <dt className="mt-4 text-xl font-semibold leading-7 text-white">Companies Post Bugs</dt>
                <dd className="mt-4 text-base leading-7 text-gray-400">
                  Companies list security vulnerabilities they want fixed, along with rewards for successful solutions.
                </dd>
              </div>
              <div className="relative backdrop-blur-sm bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-xl transform transition-all hover:scale-105">
                <div className="absolute -top-4 -left-4 bg-primary/10 p-4 rounded-xl border border-primary/20 mb-4">
                  <FaCodeBranch className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <dt className="mt-4 text-xl font-semibold leading-7 text-white">Researchers Submit Fixes</dt>
                <dd className="mt-4 text-base leading-7 text-gray-400">
                  Security researchers review bugs, develop fixes, and submit their solutions for review.
                </dd>
              </div>
              <div className="relative backdrop-blur-sm bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-xl transform transition-all hover:scale-105">
                <div className="absolute -top-4 -left-4 bg-primary/10 p-4 rounded-xl border border-primary/20 mb-4">
                  <FaCoins className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <dt className="mt-4 text-xl font-semibold leading-7 text-white">Get Rewarded</dt>
                <dd className="mt-4 text-base leading-7 text-gray-400">
                  Successful fixes are rewarded instantly through secure PaymanAI transactions.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-700 shadow-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">Ready to get started?</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300 text-center">
              Join our platform today and be part of the growing community of security experts and forward-thinking companies.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register" className="btn btn-primary py-3 px-8 rounded-full text-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-primary/20 hover:shadow-xl">
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;