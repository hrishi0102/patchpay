// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaCodeBranch, FaCoins } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Secure Software, Rewarded Skills
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Connect talented security researchers with companies looking to improve their security posture.
              Find bugs, fix vulnerabilities, and get rewarded for your skills.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register" className="btn btn-primary py-3 px-6">
                Join as Researcher
              </Link>
              <Link to="/sponsor" className="btn btn-outline py-3 px-6">
                Become a Sponsor
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
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <FaShieldAlt className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-white">Companies Post Bugs</dt>
                <dd className="mt-4 text-base leading-7 text-gray-400 text-center">
                  Companies list security vulnerabilities they want fixed, along with rewards for successful solutions.
                </dd>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <FaCodeBranch className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-white">Researchers Submit Fixes</dt>
                <dd className="mt-4 text-base leading-7 text-gray-400 text-center">
                  Security researchers review bugs, develop fixes, and submit their solutions for review.
                </dd>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <FaCoins className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-white">Get Rewarded</dt>
                <dd className="mt-4 text-base leading-7 text-gray-400 text-center">
                  Successful fixes are rewarded instantly through secure PaymanAI transactions.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to get started?</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Join our platform today and be part of the growing community of security experts and forward-thinking companies.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register" className="btn btn-primary py-3 px-6">
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