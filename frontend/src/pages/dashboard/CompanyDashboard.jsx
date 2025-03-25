// src/pages/dashboard/CompanyDashboard.jsx (enhanced version)
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBugs: 0,
    pendingSubmissions: 0,
    balance: 0
  });
  const [recentBugs, setRecentBugs] = useState([]);
  
  // Fetch company data
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
        const bugsResponse = await api.get('/bugs/company/list');
        const bugs = bugsResponse.data;
        
        // Set recent bugs (most recent 3)
        setRecentBugs(bugs.slice(0, 3));
        
        // Calculate active bugs (open or in_progress)
        const activeBugs = bugs.filter(bug => 
          bug.status === 'open' || bug.status === 'in_progress').length;
        
        // Count pending submissions for each bug
        let pendingSubmissionsCount = 0;
        for (const bug of bugs) {
          try {
            const submissionsResponse = await api.get(`/submissions/bug/${bug._id}`);
            const pendingSubmissions = submissionsResponse.data.filter(
              submission => submission.status === 'pending'
            );
            pendingSubmissionsCount += pendingSubmissions.length;
          } catch (error) {
            console.error(`Error fetching submissions for bug ${bug._id}:`, error);
          }
        }
        
        // Update stats with bug and submission counts
        setStats(prev => ({
          ...prev,
          activeBugs,
          pendingSubmissions: pendingSubmissionsCount
        }));
        
        // If the company has provided an API key, try to fetch their Payman balance
        if (user.paymanApiKey) {
          try {
            // This endpoint would need to be implemented in your backend
            const balanceResponse = await api.get('/auth/balance');
            setStats(prev => ({
              ...prev,
              balance: balanceResponse.data.balance || 0
            }));
          } catch (error) {
            console.error('Error fetching balance:', error);
            // Default balance to 0 if we can't fetch it
            setStats(prev => ({ ...prev, balance: 0 }));
          }
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-4">Company Overview</h2>
          <p className="text-gray-300 mb-4">
            Welcome to your company dashboard. Here you can post bug bounties, review submissions, and manage payments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : stats.activeBugs}
              </div>
              <div className="text-gray-400">Active Bugs</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : stats.pendingSubmissions}
              </div>
              <div className="text-gray-400">Pending Submissions</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : `$${stats.balance.toFixed(2)}`}
              </div>
              <div className="text-gray-400">Balance</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Bug Posts</h2>
            <Link to="/dashboard/company/bugs/create" className="btn btn-primary flex items-center">
              <FaPlus className="mr-2" /> Post New Bug
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
          ) : recentBugs.length === 0 ? (
            <p className="text-gray-400">No bug listings available yet.</p>
          ) : (
            <div className="space-y-4">
              {recentBugs.map(bug => (
                <div key={bug._id} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                  <div className="flex justify-between items-start">
                    <Link to={`/dashboard/bugs/${bug._id}`} className="text-lg font-medium text-white hover:text-primary">
                      {bug.title}
                    </Link>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                      bug.severity === 'critical' ? 'bg-red-600' :
                      bug.severity === 'high' ? 'bg-orange-600' :
                      bug.severity === 'medium' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      {bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                      Status: <span className="capitalize">{bug.status}</span>
                    </span>
                    <span className="text-primary font-medium">${bug.reward.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              
              {recentBugs.length > 0 && (
                <div className="text-center mt-4">
                  <Link to="/dashboard/company/bugs" className="text-primary hover:underline">
                    View all bugs
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        {!user.paymanApiKey && (
          <div className="bg-gray-800 p-6 rounded-lg border border-yellow-600">
            <h3 className="text-lg font-medium text-white mb-2">Action Required: API Key Missing</h3>
            <p className="text-gray-300 mb-4">
              You need to set up your PaymanAI API key before you can post bug bounties.
            </p>
            <Link to="/dashboard/company/api-key" className="btn btn-primary">
              Set Up API Key
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;