// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { BackgroundBeams } from '../components/ui/backgroun-beams';

const Home = () => {
  return (
    <div className="bg-black min-h-screen relative">
      {/* Background component */}
      <div className="absolute inset-0">
        <BackgroundBeams />
      </div>
      
      {/* Content with higher z-index */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
            Secure More, Reward Faster  
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Join the future of cybersecurity where researchers and companies collaborate to build a safer digital world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/register" 
              state={{ role: 'researcher' }} 
              className="btn btn-outline py-4 px-8 rounded-full text-lg border-2 flex items-center hover:bg-secondary hover:border-secondary hover:text-white hover:scale-105 transition duration-300"
            >
              Join as Researcher <FaArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/sponsor" 
              className="btn btn-outline py-4 px-8 rounded-full text-lg border-2 flex items-center hover:bg-secondary hover:border-secondary hover:text-white hover:scale-105 transition duration-300"
            >
              Join as Company <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;