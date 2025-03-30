// src/pages/dashboard/CompanyDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaKey } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import CompanyLayout from '../../components/layout/CompanyLayout';
import BugCard from '../../components/bugs/BugCard';
import api from '../../services/api';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bugs, setBugs] = useState([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    } else if (user.role !== 'company') {
      navigate('/dashboard/researcher');
      return;
    }

    const fetchBugs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bugs/company/list');
        setBugs(response.data);
      } catch (error) {
        console.error('Error fetching bugs:', error);
        toast.error('Failed to load bug listings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBugs();
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <CompanyLayout>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Bug Listings</h1>
        <Link 
          to="/dashboard/company/bugs/create" 
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" /> Post New Bug
        </Link>
      </div>
      
      {/* API Key warning if needed - with added margin */}
      {!user.paymanApiKey && (
        <div className="mb-8 p-4 border border-yellow-600/50 bg-yellow-900/20 rounded-lg text-yellow-200">
          <p className="flex items-center">
            <FaKey className="mr-2" />
            You need to set up your PaymanAI API key before posting bug bounties.
            <Link to="/dashboard/company/api-key" className="ml-2 underline">
              Set up now
            </Link>
          </p>
        </div>
      )}
      
      {/* Bug listings grid - with increased gap */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loader"></div>
        </div>
      ) : bugs.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/20 border border-gray-800 rounded-lg">
          <h3 className="text-xl font-medium text-white mb-3">No bug listings yet</h3>
          <p className="text-gray-400 mb-8">Post your first bug to start receiving fixes from researchers</p>
          <Link 
            to="/dashboard/company/bugs/create" 
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg inline-flex items-center transition-colors"
          >
            <FaPlus className="mr-2" /> Post Your First Bug
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bugs.map(bug => (
            <BugCard key={bug._id} bug={bug} />
          ))}
        </div>
      )}
    </CompanyLayout>
  );
};

export default CompanyDashboard;