// src/pages/dashboard/ResearcherDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaBug, FaCheckCircle, FaMoneyBill } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import BugCard from '../../components/bugs/BugCard';

const ResearcherDashboardHome = () => {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    approvedSubmissions: 0,
    totalEarnings: 0
  });
  const [recentBugs, setRecentBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch researcher's submissions
        const submissionsResponse = await api.get('/submissions/researcher');
        const submissions = submissionsResponse.data;
        
        // Calculate stats
        const approvedSubmissions = submissions.filter(sub => sub.status === 'approved');
        let totalEarnings = 0;
        
        // Sum up earnings from approved submissions
        approvedSubmissions.forEach(sub => {
          if (sub.bugId && sub.bugId.reward) {
            totalEarnings += sub.bugId.reward;
          }
        });
        
        setStats({
          totalSubmissions: submissions.length,
          approvedSubmissions: approvedSubmissions.length,
          totalEarnings
        });
        
        // Fetch recent open bugs - using the default endpoint for open bugs
        const bugsResponse = await api.get('/bugs');
        
        // Display only the most recent 3 bugs
        setRecentBugs(bugsResponse.data.slice(0, 3));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4">Researcher Overview</h2>
        <p className="text-gray-300 mb-4">
          Welcome to your researcher dashboard. Here you can browse bug listings, submit fixes, and track your earnings.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">
              {loading ? (
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
              ) : (
                stats.totalSubmissions
              )}
            </div>
            <div className="text-gray-400">Total Submissions</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">
              {loading ? (
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
              ) : (
                stats.approvedSubmissions
              )}
            </div>
            <div className="text-gray-400">Approved Fixes</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">
              {loading ? (
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
              ) : (
                `$${stats.totalEarnings.toFixed(2)}`
              )}
            </div>
            <div className="text-gray-400">Total Earnings</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Bug Listings</h2>
          <Link to="/dashboard/researcher/bugs" className="btn btn-outline text-sm">
            View All Bugs
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : recentBugs.length === 0 ? (
          <p className="text-gray-400">No bug listings available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentBugs.map(bug => (
              <BugCard key={bug._id} bug={bug} />
            ))}
          </div>
        )}
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">My Submissions</h2>
          <Link to="/dashboard/researcher/submissions" className="btn btn-outline text-sm">
            View All Submissions
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : stats.totalSubmissions === 0 ? (
          <p className="text-gray-400">You haven't submitted any bug fixes yet.</p>
        ) : (
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-green-500" />
              <span className="text-white">
                You have {stats.totalSubmissions} submission{stats.totalSubmissions !== 1 ? 's' : ''}, with {stats.approvedSubmissions} approved.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ResearcherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'researcher') {
      navigate('/dashboard/company');
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <DashboardLayout userRole="researcher">
      <ResearcherDashboardHome />
    </DashboardLayout>
  );
};

export default ResearcherDashboard;