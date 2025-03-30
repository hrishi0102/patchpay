// src/pages/dashboard/CompanyDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaKey, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
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
  const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState(0);
  const [pendingBugs, setPendingBugs] = useState([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    } else if (user.role !== 'company') {
      navigate('/dashboard/researcher');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch company bugs
        const response = await api.get('/bugs/company/list');
        const bugsData = response.data;
        setBugs(bugsData);

        // Find bugs with status "in_progress" that might have pending submissions
        const inProgressBugs = bugsData.filter(bug => bug.status === 'in_progress');
        
        // If there are in-progress bugs, check for pending submissions
        let totalPendingCount = 0;
        const bugsWithPendingSubmissions = [];
        
        for (const bug of inProgressBugs) {
          try {
            const submissionsResponse = await api.get(`/submissions/bug/${bug._id}`);
            const pendingSubmissions = submissionsResponse.data.filter(
              submission => submission.status === 'pending'
            );
            
            if (pendingSubmissions.length > 0) {
              totalPendingCount += pendingSubmissions.length;
              bugsWithPendingSubmissions.push({
                ...bug,
                pendingSubmissionsCount: pendingSubmissions.length
              });
            }
          } catch (error) {
            console.error(`Error fetching submissions for bug ${bug._id}:`, error);
          }
        }
        
        setPendingSubmissionsCount(totalPendingCount);
        setPendingBugs(bugsWithPendingSubmissions);
        
      } catch (error) {
        console.error('Error fetching bugs:', error);
        toast.error('Failed to load bug listings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
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
      
      {/* Pending submissions alert */}
      {pendingSubmissionsCount > 0 && (
        <div className="mb-8 bg-yellow-900/20 border border-yellow-800/40 rounded-lg p-4">
          <div className="flex items-start">
            <div className="p-2 bg-yellow-900/30 rounded-full border border-yellow-800/50 mr-4">
              <FaExclamationTriangle className="text-yellow-400" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">
                You have {pendingSubmissionsCount} pending submission{pendingSubmissionsCount !== 1 ? 's' : ''} to review
              </h3>
              <p className="text-gray-300 mb-3">
                Researchers are waiting for your feedback on their fixes. Please review these submissions to keep the process moving.
              </p>
              <div className="space-y-2">
                {pendingBugs.map(bug => (
                  <div key={bug._id} className="bg-black/40 p-2 rounded flex justify-between items-center">
                    <span className="text-gray-300">{bug.title}</span>
                    <Link 
                      to={`/dashboard/bugs/${bug._id}`}
                      className="px-3 py-1 bg-yellow-900/30 text-yellow-400 text-sm rounded border border-yellow-800/50 hover:bg-yellow-900/50 transition-colors"
                    >
                      Review {bug.pendingSubmissionsCount} submission{bug.pendingSubmissionsCount !== 1 ? 's' : ''}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* API Key warning if needed */}
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
      
      {/* Bug listings grid */}
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